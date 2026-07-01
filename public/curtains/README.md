# public/curtains — baked curtain assets

Drop Blender renders here. The compositor recolors a **neutral** render at runtime,
so you need **one set per style, NOT per colour** (see `app/components/mobile-studio/BLENDER_ASSETS.md`).

## Filenames (must match exactly)

```
curtain_{style}_{state}_{side}_{pass}.webp
```

- `{style}` — a style id registered in `assetManifest.ts` (e.g. `pinchPleat`, `wave`, `eyelet`)
- `{state}` — `open` (v1), later `closed` / `tieback`
- `{side}`  — `left` (only render the left; the app mirrors it), or `right` if asymmetric
- `{pass}`  — `lum` (required), `shadow` (optional), `spec` (optional/later)

## Examples

```
curtain_pinchPleat_open_left_lum.webp      ← required workhorse
curtain_pinchPleat_open_left_shadow.webp   ← optional cast shadow
curtain_wave_open_left_lum.webp
```

## How wiring works

`assetManifest.ts` lists the known styles. Its loader tries to fetch each style's
`_lum` (and optional passes); **if the file is present it's used, if not the code
placeholder is shown instead.** So: drop the file here → reload → it appears.
Adding a brand-new *style* also needs one line in `CURTAIN_STYLES`.
