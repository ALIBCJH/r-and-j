"""
Umbral Gold — Morning Light Through Sheer Curtains
R&J Interiors editorial illustration, 1920x1080
"""
import cairo
import math
import random

W, H = 1920, 1080
OUT = "/home/jumaai/Desktop/blender/curtain-vr/public/assets/morning_light_sheer.png"

surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
ctx = cairo.Context(surface)

def hex_rgb(h, a=1.0):
    h = h.lstrip('#')
    r, g, b = int(h[0:2],16)/255, int(h[2:4],16)/255, int(h[4:6],16)/255
    return r, g, b, a

# ── 1. BACKGROUND — near-black room ──────────────────────────────────────────
ctx.rectangle(0, 0, W, H)
ctx.set_source_rgba(*hex_rgb('#111113'))
ctx.fill()

# ── 2. WINDOW POSITION — off-center right ────────────────────────────────────
WIN_CX  = W * 0.58   # centre x of window
WIN_TOP = 0          # window runs from top
WIN_BOT = H * 0.72   # bottom of window opening
WIN_W   = W * 0.28   # width of window

# ── 3. BACK WALL AMBIENT — very faint warm tint around window area ────────────
pat = cairo.RadialGradient(WIN_CX, H * 0.25, 20, WIN_CX, H * 0.3, W * 0.55)
pat.add_color_stop_rgba(0.0, *hex_rgb('#3D2B0A', 0.55))
pat.add_color_stop_rgba(0.4, *hex_rgb('#1E1608', 0.20))
pat.add_color_stop_rgba(1.0, *hex_rgb('#111113', 0.0))
ctx.rectangle(0, 0, W, H)
ctx.set_source(pat)
ctx.fill()

# ── 4. WINDOW GLASS — bright amber core behind curtains ──────────────────────
win_pat = cairo.LinearGradient(WIN_CX - WIN_W/2, 0, WIN_CX + WIN_W/2, 0)
win_pat.add_color_stop_rgba(0.0,  *hex_rgb('#E8C87A', 0.0))
win_pat.add_color_stop_rgba(0.2,  *hex_rgb('#E8C87A', 0.30))
win_pat.add_color_stop_rgba(0.5,  *hex_rgb('#F5DFA0', 0.65))
win_pat.add_color_stop_rgba(0.8,  *hex_rgb('#E8C87A', 0.30))
win_pat.add_color_stop_rgba(1.0,  *hex_rgb('#E8C87A', 0.0))
ctx.rectangle(WIN_CX - WIN_W/2, WIN_TOP, WIN_W, WIN_BOT)
ctx.set_source(win_pat)
ctx.fill()

# vertical gradient — brighter at horizon line (H*0.28)
win_vgr = cairo.LinearGradient(0, 0, 0, WIN_BOT)
win_vgr.add_color_stop_rgba(0.0,  *hex_rgb('#E8C87A', 0.15))
win_vgr.add_color_stop_rgba(0.30, *hex_rgb('#F5DFA0', 0.75))
win_vgr.add_color_stop_rgba(0.55, *hex_rgb('#E8C87A', 0.30))
win_vgr.add_color_stop_rgba(1.0,  *hex_rgb('#C9A84C', 0.05))
ctx.rectangle(WIN_CX - WIN_W/2, WIN_TOP, WIN_W, WIN_BOT)
ctx.set_source(win_vgr)
ctx.fill()

# ── 5. LIGHT RAYS — diagonal shafts through sheer fabric ─────────────────────
ctx.save()
ctx.set_operator(cairo.OPERATOR_SCREEN)
ray_angles = [-0.18, -0.09, 0.0, 0.08, 0.17, 0.26]
ray_widths  = [38, 22, 55, 18, 42, 25]
ray_alphas  = [0.07, 0.05, 0.11, 0.04, 0.09, 0.05]

for angle, width, alpha in zip(ray_angles, ray_widths, ray_alphas):
    rx = WIN_CX + angle * H
    pat = cairo.LinearGradient(rx - width, 0, rx + width, 0)
    pat.add_color_stop_rgba(0, *hex_rgb('#E8C87A', 0))
    pat.add_color_stop_rgba(0.5, *hex_rgb('#F5DFA0', alpha))
    pat.add_color_stop_rgba(1, *hex_rgb('#E8C87A', 0))
    ctx.rectangle(rx - width*6, 0, width*12, H * 0.78)
    ctx.set_source(pat)
    ctx.fill()
