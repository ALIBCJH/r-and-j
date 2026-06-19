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
  wallColor:    string
  floorColor:   string
  fabric:       FabricType
  curtainsOpen: boolean
  isNight:      boolean
  lightIntensity?: number
  mode?:        'windows' | 'doors'
}

const DAY_SKY_COL   = new THREE.Color('#C8E8FF')
const DAY_SKY_EMI   = new THREE.Color('#A8D4FF')
const NIGHT_SKY_COL = new THREE.Color('#04080E')
const NIGHT_SKY_EMI = new THREE.Color('#0A1428')

// ─── Window curtain geometry constants ───────────────────────────────────────
const WIN_W           = 1.4
const WIN_H           = 2.6
const WIN_Y           = 0.18 + WIN_H / 2
const WIN_Z           = -2.22
const WIN_FOLDS       = 7
const WIN_RING_OX     = [-0.58, -0.41, -0.24, -0.08, 0.08, 0.24, 0.41, 0.58]

// ─── Door curtain geometry constants ─────────────────────────────────────────
const DOOR_W          = 0.58
const DOOR_H          = 2.15
const DOOR_Y          = 0.05 + DOOR_H / 2
const DOOR_X_WALL     = -2.86          // on left wall (x≈-3), pulled in slightly
const DOOR_FOLDS      = 4
const DOOR_RING_OX    = [-0.22, -0.07, 0.07, 0.22]

