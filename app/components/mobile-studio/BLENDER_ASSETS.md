# Blender → Web Curtain Assets — Export Contract (v1)

The web app composites **baked curtain renders** over a **procedurally-drawn wall + window**.
Follow this spec exactly so one render can be recolored to any fabric color at runtime.

---

## THE ONE RULE THAT MATTERS: render neutral, recolor in code

- Give the curtain a **neutral light-gray albedo** — sRGB `#CFCFCF` (NOT white, NOT colored).
- Keep realistic **roughness / sheen** and a real **weave** (normal or micro-displacement).
- This bakes fold shadows, ambient occlusion, and highlights into pure luminance while keeping
  the hue neutral. The app multiplies the customer's chosen color over it → any color, faithfully.
- **Never bake a colored fabric.** A red render can only ever be red. A neutral render is every color.
- Jacquard / stripe / patterned weaves: fine — the pattern lives in the luminance & normal and
  survives the tint.

---

## Framing & camera

- **Orthographic** camera, dead straight-on (no perspective distortion).
- Render **ONE panel — the left one.** The app mirrors it for the right side. (Only render both
  if you deliberately want asymmetric drape.)
- Curtain hangs from the very top of the frame, fills full height, transparent everywhere else.
- **Resolution:** 1024 × 2048 px per panel (tall). We scale DOWN to any window, so err large.
- **Background:** fully transparent. Straight (NON-premultiplied) alpha. Silhouette lives in alpha.

## Lighting

- Key light from the **upper-left** (matches the app's existing shading convention).
- Soft key + fill so folds read; slightly warm key / cool fill is fine.
- **Neutral white balance** — do not tint the lighting, or the recolor will be skewed.

---

## Passes to export (per style, per state)

| # | File suffix   | What it is                                                            | Priority |
|---|---------------|----------------------------------------------------------------------|----------|
| 1 | `_lum`        | Beauty render of the neutral curtain, transparent bg, alpha=silhouette | **required** |
| 2 | `_shadow`     | Curtain's cast shadow on wall — shadow-catcher pass, black + alpha    | strong nice-to-have |
| 3 | `_spec`       | Isolated specular/sheen highlights (for silky fabrics), for a screen pass | later, optional |

`_lum` is the workhorse. Ship that first; we can composite convincingly with just it.

---

## States & geometry (this decides how many renders you make)

Start SMALL. v1 = **one state, one geometry:**

- **State:** `open` — panels gathered at the sides (matches the current look).
- **Geometry:** `window` (standard height).
- Later, each of these is just another render set: `closed`, `tieback`; `door` (taller).

## Naming convention

```
curtain_{style}_{state}_{side}_{pass}.webp
```
Examples:
```
curtain_pinchPleat_open_left_lum.webp
curtain_pinchPleat_open_left_shadow.webp
curtain_wave_open_left_lum.webp
```
`{style}` = your header/pleat style (e.g. pinchPleat, wave, eyelet).

## Delivery

- Export **WebP, quality ~80** (PNG fallback OK). Target ≤ ~250 KB each — we can downscale.
- Drop them in `public/curtains/`.
- Ping me the first `_lum` file and I'll wire it into the live compositor immediately.