ctx.restore()

# ── 6. CURTAIN FOLDS helper ───────────────────────────────────────────────────
def draw_curtain_panel(ctx, x_left, x_right, top, bot, folds=5, flip=False, alpha_base=0.82):
    """
    Draw a sheer curtain panel with broad sinusoidal folds.
    Backlit — peaks face window and glow amber; valleys are cooler/darker.
    """
    pw = x_right - x_left
    strips = 200  # fine horizontal resolution
    fold_amp = pw * 0.06

    phase = math.pi if flip else 0

    # ── Pass 1: base sheer fabric strips ──────────────────────────────────
    for i in range(strips):
        t   = i / strips
        t1  = (i+1) / strips
        x0  = x_left + t  * pw
        x1  = x_left + t1 * pw

        wave = math.sin(t * math.pi * folds + phase)

        # Backlit sheer: fold peaks (wave=+1) glow warm gold through fabric
        # Fold troughs (wave=-1) are cooler, less transmissive
        light_leak = 0.30 + 0.70 * max(0, wave)   # 0.30 – 1.0
        shadow     = 1.0  - 0.55 * max(0, -wave)  # 0.45 – 1.0

        fab_r = (0.94 * light_leak + 0.78 * (1-light_leak)) * shadow
        fab_g = (0.88 * light_leak + 0.65 * (1-light_leak)) * shadow
        fab_b = (0.75 * light_leak + 0.40 * (1-light_leak)) * shadow
        fab_a = alpha_base * (0.38 + 0.42 * light_leak)

        ctx.move_to(x0, top)
        ctx.line_to(x1, top)
        ctx.line_to(x1, bot)
        ctx.line_to(x0, bot)
        ctx.close_path()
        ctx.set_source_rgba(fab_r, fab_g, fab_b, fab_a)
        ctx.fill()

    # ── Pass 2: broad fold shadow bands ────────────────────────────────────
    ctx.save()
    for i in range(folds):
        t   = i / folds
        fx  = x_left + t * pw
        fw  = pw / folds * 0.5
        gr  = cairo.LinearGradient(fx, 0, fx + fw, 0)
        gr.add_color_stop_rgba(0,   0.04, 0.03, 0.02, 0.32)
        gr.add_color_stop_rgba(0.5, 0.04, 0.03, 0.02, 0.10)
        gr.add_color_stop_rgba(1,   0.04, 0.03, 0.02, 0.0)
        ctx.rectangle(fx, top, fw, bot - top)
        ctx.set_source(gr)
        ctx.fill()
    ctx.restore()

    # ── Pass 3: vertical translucency gradient (top bright, fades down) ───
    vg = cairo.LinearGradient(0, top, 0, bot)
    vg.add_color_stop_rgba(0.0,  *hex_rgb('#F0EBE0', 0.0))
    vg.add_color_stop_rgba(0.06, *hex_rgb('#F0EBE0', 0.14))
    vg.add_color_stop_rgba(0.40, *hex_rgb('#E8DFD0', 0.08))
    vg.add_color_stop_rgba(1.0,  *hex_rgb('#D4C8B0', 0.18))
    ctx.rectangle(x_left - fold_amp, top, pw + fold_amp*2, bot - top)
    ctx.set_source(vg)
    ctx.fill()

    # ── Pass 4: soft fabric edge falloff (panels fade at their edges) ─────
    edge_w = pw * 0.14
    # Left edge: fabric fades to transparent
    eg_l = cairo.LinearGradient(x_left, 0, x_left + edge_w, 0)
    eg_l.add_color_stop_rgba(0,   0.067, 0.055, 0.043, alpha_base * 0.85)
    eg_l.add_color_stop_rgba(1,   0.067, 0.055, 0.043, 0.0)
    ctx.rectangle(x_left, top, edge_w, bot - top)
    ctx.set_source(eg_l)
    ctx.fill()
    # Right edge
    eg_r = cairo.LinearGradient(x_right - edge_w, 0, x_right, 0)
    eg_r.add_color_stop_rgba(0,   0.067, 0.055, 0.043, 0.0)
    eg_r.add_color_stop_rgba(1,   0.067, 0.055, 0.043, alpha_base * 0.85)
    ctx.rectangle(x_right - edge_w, top, edge_w, bot - top)
    ctx.set_source(eg_r)
    ctx.fill()

    # ── Pass 5: gold rim light on lit fold ridges ─────────────────────────
    ctx.save()
    ctx.set_operator(cairo.OPERATOR_SCREEN)
    ctx.set_line_width(2.5)
    for i in range(folds + 1):
        t  = (i + 0.25) / folds   # offset to hit crest
        fx = x_left + t * pw
        rim = cairo.LinearGradient(fx - 8, 0, fx + 8, 0)
        rim.add_color_stop_rgba(0,   *hex_rgb('#E8C87A', 0.0))
        rim.add_color_stop_rgba(0.5, *hex_rgb('#E8C87A', 0.18))
        rim.add_color_stop_rgba(1,   *hex_rgb('#E8C87A', 0.0))
        ctx.rectangle(fx - 8, top, 16, bot - top)
        ctx.set_source(rim)
        ctx.fill()
    ctx.restore()