// ─── Wood texture ─────────────────────────────────────────────────────────────
function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#BCBCBC'
  ctx.fillRect(0, 0, 1024, 512)
  const grad = ctx.createLinearGradient(0, 0, 1024, 0)
  grad.addColorStop(0,   'rgba(255,255,255,0.06)')
  grad.addColorStop(0.3, 'rgba(0,0,0,0.04)')
  grad.addColorStop(0.6, 'rgba(255,255,255,0.05)')
  grad.addColorStop(1,   'rgba(0,0,0,0.03)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)
  for (let i = 1; i < 4; i++) {
    const y = (i / 4) * 512
    ctx.strokeStyle = 'rgba(0,0,0,0.30)'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * 1024
    ctx.strokeStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.08})`
    ctx.lineWidth = 0.4 + Math.random() * 1.8
    ctx.beginPath(); ctx.moveTo(x, 0)
    for (let y = 0; y <= 512; y += 6)
      ctx.lineTo(x + Math.sin(y * 0.014 + i * 0.6) * 7 + Math.sin(y * 0.038 + i) * 2, y)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 2); tex.anisotropy = 8
  return tex
}

// ─── Curtain mesh (window or door) ───────────────────────────────────────────
interface CurtainProps {
  color:    string
  fabric:   FabricType
  targetX:  number
  width?:   number
  height?:  number
  posY?:    number
  posZ?:    number
  folds?:   number
  ringOffsets?: number[]
  // door mode: curtains slide along Z instead of X, fixed on wall
  slideAxis?: 'x' | 'z'
  fixedX?:    number
}

function CurtainMesh({ color, fabric, targetX, width = WIN_W, height = WIN_H, posY = WIN_Y, posZ = WIN_Z, folds = WIN_FOLDS, ringOffsets = WIN_RING_OX, slideAxis = 'x', fixedX }: CurtainProps) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const ringsRef   = useRef<THREE.Group>(null)
  const targetXRef  = useRef(targetX)
  const currentXRef = useRef(targetX)
  targetXRef.current = targetX

  const { geometry, basePos } = useMemo(() => {
    const geo  = new THREE.PlaneGeometry(width, height, folds * 6, 54)
    const attr = geo.attributes.position as THREE.BufferAttribute
    attr.setUsage(THREE.DynamicDrawUsage)
    const base = new Float32Array(attr.count * 3)
    for (let i = 0; i < attr.count; i++) {
      const x = attr.getX(i), y = attr.getY(i)
      const yNorm = (y + height / 2) / height
      const amp   = 0.052 * (1.0 + (1.0 - yNorm) * 0.6)
      const z     = Math.sin((x / (width / 2)) * Math.PI * folds) * amp
      attr.setZ(i, z)
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z
    }
    attr.needsUpdate = true
    geo.computeVertexNormals()
    ;(geo.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage)
    return { geometry: geo, basePos: base }
  }, [width, height, folds])

  // ── 1. Fabric materials — now properly differentiated ─────────────────────
  const material = useMemo(() => {
    const col      = new THREE.Color(color)
    const sheenCol = new THREE.Color(color).multiplyScalar(0.8)
    switch (fabric) {
      case 'sheer':
        return new THREE.MeshPhysicalMaterial({
          color, side: THREE.DoubleSide,
          transparent: true, opacity: 0.40,
          roughness: 0.04, metalness: 0,
          transmission: 0.5,
          envMapIntensity: 0.5,
        })
      case 'velvet':
        // Rich, light-absorbing — high sheen, low sheenRoughness gives the velvet crushed-pile look
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.72, metalness: 0,
          sheen: 1.0, sheenRoughness: 0.22,
          sheenColor: new THREE.Color(color).multiplyScalar(1.35),
          envMapIntensity: 0.65,
        })
      case 'linen':
        // Matte, dry texture — low sheen, very high roughness, natural-feeling
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.94, metalness: 0,
          sheen: 0.38, sheenRoughness: 0.90, sheenColor: sheenCol,
          envMapIntensity: 0.12,
        })
      default: // cotton — between linen and velvet
        return new THREE.MeshPhysicalMaterial({
          color: col, side: THREE.DoubleSide,
          roughness: 0.82, metalness: 0,
          sheen: 0.62, sheenRoughness: 0.65, sheenColor: sheenCol,
          envMapIntensity: 0.28,
        })
    }
  }, [color, fabric])

  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C9A84C', roughness: 0.18, metalness: 0.88, envMapIntensity: 1.0 }), [])

  useEffect(() => () => { geometry.dispose(); material.dispose(); ringMat.dispose() }, [geometry, material, ringMat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetXRef.current, 0.07)

    if (slideAxis === 'z') {
      // Door curtains slide along Z; X is fixed on the wall
      meshRef.current.position.z = currentXRef.current
      if (ringsRef.current) ringsRef.current.position.z = currentXRef.current
    } else {
      meshRef.current.position.x = currentXRef.current
      if (ringsRef.current) ringsRef.current.position.x = currentXRef.current
    }

    const dist     = Math.abs(currentXRef.current - targetXRef.current)
    const foldMult = 1.0 + Math.min(dist * 0.28, 0.38)
    const attr     = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < attr.count; i++) {
      const bx = basePos[i * 3], by = basePos[i * 3 + 1], bz = basePos[i * 3 + 2]
      const waveZ = Math.sin(bx * 2.2 + t * 0.55) * 0.0075 + Math.sin(bx * 4.3 - t * 0.38 + 1.1) * 0.003 + Math.sin(bx * 7.1 + t * 0.22 + 2.3) * 0.0015
      const swayX = Math.sin(by * 1.4 + t * 0.42) * 0.004 + Math.sin(by * 0.7 - t * 0.29 + 0.9) * 0.002
      attr.setX(i, bx + swayX)
      attr.setZ(i, bz * foldMult + waveZ)
    }
    attr.needsUpdate = true
  })

  const rodY    = posY + height / 2 + 0.10
  const wallX   = fixedX ?? targetX
  const initPos: [number, number, number] = slideAxis === 'z'
    ? [wallX, posY, targetX]
    : [targetX, posY, posZ]
  const ringPos: [number, number, number] = slideAxis === 'z'
    ? [wallX, rodY, targetX]
    : [targetX, rodY, posZ + 0.04]

  return (
    <>
      <mesh ref={meshRef} position={initPos} geometry={geometry} material={material}
        rotation={slideAxis === 'z' ? [0, Math.PI / 2, 0] : [0, 0, 0]}
      />
      <group ref={ringsRef} position={ringPos}>
        {ringOffsets.map((ox, i) => (
          <mesh key={i} position={slideAxis === 'z' ? [0, 0, ox] : [ox, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ringMat}>
            <torusGeometry args={[0.020, 0.005, 10, 20]} />
          </mesh>
        ))}
      </group>
    </>
  )
}

// ─── Sky pane ─────────────────────────────────────────────────────────────────
function SkyPane({ isNight }: { isNight: boolean }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => {
    const m = matRef.current; if (!m) return
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
  // ── 2. Upgraded window materials ─────────────────────────────────────────
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#EAE7DF', roughness: 0.28, metalness: 0.06, envMapIntensity: 0.6,
  }), [])
  const sillMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E4E0D8', roughness: 0.38, metalness: 0.03, envMapIntensity: 0.3,
  }), [])
  // Proper physical glass — transmission lets the sky pane show through
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#D8EEFA',
    roughness: 0.04,
    metalness: 0.0,
    transmission: 0.88,
    thickness: 0.06,
    envMapIntensity: 2.2,
    ior: 1.52,
    transparent: true,
    opacity: 0.92,
  }), [])
  const rodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C9A84C', roughness: 0.22, metalness: 0.90, envMapIntensity: 1.4,
  }), [])
  useEffect(() => () => { frameMat.dispose(); sillMat.dispose(); glassMat.dispose(); rodMat.dispose() }, [frameMat, sillMat, glassMat, rodMat])

  return (
    <group>
      {/* Back wall segments around opening */}
      <mesh position={[-2.1, 1.5, -2.5]} material={wallMat}><boxGeometry args={[1.8, 3, 0.18]} /></mesh>
      <mesh position={[2.1, 1.5, -2.5]} material={wallMat}><boxGeometry args={[1.8, 3, 0.18]} /></mesh>
      <mesh position={[0, 2.72, -2.5]} material={wallMat}><boxGeometry args={[2.4, 0.56, 0.18]} /></mesh>
      <mesh position={[0, 0.35, -2.5]} material={wallMat}><boxGeometry args={[2.4, 0.7, 0.18]} /></mesh>
      {/* Reveal jambs */}
      <mesh position={[-1.24, 1.72, -2.46]} material={wallMat}><boxGeometry args={[0.18, 2.06, 0.18]} /></mesh>
      <mesh position={[1.24, 1.72, -2.46]} material={wallMat}><boxGeometry args={[0.18, 2.06, 0.18]} /></mesh>
      <mesh position={[0, 2.72, -2.46]} material={wallMat}><boxGeometry args={[2.66, 0.18, 0.18]} /></mesh>
      <SkyPane isNight={isNight} />
      {/* Glass pane — now physical glass */}
      <mesh position={[0, 1.72, -2.42]}>
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

// ─── Door (left wall opening + frame + panel + treatment rod) ─────────────────
function Door({ wallMat }: { wallMat: THREE.Material }) {
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#EAE7DF', roughness: 0.28, metalness: 0.06, envMapIntensity: 0.5,
  }), [])
  const panelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2C2018', roughness: 0.55, metalness: 0.02, envMapIntensity: 0.1,
  }), [])
  const handleMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C9A84C', roughness: 0.18, metalness: 0.92, envMapIntensity: 1.6,
  }), [])
  const rodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C9A84C', roughness: 0.22, metalness: 0.90, envMapIntensity: 1.4,
  }), [])
  useEffect(() => () => { frameMat.dispose(); panelMat.dispose(); handleMat.dispose(); rodMat.dispose() }, [frameMat, panelMat, handleMat, rodMat])

  // Door opening centred at z=0 on left wall (x=-3), 0.9 wide × 2.15 tall
  return (
    <group>
      {/* Left wall — split into 3 segments around the door opening */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.5, -1.475]} material={wallMat}>
        <planeGeometry args={[2.05, 3]} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.5, 1.475]} material={wallMat}>
        <planeGeometry args={[2.05, 3]} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 2.575, 0]} material={wallMat}>
        <planeGeometry args={[0.90, 0.85]} />
      </mesh>

      {/* Door frame — outer surround */}
      <mesh position={[-2.94, 1.075, 0]} material={frameMat}><boxGeometry args={[0.08, 2.15, 0.10]} /></mesh>
      <mesh position={[-2.94, 1.075, 0.495]} material={frameMat}><boxGeometry args={[0.08, 2.15, 0.10]} /></mesh>
      <mesh position={[-2.94, 2.185, 0.0]} material={frameMat}><boxGeometry args={[0.08, 0.10, 1.10]} /></mesh>

      {/* Door panel — slightly ajar (rotated ~15°) */}
      <group position={[-2.92, 1.075, -0.45]} rotation={[0, -0.26, 0]}>
        <mesh position={[0, 0, 0.45]} material={panelMat}>
          <boxGeometry args={[0.06, 2.14, 0.90]} />
        </mesh>
        {/* Panel detail grooves */}
        <mesh position={[0.01, 0.38, 0.45]} material={frameMat}>
          <boxGeometry args={[0.012, 0.88, 0.38]} />
        </mesh>
        <mesh position={[0.01, -0.38, 0.45]} material={frameMat}>
          <boxGeometry args={[0.012, 0.88, 0.38]} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.06, 0.05, 0.70]} rotation={[Math.PI / 2, 0, 0]} material={handleMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
        </mesh>
        <mesh position={[0.06, 0.05, 0.76]} material={handleMat}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
      </group>

      {/* Curtain rod above door */}
      <mesh position={[-2.80, 2.32, 0]} rotation={[0, 0, Math.PI / 2]} material={rodMat}>
        <cylinderGeometry args={[0.022, 0.022, 1.5, 16]} />
      </mesh>
      <mesh position={[-2.80, 2.32, -0.76]} material={rodMat}><sphereGeometry args={[0.044, 14, 14]} /></mesh>
      <mesh position={[-2.80, 2.32,  0.76]} material={rodMat}><sphereGeometry args={[0.044, 14, 14]} /></mesh>
      {/* Rod bracket */}
      <group position={[-2.88, 2.32, 0]}>
        <mesh material={rodMat}><boxGeometry args={[0.12, 0.14, 0.04]} /></mesh>
        <mesh position={[0, 0, 0.04]} material={rodMat}><cylinderGeometry args={[0.012, 0.012, 0.04, 8]} /></mesh>
      </group>
    </group>
  )
}

// ─── 5. Furniture ─────────────────────────────────────────────────────────────
function Furniture() {
  const sofaMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E1A16', roughness: 0.88, metalness: 0, envMapIntensity: 0.08,
  }), [])
  const cushionMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2A2420', roughness: 0.92, metalness: 0, envMapIntensity: 0.06,
  }), [])
  const legMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B6820', roughness: 0.25, metalness: 0.65, envMapIntensity: 0.8,
  }), [])
  const tableMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3A2C18', roughness: 0.50, metalness: 0.04, envMapIntensity: 0.2,
  }), [])
  useEffect(() => () => { sofaMat.dispose(); cushionMat.dispose(); legMat.dispose(); tableMat.dispose() }, [sofaMat, cushionMat, legMat, tableMat])

  return (
    <group>
      {/* Sofa — centred at z=1.1, facing the window */}
      <group position={[0, 0, 1.1]}>
        {/* Base */}
        <mesh position={[0, 0.22, 0]} material={sofaMat}>
          <boxGeometry args={[2.1, 0.44, 0.85]} />
        </mesh>
        {/* Back rest */}
        <mesh position={[0, 0.62, 0.35]} material={sofaMat}>
          <boxGeometry args={[2.1, 0.50, 0.14]} />
        </mesh>
        {/* Arms */}
        <mesh position={[-1.08, 0.46, 0]} material={sofaMat}>
          <boxGeometry args={[0.14, 0.48, 0.85]} />
        </mesh>
        <mesh position={[1.08, 0.46, 0]} material={sofaMat}>
          <boxGeometry args={[0.14, 0.48, 0.85]} />
        </mesh>
        {/* Seat cushions */}
        {([-0.54, 0, 0.54] as number[]).map((cx, i) => (
          <mesh key={i} position={[cx, 0.50, -0.07]} material={cushionMat}>
            <boxGeometry args={[0.66, 0.16, 0.66]} />
          </mesh>
        ))}
        {/* Back cushions */}
        {([-0.54, 0.54] as number[]).map((cx, i) => (
          <mesh key={i} position={[cx, 0.65, 0.28]} material={cushionMat}>
            <boxGeometry args={[0.55, 0.35, 0.12]} />
          </mesh>
        ))}
        {/* Legs */}
        {([ [-0.96, -0.36], [0.96, -0.36], [-0.96, 0.36], [0.96, 0.36] ] as [number, number][]).map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.04, lz]} material={legMat}>
            <boxGeometry args={[0.06, 0.08, 0.06]} />
          </mesh>
        ))}
      </group>

      {/* Side table — right of sofa */}
      <group position={[1.4, 0, 1.1]}>
        {/* Table top */}
        <mesh position={[0, 0.52, 0]} material={tableMat}>
          <boxGeometry args={[0.50, 0.04, 0.50]} />
        </mesh>
        {/* Legs */}
        {([ [-0.21, -0.21], [0.21, -0.21], [-0.21, 0.21], [0.21, 0.21] ] as [number, number][]).map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.26, lz]} material={legMat}>
            <boxGeometry args={[0.04, 0.52, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ─── Room shell ───────────────────────────────────────────────────────────────
function Room({ wallColor, floorColor, isNight, mode }: { wallColor: string; floorColor: string; isNight: boolean; mode: 'windows' | 'doors' }) {
  const wallMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(wallColor), roughness: 0.95, metalness: 0, envMapIntensity: 0.1 }), [wallColor])
  const floorTex = useMemo(() => createWoodTexture(), [])
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
      {/* Side walls — left wall is replaced by Door component in door mode */}
      {mode !== 'doors' && (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.5, 0]} material={wallMat}>
          <planeGeometry args={[5, 3]} />
        </mesh>
      )}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 1.5, 0]} material={wallMat}>
        <planeGeometry args={[5, 3]} />
      </mesh>
      {/* Front wall behind viewer */}
      <mesh position={[0, 1.5, 2.5]} material={wallMat}><planeGeometry args={[6, 3]} /></mesh>
      {/* Baseboards */}
      <mesh position={[-3, 0.045, 0]} material={trimMat}><boxGeometry args={[0.06, 0.09, 5]} /></mesh>
      <mesh position={[3, 0.045, 0]} material={trimMat}><boxGeometry args={[0.06, 0.09, 5]} /></mesh>
      <mesh position={[-2.1, 0.045, -2.44]} material={trimMat}><boxGeometry args={[1.8, 0.09, 0.06]} /></mesh>
      <mesh position={[2.1, 0.045, -2.44]} material={trimMat}><boxGeometry args={[1.8, 0.09, 0.06]} /></mesh>
      {/* Crown moulding */}
      <mesh position={[-3, 2.94, 0]} material={trimMat}><boxGeometry args={[0.04, 0.08, 5]} /></mesh>
      <mesh position={[3, 2.94, 0]} material={trimMat}><boxGeometry args={[0.04, 0.08, 5]} /></mesh>

      <Window wallMat={wallMat} isNight={isNight} />
      {mode === 'doors' && <Door wallMat={wallMat} />}
      <Furniture />
    </group>
  )
}

// ─── Light rig ────────────────────────────────────────────────────────────────
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
    const F = 0.025, lerp = THREE.MathUtils.lerp, m = lightMult
    if (ambientRef.current)  ambientRef.current.intensity  = lerp(ambientRef.current.intensity,  (isNight ? 0.04 : 0.55) * m, F)
    if (dirRef.current)      dirRef.current.intensity      = lerp(dirRef.current.intensity,      (isNight ? 0.0  : 0.9)  * m, F)
    if (frontRef.current)    frontRef.current.intensity    = lerp(frontRef.current.intensity,    (isNight ? 0.0  : 0.35) * m, F)
    if (leftRef.current)     leftRef.current.intensity     = lerp(leftRef.current.intensity,     (isNight ? 0.0  : 0.18) * m, F)
    if (rightRef.current)    rightRef.current.intensity    = lerp(rightRef.current.intensity,    (isNight ? 0.0  : 0.18) * m, F)
    if (winRef.current)      winRef.current.intensity      = lerp(winRef.current.intensity,      (isNight ? 0.0  : 0.28) * m, F)
    if (warmFillRef.current) warmFillRef.current.intensity = lerp(warmFillRef.current.intensity, (isNight ? 0.3  : 0.8)  * m, F)
    if (rectRef.current)     rectRef.current.intensity     = lerp(rectRef.current.intensity,     (isNight ? 0.5  : 8.0)  * m, F)
    if (ceilRef.current)     ceilRef.current.intensity     = lerp(ceilRef.current.intensity,     (isNight ? 1.8  : 0.0)  * m, F)
    if (warmLRef.current)    warmLRef.current.intensity    = lerp(warmLRef.current.intensity,    (isNight ? 0.55 : 0.0)  * m, F)
    if (warmRRef.current)    warmRRef.current.intensity    = lerp(warmRRef.current.intensity,    (isNight ? 0.55 : 0.0)  * m, F)
    if (fixtureMat.current)  fixtureMat.current.emissiveIntensity = lerp(fixtureMat.current.emissiveIntensity, (isNight ? 1.2 : 0.0) * m, F)
  })

  return (
    <>
      <ambientLight   ref={ambientRef}  intensity={0.55} color="#FFFAF5" />
      <directionalLight ref={dirRef}    position={[0.5, 4, -8]} intensity={0.9} color="#E8F0FF" />
      <pointLight ref={frontRef}   position={[0, 2.6, 2.0]}    intensity={0.35} color="#FFF4EC" distance={7} decay={2} />
      <pointLight ref={leftRef}    position={[-2.4, 1.8, 0]}   intensity={0.18} color="#FFF8F0" distance={5} decay={2} />
      <pointLight ref={rightRef}   position={[2.4, 1.8, 0]}    intensity={0.18} color="#FFF8F0" distance={5} decay={2} />
      <pointLight ref={winRef}     position={[0, 2.0, -2.0]}   intensity={0.28} color="#D0E8FF" distance={4} decay={2} />
      <pointLight ref={warmFillRef} position={[0, 2.5, 0]}     intensity={0.8}  color="#FFD4A0" distance={8} decay={2} />
      <rectAreaLight ref={rectRef} position={[0, 2, -3]} rotation={[0, 0, 0]} width={2} height={2.5} color="#FFE4B5" intensity={8} />
      <pointLight ref={ceilRef}    position={[0, 2.75, 0]}     intensity={0}    color="#FFD070" distance={8} decay={1.5} />
      <pointLight ref={warmLRef}   position={[-2.2, 1.0, 0.5]} intensity={0}    color="#FF9840" distance={4} decay={2} />
      <pointLight ref={warmRRef}   position={[2.2, 1.0, 0.5]}  intensity={0}    color="#FF9840" distance={4} decay={2} />
      <mesh position={[0, 2.97, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.025, 28]} />
        <meshStandardMaterial ref={fixtureMat} color="#F5EED8" emissive="#FFD070" emissiveIntensity={0} roughness={0.75} />
      </mesh>
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ curtainColor, wallColor, floorColor, fabric, curtainsOpen, isNight, lightIntensity = 60, mode = 'windows' }: RoomSceneProps) {
  const lightMult = Math.min(1.8, Math.max(0.05, lightIntensity / 60))

  // Window curtain open/close targets
  const winLeftX  = curtainsOpen ? -1.55 : -0.72
  const winRightX = curtainsOpen ? 1.55  :  0.72

  // Door curtain targets (door mode only)
  const doorLeftZ  = curtainsOpen ? -0.52 : -0.14
  const doorRightZ = curtainsOpen ?  0.52 :  0.14

  // Camera shifts slightly for door mode to face the left wall
  const camPos    = mode === 'doors' ? [-0.4, 1.55, 2.0] as [number, number, number] : [0, 1.55, 2.4] as [number, number, number]
  const camTarget = mode === 'doors' ? [-2.0, 1.4, 0.2] as [number, number, number] : [0, 1.55, -2]   as [number, number, number]

  return (
    <>
      <PerspectiveCamera makeDefault position={camPos} fov={62} />
      <OrbitControls
        target={camTarget}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.18}
        maxAzimuthAngle={Math.PI * 0.45}
        minAzimuthAngle={-Math.PI * 0.45}
        enableZoom minDistance={1.2} maxDistance={4.5} enablePan={false}
      />
      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} />
      </Suspense>
      <LightRig isNight={isNight} lightMult={lightMult} />
      <Room wallColor={wallColor} floorColor={floorColor} isNight={isNight} mode={mode} />

      {/* Window curtains — always present */}
      <CurtainMesh color={curtainColor} fabric={fabric} targetX={winLeftX}  width={WIN_W} height={WIN_H} posY={WIN_Y} posZ={WIN_Z} folds={WIN_FOLDS} ringOffsets={WIN_RING_OX} />
      <CurtainMesh color={curtainColor} fabric={fabric} targetX={winRightX} width={WIN_W} height={WIN_H} posY={WIN_Y} posZ={WIN_Z} folds={WIN_FOLDS} ringOffsets={WIN_RING_OX} />

      {/* Door curtains — door mode only, slide along Z on left wall */}
      {mode === 'doors' && (
        <>
          <CurtainMesh
            color={curtainColor} fabric={fabric}
            targetX={doorLeftZ}
            fixedX={DOOR_X_WALL}
            width={DOOR_W} height={DOOR_H} posY={DOOR_Y} posZ={WIN_Z}
            folds={DOOR_FOLDS} ringOffsets={DOOR_RING_OX}
            slideAxis="z"
          />
          <CurtainMesh
            color={curtainColor} fabric={fabric}
            targetX={doorRightZ}
            fixedX={DOOR_X_WALL}
            width={DOOR_W} height={DOOR_H} posY={DOOR_Y} posZ={WIN_Z}
            folds={DOOR_FOLDS} ringOffsets={DOOR_RING_OX}
            slideAxis="z"
          />
        </>
      )}

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
