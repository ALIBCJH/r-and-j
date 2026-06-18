'use client'

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import * as THREE from 'three'

RectAreaLightUniformsLib.init()

type FabricType = 'sheer' | 'linen' | 'velvet' | 'cotton'

interface RoomSceneProps {
  curtainColor: string
  wallColor: string
  floorColor: string
  fabric: FabricType
  curtainsOpen: boolean
  isNight: boolean
  lightIntensity?: number
}

// Pre-allocated color targets (never created per-frame)
const DAY_SKY_COL  = new THREE.Color('#C8E8FF')
const DAY_SKY_EMI  = new THREE.Color('#A8D4FF')
const NIGHT_SKY_COL = new THREE.Color('#04080E')
const NIGHT_SKY_EMI = new THREE.Color('#0A1428')

const CURTAIN_WIDTH = 1.4
const CURTAIN_HEIGHT = 2.6
const CURTAIN_Y = 0.18 + CURTAIN_HEIGHT / 2
const CURTAIN_Z = -2.22
const NUM_FOLDS = 7
const RING_OFFSETS = [-0.58, -0.41, -0.24, -0.08, 0.08, 0.24, 0.41, 0.58]

// Grayscale wood grain — material color tints it to any wood tone
function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Neutral mid-gray base
  ctx.fillStyle = '#BCBCBC'
  ctx.fillRect(0, 0, 1024, 512)

  // Subtle lightness variation across planks
  const grad = ctx.createLinearGradient(0, 0, 1024, 0)
  grad.addColorStop(0,    'rgba(255,255,255,0.06)')
  grad.addColorStop(0.3,  'rgba(0,0,0,0.04)')
  grad.addColorStop(0.6,  'rgba(255,255,255,0.05)')
  grad.addColorStop(1,    'rgba(0,0,0,0.03)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)

  // Plank seams
  for (let i = 1; i < 4; i++) {
    const y = (i / 4) * 512
    ctx.strokeStyle = 'rgba(0,0,0,0.30)'
    ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  // Grain lines
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * 1024
    ctx.strokeStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.08})`
    ctx.lineWidth = 0.4 + Math.random() * 1.8
    ctx.beginPath(); ctx.moveTo(x, 0)
    for (let y = 0; y <= 512; y += 6) {
      ctx.lineTo(x + Math.sin(y * 0.014 + i * 0.6) * 7 + Math.sin(y * 0.038 + i) * 2, y)
    }
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 2)
  tex.anisotropy = 8
  return tex
}

// ─── Curtain ────────────────────────────────────────────────────────────────

function CurtainMesh({ color, fabric, targetX }: { color: string; fabric: FabricType; targetX: number }) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const ringsRef   = useRef<THREE.Group>(null)
  const targetXRef = useRef(targetX)
  const currentXRef = useRef(targetX)
  targetXRef.current = targetX

  const { geometry, basePos } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(CURTAIN_WIDTH, CURTAIN_HEIGHT, NUM_FOLDS * 6, 54)
    const attr = geo.attributes.position as THREE.BufferAttribute
    attr.setUsage(THREE.DynamicDrawUsage)
    const base = new Float32Array(attr.count * 3)
    for (let i = 0; i < attr.count; i++) {
      const x = attr.getX(i)
      const y = attr.getY(i)
      const yNorm = (y + CURTAIN_HEIGHT / 2) / CURTAIN_HEIGHT
      const amp = 0.052 * (1.0 + (1.0 - yNorm) * 0.6)
      const z = Math.sin((x / (CURTAIN_WIDTH / 2)) * Math.PI * NUM_FOLDS) * amp
      attr.setZ(i, z)
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z
    }
    attr.needsUpdate = true
    geo.computeVertexNormals()
    ;(geo.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage)
    return { geometry: geo, basePos: base }
  }, [])

  const material = useMemo(() => {
    const col      = new THREE.Color(color)
    const sheenCol = new THREE.Color(color).multiplyScalar(0.8)
    switch (fabric) {
      case 'sheer':
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          transparent: true, opacity: 0.38,
          roughness: 0.05, metalness: 0,
          envMapIntensity: 0.2,
        })
      case 'velvet':
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.88, metalness: 0,
          sheen: 0.9, sheenRoughness: 0.6, sheenColor: sheenCol,
          envMapIntensity: 0.3,
        })
      case 'linen':
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.88, metalness: 0,
          sheen: 0.9, sheenRoughness: 0.6, sheenColor: sheenCol,
          envMapIntensity: 0.3,
        })
      default: // cotton
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.88, metalness: 0,
          sheen: 0.7, sheenRoughness: 0.7, sheenColor: sheenCol,
          envMapIntensity: 0.3,
        })
    }
  }, [color, fabric])

  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A89878', roughness: 0.15, metalness: 0.85 }), [])

  useEffect(() => () => { geometry.dispose(); material.dispose(); ringMat.dispose() }, [geometry, material, ringMat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetXRef.current, 0.07)
    meshRef.current.position.x = currentXRef.current
    if (ringsRef.current) ringsRef.current.position.x = currentXRef.current

    const dist = Math.abs(currentXRef.current - targetXRef.current)
    const foldMult = 1.0 + Math.min(dist * 0.28, 0.38)

    const attr = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < attr.count; i++) {
      const bx = basePos[i * 3]; const by = basePos[i * 3 + 1]; const bz = basePos[i * 3 + 2]
      const waveZ = Math.sin(bx * 2.2 + t * 0.55) * 0.0075 + Math.sin(bx * 4.3 - t * 0.38 + 1.1) * 0.003 + Math.sin(bx * 7.1 + t * 0.22 + 2.3) * 0.0015
      const swayX = Math.sin(by * 1.4 + t * 0.42) * 0.004 + Math.sin(by * 0.7 - t * 0.29 + 0.9) * 0.002
      attr.setX(i, bx + swayX)
      attr.setZ(i, bz * foldMult + waveZ)
    }
    attr.needsUpdate = true
    // normals intentionally skipped each frame — wave amplitude < 1cm, original normals hold fine
  })

  return (
    <>
      <mesh ref={meshRef} position={[targetX, CURTAIN_Y, CURTAIN_Z]} geometry={geometry} material={material} />
      <group ref={ringsRef} position={[targetX, 2.88, -2.18]}>
        {RING_OFFSETS.map((ox, i) => (
          <mesh key={i} position={[ox, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ringMat}>
            <torusGeometry args={[0.022, 0.006, 10, 20]} />
          </mesh>
        ))}
      </group>
    </>
  )
}

// ─── Animated sky inside window ──────────────────────────────────────────────

function SkyPane({ isNight }: { isNight: boolean }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => {
    const m = matRef.current
    if (!m) return
    const f = 0.025
    m.color.lerp(isNight ? NIGHT_SKY_COL : DAY_SKY_COL, f)
    m.emissive.lerp(isNight ? NIGHT_SKY_EMI : DAY_SKY_EMI, f)
    m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, isNight ? 0.12 : 1.6, f)
  })
  return (
    <mesh position={[0, 1.72, -2.57]}>
      <planeGeometry args={[2.36, 2.04]} />
      <meshStandardMaterial ref={matRef} color="#C8E8FF" emissive="#A8D4FF" emissiveIntensity={1.6} roughness={0} />
    </mesh>
  )
}

// ─── Window ──────────────────────────────────────────────────────────────────

function Window({ wallMat, isNight }: { wallMat: THREE.Material; isNight: boolean }) {
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#EDEDE8', roughness: 0.55, metalness: 0.05 }), [])
  const sillMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8E4DC', roughness: 0.45, metalness: 0.02 }), [])
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C8E0F4', transparent: true, opacity: 0.18, roughness: 0, metalness: 0.12 }), [])
  const rodMat   = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C9A84C', roughness: 0.35, metalness: 0.85, envMapIntensity: 1.2 }), [])
  useEffect(() => () => { frameMat.dispose(); sillMat.dispose(); glassMat.dispose(); rodMat.dispose() }, [frameMat, sillMat, glassMat, rodMat])

  return (
    <group>
      {/* Back wall segments */}
      <mesh position={[-2.1, 1.5, -2.5]} material={wallMat}><boxGeometry args={[1.8, 3, 0.18]} /></mesh>
      <mesh position={[2.1, 1.5, -2.5]} material={wallMat}><boxGeometry args={[1.8, 3, 0.18]} /></mesh>
      <mesh position={[0, 2.72, -2.5]} material={wallMat}><boxGeometry args={[2.4, 0.56, 0.18]} /></mesh>
      <mesh position={[0, 0.35, -2.5]} material={wallMat}><boxGeometry args={[2.4, 0.7, 0.18]} /></mesh>

      {/* Reveal jambs — expose wall thickness */}
      <mesh position={[-1.24, 1.72, -2.46]} material={wallMat}><boxGeometry args={[0.18, 2.06, 0.18]} /></mesh>
      <mesh position={[1.24, 1.72, -2.46]} material={wallMat}><boxGeometry args={[0.18, 2.06, 0.18]} /></mesh>
      <mesh position={[0, 2.72, -2.46]} material={wallMat}><boxGeometry args={[2.66, 0.18, 0.18]} /></mesh>

      <SkyPane isNight={isNight} />

      {/* Glass pane */}
      <mesh position={[0, 1.72, -2.41]}>
        <planeGeometry args={[2.36, 2.04]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* Outer frame */}
      <mesh position={[0, 2.76, -2.41]} material={frameMat}><boxGeometry args={[2.56, 0.10, 0.08]} /></mesh>
      <mesh position={[0, 0.68, -2.41]} material={frameMat}><boxGeometry args={[2.56, 0.10, 0.08]} /></mesh>
      <mesh position={[-1.28, 1.72, -2.41]} material={frameMat}><boxGeometry args={[0.10, 2.18, 0.08]} /></mesh>
      <mesh position={[1.28, 1.72, -2.41]} material={frameMat}><boxGeometry args={[0.10, 2.18, 0.08]} /></mesh>

      {/* Divider bars */}
      <mesh position={[0, 1.72, -2.40]} material={frameMat}><boxGeometry args={[2.56, 0.06, 0.05]} /></mesh>
      <mesh position={[0, 1.72, -2.40]} material={frameMat}><boxGeometry args={[0.06, 2.18, 0.05]} /></mesh>

      {/* Sill */}
      <mesh position={[0, 0.625, -2.32]} material={sillMat}><boxGeometry args={[2.72, 0.06, 0.38]} /></mesh>
      <mesh position={[0, 0.595, -2.14]} material={sillMat}><boxGeometry args={[2.72, 0.03, 0.04]} /></mesh>

      {/* Curtain rod */}
      <mesh position={[0, 2.88, -2.18]} rotation={[0, 0, Math.PI / 2]} material={rodMat}>
        <cylinderGeometry args={[0.026, 0.026, 4.2, 18]} />
      </mesh>
      <mesh position={[-2.12, 2.88, -2.18]} material={rodMat}><sphereGeometry args={[0.056, 16, 16]} /></mesh>
      <mesh position={[2.12, 2.88, -2.18]} material={rodMat}><sphereGeometry args={[0.056, 16, 16]} /></mesh>
      {([-1.6, 0, 1.6] as number[]).map((bx, i) => (
        <group key={i} position={[bx, 2.88, -2.32]}>
          <mesh material={rodMat}><boxGeometry args={[0.04, 0.18, 0.18]} /></mesh>
          <mesh position={[0, 0, 0.06]} material={rodMat}><cylinderGeometry args={[0.018, 0.018, 0.04, 10]} /></mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Room shell ──────────────────────────────────────────────────────────────

function Room({ wallColor, floorColor, isNight }: { wallColor: string; floorColor: string; isNight: boolean }) {
  const wallMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(wallColor), roughness: 0.95, metalness: 0, envMapIntensity: 0.1 }), [wallColor])
  const floorTex = useMemo(() => createWoodTexture(), [])
  // Color tints the grayscale texture — changing floorColor gives different wood species
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({ map: floorTex, color: new THREE.Color(floorColor), roughness: 0.7, metalness: 0.0, envMapIntensity: 0.15 }), [floorTex, floorColor])
  const ceilMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8E4DF', roughness: 0.98, metalness: 0, envMapIntensity: 0.05 }), [])
  const trimMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#EAE6DE', roughness: 0.55, metalness: 0.02 }), [])
  useEffect(() => () => { floorTex.dispose() }, [floorTex])

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat}>
        <planeGeometry args={[6, 5]} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]} material={ceilMat}>
        <planeGeometry args={[6, 5]} />
      </mesh>
      {/* Side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.5, 0]} material={wallMat}><planeGeometry args={[5, 3]} /></mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 1.5, 0]} material={wallMat}><planeGeometry args={[5, 3]} /></mesh>
      {/* Front wall behind viewer */}
      <mesh position={[0, 1.5, 2.5]} material={wallMat}><planeGeometry args={[6, 3]} /></mesh>
      {/* Baseboard */}
      <mesh position={[-3, 0.045, 0]} material={trimMat}><boxGeometry args={[0.06, 0.09, 5]} /></mesh>
      <mesh position={[3, 0.045, 0]} material={trimMat}><boxGeometry args={[0.06, 0.09, 5]} /></mesh>
      <mesh position={[-2.1, 0.045, -2.44]} material={trimMat}><boxGeometry args={[1.8, 0.09, 0.06]} /></mesh>
      <mesh position={[2.1, 0.045, -2.44]} material={trimMat}><boxGeometry args={[1.8, 0.09, 0.06]} /></mesh>
      {/* Crown molding */}
      <mesh position={[-3, 2.94, 0]} material={trimMat}><boxGeometry args={[0.04, 0.08, 5]} /></mesh>
      <mesh position={[3, 2.94, 0]} material={trimMat}><boxGeometry args={[0.04, 0.08, 5]} /></mesh>

      <Window wallMat={wallMat} isNight={isNight} />
    </group>
  )
}

// ─── Light rig (animated day ↔ night) ────────────────────────────────────────

function LightRig({ isNight, lightMult }: { isNight: boolean; lightMult: number }) {
  const ambientRef  = useRef<THREE.AmbientLight>(null)
  const dirRef      = useRef<THREE.DirectionalLight>(null)
  const frontRef    = useRef<THREE.PointLight>(null)
  const leftRef     = useRef<THREE.PointLight>(null)
  const rightRef    = useRef<THREE.PointLight>(null)
  const winRef      = useRef<THREE.PointLight>(null)
  const ceilRef     = useRef<THREE.PointLight>(null)
  const warmLRef    = useRef<THREE.PointLight>(null)
  const warmRRef    = useRef<THREE.PointLight>(null)
  const warmFillRef = useRef<THREE.PointLight>(null)
  const rectRef     = useRef<THREE.RectAreaLight>(null)
  const fixtureMat  = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    const F = 0.025
    const lerp = THREE.MathUtils.lerp

    const m = lightMult
    if (ambientRef.current)  ambientRef.current.intensity  = lerp(ambientRef.current.intensity,  (isNight ? 0.04 : 0.55) * m, F)
    if (dirRef.current)      dirRef.current.intensity      = lerp(dirRef.current.intensity,      (isNight ? 0.0  : 0.9)  * m, F)
    if (frontRef.current)    frontRef.current.intensity    = lerp(frontRef.current.intensity,    (isNight ? 0.0  : 0.35) * m, F)
    if (leftRef.current)     leftRef.current.intensity     = lerp(leftRef.current.intensity,     (isNight ? 0.0  : 0.18) * m, F)
    if (rightRef.current)    rightRef.current.intensity    = lerp(rightRef.current.intensity,    (isNight ? 0.0  : 0.18) * m, F)
    if (winRef.current)      winRef.current.intensity      = lerp(winRef.current.intensity,      (isNight ? 0.0  : 0.28) * m, F)
    if (warmFillRef.current) warmFillRef.current.intensity = lerp(warmFillRef.current.intensity, (isNight ? 0.3  : 0.8)  * m, F)
    if (rectRef.current)     rectRef.current.intensity     = lerp(rectRef.current.intensity,     (isNight ? 0.5  : 8.0)  * m, F)
    // Night: overhead warm ceiling + two low side fills simulate floor lamps
    if (ceilRef.current)     ceilRef.current.intensity     = lerp(ceilRef.current.intensity,     (isNight ? 1.8  : 0.0)  * m, F)
    if (warmLRef.current)    warmLRef.current.intensity    = lerp(warmLRef.current.intensity,    (isNight ? 0.55 : 0.0)  * m, F)
    if (warmRRef.current)    warmRRef.current.intensity    = lerp(warmRRef.current.intensity,    (isNight ? 0.55 : 0.0)  * m, F)
    if (fixtureMat.current)  fixtureMat.current.emissiveIntensity = lerp(fixtureMat.current.emissiveIntensity, (isNight ? 1.2 : 0.0) * m, F)
  })

  return (
    <>
      <ambientLight   ref={ambientRef} intensity={0.55} color="#FFFAF5" />
      <directionalLight ref={dirRef}   position={[0.5, 4, -8]} intensity={0.9} color="#E8F0FF" />
      <pointLight ref={frontRef}  position={[0, 2.6, 2.0]}    intensity={0.35} color="#FFF4EC" distance={7} decay={2} />
      <pointLight ref={leftRef}   position={[-2.4, 1.8, 0]}   intensity={0.18} color="#FFF8F0" distance={5} decay={2} />
      <pointLight ref={rightRef}  position={[2.4, 1.8, 0]}    intensity={0.18} color="#FFF8F0" distance={5} decay={2} />
      <pointLight ref={winRef}    position={[0, 2.0, -2.0]}   intensity={0.28} color="#D0E8FF" distance={4} decay={2} />
      {/* Warm indoor fill — simulates ceiling fixture glow, present day + night */}
      <pointLight ref={warmFillRef} position={[0, 2.5, 0]}    intensity={0.8}  color="#FFD4A0" distance={8} decay={2} />
      {/* RectAreaLight from window direction — warm light falloff across walls */}
      <rectAreaLight ref={rectRef} position={[0, 2, -3]} rotation={[0, 0, 0]} width={2} height={2.5} color="#FFE4B5" intensity={8} />
      {/* Night ceiling overhead */}
      <pointLight ref={ceilRef}   position={[0, 2.75, 0]}     intensity={0}    color="#FFD070" distance={8} decay={1.5} />
      {/* Night side fills — simulate wall sconces / floor lamps */}
      <pointLight ref={warmLRef}  position={[-2.2, 1.0, 0.5]} intensity={0}    color="#FF9840" distance={4} decay={2} />
      <pointLight ref={warmRRef}  position={[2.2, 1.0, 0.5]}  intensity={0}    color="#FF9840" distance={4} decay={2} />

      {/* Ceiling light fixture — glows warm at night */}
      <mesh position={[0, 2.97, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.025, 28]} />
        <meshStandardMaterial ref={fixtureMat} color="#F5EED8" emissive="#FFD070" emissiveIntensity={0} roughness={0.75} />
      </mesh>
    </>
  )
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ curtainColor, wallColor, floorColor, fabric, curtainsOpen, isNight, lightIntensity = 60 }: RoomSceneProps) {
  const leftX   = curtainsOpen ? -1.55 : -0.72
  const rightX  = curtainsOpen ? 1.55 : 0.72
  const lightMult = Math.min(1.8, Math.max(0.05, lightIntensity / 60))

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.55, 2.4]} fov={62} />
      <OrbitControls
        target={[0, 1.55, -2]}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.18}
        maxAzimuthAngle={Math.PI * 0.38}
        minAzimuthAngle={-Math.PI * 0.38}
        enableZoom minDistance={1.2} maxDistance={4.5} enablePan={false}
      />

      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} />
      </Suspense>
      <LightRig isNight={isNight} lightMult={lightMult} />
      <Room wallColor={wallColor} floorColor={floorColor} isNight={isNight} />
      <CurtainMesh color={curtainColor} fabric={fabric} targetX={leftX} />
      <CurtainMesh color={curtainColor} fabric={fabric} targetX={rightX} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={8} blur={2.5} far={3} color="#1a0f05" />
    </>
  )
}

export default function RoomScene(props: RoomSceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault() }, false)
      }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  )
}