# ── 7. CURTAIN PANELS ─────────────────────────────────────────────────────────
ROD_Y   = H * 0.04
BOT_L   = H * 1.02   # panels fall below frame
BOT_R   = H * 1.02

# Left panel — sits in left third, leaves dark wall on far left
draw_curtain_panel(ctx,
    x_left  = W * 0.14,
    x_right = WIN_CX - WIN_W * 0.30,
    top     = ROD_Y,
    bot     = BOT_L,
    folds   = 5,
    flip    = False,
    alpha_base = 0.52,
)

# Right panel — sits in right third, leaves dark wall on far right
draw_curtain_panel(ctx,
    x_left  = WIN_CX + WIN_W * 0.28,
    x_right = W * 0.86,
    top     = ROD_Y,
    bot     = BOT_R,
    folds   = 4,
    flip    = True,
    alpha_base = 0.54,
)

# ── 8. CURTAIN ROD ────────────────────────────────────────────────────────────
rod_y = ROD_Y - 4
# Rod body
rod_gr = cairo.LinearGradient(0, rod_y - 4, 0, rod_y + 8)
rod_gr.add_color_stop_rgba(0, *hex_rgb('#E8C87A', 0.9))
rod_gr.add_color_stop_rgba(0.4, *hex_rgb('#C9A84C', 0.95))
rod_gr.add_color_stop_rgba(0.7, *hex_rgb('#8A6420', 0.9))
rod_gr.add_color_stop_rgba(1.0, *hex_rgb('#3D2B08', 0.85))
ctx.rectangle(W * 0.03, rod_y - 4, W * 0.94, 10)
ctx.set_source(rod_gr)
ctx.fill()

# Rod highlight
ctx.rectangle(W * 0.03, rod_y - 4, W * 0.94, 2)
ctx.set_source_rgba(*hex_rgb('#F5DFA0', 0.6))
ctx.fill()

# ── 9. CURTAIN RINGS ──────────────────────────────────────────────────────────
ring_color_top    = hex_rgb('#E8C87A', 0.95)
ring_color_shadow = hex_rgb('#7A5A1A', 0.9)

ring_positions = [int(W * 0.04 + i * W * 0.042) for i in range(23)]
for rx in ring_positions:
    # Ring arc (top half)
    ctx.arc(rx, rod_y + 2, 7, math.pi, 2*math.pi)
    ctx.set_source_rgba(*ring_color_shadow)
    ctx.set_line_width(2.2)
    ctx.stroke()
    # Ring highlight
    ctx.arc(rx, rod_y, 7, math.pi + 0.3, 2*math.pi - 0.3)
    ctx.set_source_rgba(*ring_color_top)
    ctx.set_line_width(1.4)
    ctx.stroke()

# ── 10. FLOOR ────────────────────────────────────────────────────────────────
FLOOR_Y = H * 0.73

# Base floor gradient — dark warm wood
floor_gr = cairo.LinearGradient(0, FLOOR_Y, 0, H)
floor_gr.add_color_stop_rgba(0.0, *hex_rgb('#2A2A2D', 1.0))
floor_gr.add_color_stop_rgba(0.15, *hex_rgb('#221E18', 1.0))
floor_gr.add_color_stop_rgba(0.6, *hex_rgb('#1A1610', 1.0))
floor_gr.add_color_stop_rgba(1.0, *hex_rgb('#0E0E10', 1.0))
ctx.rectangle(0, FLOOR_Y, W, H - FLOOR_Y)
ctx.set_source(floor_gr)
ctx.fill()

# Wood grain lines — subtle horizontal texture
ctx.save()
ctx.set_line_width(0.6)
rng = random.Random(42)
for i in range(160):
    gy = FLOOR_Y + (H - FLOOR_Y) * (i / 160) ** 0.7
    grain_alpha = rng.uniform(0.02, 0.07)
    gx_start = rng.uniform(0, W * 0.2)
    gx_end   = rng.uniform(W * 0.75, W)
    ctx.move_to(gx_start, gy + rng.uniform(-1.5, 1.5))
    ctx.line_to(gx_end,   gy + rng.uniform(-1.5, 1.5))
    ctx.set_source_rgba(*hex_rgb('#6B5030', grain_alpha))
    ctx.stroke()
ctx.restore()

# Floor–wall join — thin dark line
ctx.rectangle(0, FLOOR_Y - 1, W, 2)
ctx.set_source_rgba(0.04, 0.03, 0.02, 0.9)
ctx.fill()

# ── 11. LIGHT POOL ON FLOOR ──────────────────────────────────────────────────
pool_cx = WIN_CX + W * 0.02
pool_cy = FLOOR_Y + (H - FLOOR_Y) * 0.25
pool_rx = WIN_W * 0.85
pool_ry = (H - FLOOR_Y) * 0.40

# Scale context to draw ellipse
ctx.save()
ctx.translate(pool_cx, pool_cy)
ctx.scale(pool_rx, pool_ry)
pool_pat = cairo.RadialGradient(0, 0, 0, 0, 0, 1)
pool_pat.add_color_stop_rgba(0.0,  *hex_rgb('#E8C87A', 0.28))
pool_pat.add_color_stop_rgba(0.35, *hex_rgb('#C9A84C', 0.16))
pool_pat.add_color_stop_rgba(0.7,  *hex_rgb('#8A6420', 0.07))
pool_pat.add_color_stop_rgba(1.0,  *hex_rgb('#3D2B08', 0.0))
ctx.arc(0, 0, 1, 0, 2*math.pi)
ctx.set_source(pool_pat)
ctx.fill()
ctx.restore()

# Reflection shimmer on floor surface
ctx.save()
ctx.set_operator(cairo.OPERATOR_SCREEN)
for i in range(4):
    sx = pool_cx + (i - 1.5) * pool_rx * 0.3
    shimmer = cairo.RadialGradient(sx, pool_cy - pool_ry*0.1, 0, sx, pool_cy, pool_rx*0.4)
    shimmer.add_color_stop_rgba(0, *hex_rgb('#F5DFA0', 0.06))
    shimmer.add_color_stop_rgba(1, *hex_rgb('#E8C87A', 0.0))
    ctx.arc(sx, pool_cy, pool_rx*0.4, 0, 2*math.pi)
    ctx.set_source(shimmer)
    ctx.fill()
ctx.restore()

# ── 12. CURTAIN HEM SHADOW ON FLOOR ──────────────────────────────────────────
# Left panel hem
hem_l = cairo.LinearGradient(0, FLOOR_Y, 0, FLOOR_Y + 60)
hem_l.add_color_stop_rgba(0, *hex_rgb('#0E0E10', 0.55))
hem_l.add_color_stop_rgba(1, *hex_rgb('#0E0E10', 0.0))
ctx.rectangle(0, FLOOR_Y, WIN_CX - WIN_W*0.38, 60)
ctx.set_source(hem_l)
ctx.fill()

# Right panel hem
hem_r = cairo.LinearGradient(0, FLOOR_Y, 0, FLOOR_Y + 60)
hem_r.add_color_stop_rgba(0, *hex_rgb('#0E0E10', 0.55))
hem_r.add_color_stop_rgba(1, *hex_rgb('#0E0E10', 0.0))
ctx.rectangle(WIN_CX + WIN_W*0.35, FLOOR_Y, W, 60)
ctx.set_source(hem_r)
ctx.fill()

# ── 13. SKIRTING BOARD ───────────────────────────────────────────────────────
skirt_y = FLOOR_Y - 14
skirt_gr = cairo.LinearGradient(0, skirt_y, 0, FLOOR_Y)
skirt_gr.add_color_stop_rgba(0, *hex_rgb('#2A2218', 0.9))
skirt_gr.add_color_stop_rgba(0.5, *hex_rgb('#1A1610', 0.95))
skirt_gr.add_color_stop_rgba(1, *hex_rgb('#111113', 1.0))
ctx.rectangle(0, skirt_y, W, 14)
ctx.set_source(skirt_gr)
ctx.fill()
# Skirt top highlight
ctx.rectangle(0, skirt_y, W, 1.5)
ctx.set_source_rgba(*hex_rgb('#4A3820', 0.7))
ctx.fill()

# ── 14. CEILING SHADOW ───────────────────────────────────────────────────────
ceil_gr = cairo.LinearGradient(0, 0, 0, H * 0.12)
ceil_gr.add_color_stop_rgba(0, *hex_rgb('#0E0E10', 1.0))
ceil_gr.add_color_stop_rgba(1, *hex_rgb('#111113', 0.0))
ctx.rectangle(0, 0, W, H * 0.12)
ctx.set_source(ceil_gr)
ctx.fill()

# ── 15. VIGNETTE — edge darkening ────────────────────────────────────────────
vig = cairo.RadialGradient(W/2, H/2, H*0.3, W/2, H/2, W*0.75)
vig.add_color_stop_rgba(0, *hex_rgb('#111113', 0.0))
vig.add_color_stop_rgba(0.6, *hex_rgb('#0A0A0C', 0.15))
vig.add_color_stop_rgba(1.0, *hex_rgb('#050506', 0.72))
ctx.rectangle(0, 0, W, H)
ctx.set_source(vig)
ctx.fill()

# ── 16. LEFT WALL DEEP SHADOW ────────────────────────────────────────────────
lsh = cairo.LinearGradient(0, 0, W*0.22, 0)
lsh.add_color_stop_rgba(0, *hex_rgb('#050506', 0.97))
lsh.add_color_stop_rgba(0.6, *hex_rgb('#0E0E10', 0.65))
lsh.add_color_stop_rgba(1, *hex_rgb('#111113', 0.0))
ctx.rectangle(0, 0, W*0.22, H)
ctx.set_source(lsh)
ctx.fill()

# ── 17. RIGHT WALL SHADOW ────────────────────────────────────────────────────
rsh = cairo.LinearGradient(W, 0, W*0.78, 0)
rsh.add_color_stop_rgba(0, *hex_rgb('#050506', 0.95))
rsh.add_color_stop_rgba(1, *hex_rgb('#111113', 0.0))
ctx.rectangle(W*0.78, 0, W*0.22, H)
ctx.set_source(rsh)
ctx.fill()

# ── 18. FINAL GOLD GLOW BLOOM — over curtains ────────────────────────────────
# Soft bloom at window centre, subtle gold wash
bloom = cairo.RadialGradient(WIN_CX, H * 0.22, 0, WIN_CX, H * 0.28, WIN_W * 0.9)
bloom.add_color_stop_rgba(0.0, *hex_rgb('#F5DFA0', 0.22))
bloom.add_color_stop_rgba(0.3, *hex_rgb('#E8C87A', 0.10))
bloom.add_color_stop_rgba(0.7, *hex_rgb('#C9A84C', 0.03))
bloom.add_color_stop_rgba(1.0, *hex_rgb('#111113', 0.0))
ctx.save()
ctx.set_operator(cairo.OPERATOR_SCREEN)
ctx.rectangle(0, 0, W, H)
ctx.set_source(bloom)
ctx.fill()
ctx.restore()

# ── WRITE ────────────────────────────────────────────────────────────────────
surface.write_to_png(OUT)
print(f"Saved: {OUT}")
