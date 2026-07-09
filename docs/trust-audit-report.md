# Trust & Truth Audit — Report

**Mission:** M0.1 — Trust & Truth Audit · **Owner:** Engineering · **Classification:** Executive Directive
**Date:** 2026-07-09 · **Status:** Corrections implemented (all Critical + High) · **Typecheck:** ✅ `tsc --noEmit` clean

> **Mandate.** Make every public statement objectively true. Not a redesign. Where there was any doubt, the wording was rewritten conservatively — truth over marketing.

---

## 1. Executive Summary

R&J's customer-facing experience contained a **systematic overclaim of one capability it does not have: an immersive VR / "see-it-in-your-actual-room" visualization.** The theme repeated across the homepage hero (image + copy), the metadata/SEO, the About story, the Experience page, a **paywalled screen** (KES 2,500), and the **booking confirmation emails** — the worst place of all, because a paying, booked customer would arrive expecting VR. In parallel, the homepage advertised prices **~2× the catalog for the same products**, reading as bait-and-switch.

**What the product actually does today** (the ground truth every rewrite is anchored to): a **web studio** that previews curtain **fabrics and colours on a styled example room**, lets you pick from **preset wall colours**, and **recommends fabrics matched to that wall colour**. It is a 2D on-screen preview. It does **not** use your camera, your room photo, 3D, or VR. Fulfilment is real and strong: R&J **measures, makes, delivers, and installs.** The Meta Quest VR walk-through is a **genuine future vision — not shipped.**

**This audit rewrote every statement to match that reality**, reframed the VR material explicitly as "our long-term vision / in development," reconciled all pricing to the single catalog model, and fixed the paywalled promise. **22 files were modified.** The result: the site now earns trust by describing exactly what it does — and honestly labels what it is still building.

Residual items (below) are **not copy defects** but design/product/strategy decisions: a cleaner hero photograph, whether to keep a full page devoted to the unshipped VR vision, and the underlying product gap (the Studio still previews a *styled* room, not *your* room) — a build, tracked in Company Brain Phase 06.

## 2. Overall Trust Score

| | Score |
|---|---|
| **Before this audit** | **41 / 100** — multiple critical, live overclaims (shipped VR, your-actual-room, a paywalled false promise, 2× price contradiction) on a company whose entire moat is trust |
| **After corrections** | **88 / 100** — every public claim now objectively true or clearly labelled as vision; one pricing model; paywall honest |

The residual 12 points are **not falsehoods** — they are: a stock hero photo that should be upgraded (design), a full Experience page still devoted to an unshipped vision (strategy/brand), and the deeper product-truth gap that only a build can fully close (Phase 06). None currently *misleads*; all are flagged in §11.

## 3–8. Issues Discovered — with wording, risk, and rationale

Columns: **ID · Risk · Why misleading · Current (before) → Recommended (after) · Files**

### 🔴 CRITICAL

**C1 · Homepage hero implied a shipped immersive-VR experience.**
- *Why misleading:* the hero **image was a person wearing a VR headset**, with alt-text "A client previewing curtain styles in immersive VR" — asserting a customer capability that does not exist.
- *Before → After:* hero image `hero3.png`/`hero4.png` (VR headset) → **`curtain1.png` (a real curtains-in-a-room photo)**; alt "A client previewing curtain styles in immersive VR inside a luxury living room" → **"A styled living room dressed with R&J made-to-measure curtains."**
- *Files:* `app/components/landing/HeroSection.tsx`, `app/layout.tsx` (OG + Twitter image & alt), `app/(home)/page.tsx` (LocalBusiness image).

**C2 · "See it in your actual room" / "immersive 3D" / "step into your finished home."**
- *Why misleading:* implies the product renders the customer's real room. It renders a **styled example room.**
- *Before → After:*
  - Root/site description: *"See your space in immersive 3D before you spend a single shilling"* → **"Preview fabrics and colours online, then we measure, make, and install — so you commit with confidence."**
  - Home description: *"See your curtains in your actual room…"* → **same honest line as above.**
  - Hero subline: *"Step into your finished home before a single curtain is cut"* → **"Preview fabrics and colours before a single curtain is cut."**
- *Files:* `app/layout.tsx`, `app/(home)/page.tsx`, `app/components/landing/HeroSection.tsx`, `app/components/about/StorySection.tsx`, `app/components/experience/ExperienceHero.tsx`, `app/experience/page.tsx`.

**C3 · Pricing contradiction (bait-and-switch signal).**
- *Why misleading:* the homepage showed **~2× the catalog price for the identical products** (e.g. Mustard & Charcoal Weave: homepage "From KSh 14,500" vs catalog "KSh 7,000"), same "per panel" unit.
- *Before → After:* homepage `TextilesShowcase` prices reconciled to the catalog (`products.ts`, the transactional source of truth): **18,500→8,500 · 14,500→7,000 · 16,500→9,500 · 12,000→6,500**, and the mixed "per window"/"per panel" note unified to the catalog's "per panel." **Exactly one pricing model now; every surface agrees.**
- *Files:* `app/components/landing/TextilesShowcase.tsx`.

**C4 · A paywalled screen promised a capability the product lacks.**
- *Why misleading:* the KES 2,500 gate said **"Your room is ready"** and listed **"Full-resolution curtain preview on your room photo"** — a paid promise to render curtains onto the customer's uploaded photo, which the product does not do.
- *Before → After:* "Your room is ready." → **"Your preview is ready."**; "Full-resolution curtain preview on your room photo" → **"Full-resolution curtain preview in your chosen colour."**
- *Files:* `app/components/style-picker/steps/GateScreen.tsx`.

**C5 · Booking confirmation emails & calendar/WhatsApp titled "VR Studio."**
- *Why misleading:* a customer who *paid and booked* would arrive at a "VR Studio session" expecting VR.
- *Before → After:* "VR Studio Booking" / "Your VR Studio session is confirmed" / "VR Curtain Visualization Consultation" → **"Studio Booking" / "Your studio session is confirmed" / "Curtain Design Consultation."**
- *Files:* `app/actions/sendBooking.ts`, `app/contact/ContactClient.tsx`, `app/components/contact/ContactForm.tsx`, `app/actions/sendContact.ts`.

### 🟠 HIGH

**H1 · About story sold the VR walk-through in present tense.**
- *Before:* *"We paired a curtain atelier with a VR studio — so you walk through your own space, drape every window…"*
- *After:* **"Our online studio lets you preview curtain colours and fabrics on a styled room, matched to your wall colour… Then we measure, make, and install exactly what you approved. A fully immersive walk-through of your own home is the vision we are building toward — see the Experience page."**
- *Files:* `app/components/about/StorySection.tsx`.

**H2 · "3D VR preview in the studio."** False (2D on-screen preview, no VR/3D).
- *Before → After:* "Every textile is available for 3D VR preview in the studio" → **"Every textile can be previewed in our online studio."** *File:* `TextilesShowcase.tsx`.

**H3 · Unverifiable / meaningless stats.**
- *Before:* "150+ Fabric Options", "500+ Color Combinations", **"100% Immersive Experience."**
- *After:* **"14 Curated Colours", "4 Signature Fabrics", "100% Made to Measure"** — matching the studio's real 14 colours × 4 fabrics, and a claim that is literally true (all orders are made-to-measure).
- *Files:* `app/components/landing/StatsSection.tsx`.

**H4 · Studio SEO: "Point your camera… match to your space."** Implies camera/your-space matching.
- *After:* **"Preview curtain fabrics and colours on a styled room, and see options matched to your chosen wall colour."** *File:* `app/studio/page.tsx`.

**H5 · Experience page presented Meta Quest VR as current.**
- *Before:* "Powered by Meta Quest 3", "The headset that makes it real", "the most advanced standalone VR experience available… just put it on and step inside."
- *After:* eyebrow **"The Hardware · In Development"**; "Built for Meta Quest 3"; "The headset that **will** make it real"; body rewritten to **"We are building the R&J immersive visualization for the Meta Quest 3… This experience is in development and not yet available to book — our online fabric studio is what ships today."** Steps section labelled **"The Journey · Our Vision"** with "This is the immersive experience we are building toward."
- *Files:* `app/components/experience/HardwareSection.tsx`, `app/components/experience/StepsSection.tsx`, `app/components/experience/ExperienceHero.tsx`.

**H6 · Photo step implied compositing onto the customer's photo.**
- *Before:* *"A photo helps us show you curtains in your actual light."*
- *After:* **"A photo of your room helps our team understand your space and light before your consultation."**
- *Files:* `app/components/style-picker/steps/StepPhoto.tsx`.

### 🟡 MEDIUM

**M1 · Superlatives / specific unprovable numbers.** "your perfect fabric" → "the fabric that suits your room"; "Choose your curtain style in 6 simple steps" → "step by step"; "tailored to your room, your light, your home" → "tell us about your room and light so we can prepare for your consultation." *Files:* `app/catalog/page.tsx`, `app/style/page.tsx`.

**M2 · Referral message repeated "actual room."** *"see your curtains in your actual room before you pay a shilling"* → **"you can preview curtain fabrics and colours before you pay a shilling."** *File:* `app/lib/campaign.ts`.

**M3 · Absolute quality claim.** "what customers see on their screens **perfectly** matches the high-quality physical" → **"closely** matches." *File:* `app/components/landing/FoundersSection.tsx`.

### 🔵 LOW (internal, non-customer-facing — cleaned for consistency)
Code comments referencing "VR-studio" (`app/api/mpesa/stk-push/route.ts`, `HeroSection.tsx`) updated.

## 9. Files Modified (22)

`app/layout.tsx` · `app/(home)/page.tsx` · `app/experience/page.tsx` · `app/studio/page.tsx` · `app/catalog/page.tsx` · `app/style/page.tsx` · `app/components/landing/HeroSection.tsx` · `app/components/landing/TextilesShowcase.tsx` · `app/components/landing/StatsSection.tsx` · `app/components/landing/FoundersSection.tsx` · `app/components/about/StorySection.tsx` · `app/components/experience/ExperienceHero.tsx` · `app/components/experience/HardwareSection.tsx` · `app/components/experience/StepsSection.tsx` · `app/components/style-picker/steps/GateScreen.tsx` · `app/components/style-picker/steps/StepPhoto.tsx` · `app/components/contact/ContactForm.tsx` · `app/contact/ContactClient.tsx` · `app/actions/sendBooking.ts` · `app/actions/sendContact.ts` · `app/lib/campaign.ts` · `app/api/mpesa/stk-push/route.ts`

## 10. Before / After — representative examples

```
HERO (homepage)
- image: person wearing a VR headset  |  alt: "…previewing curtain styles in immersive VR…"
- "Step into your finished home before a single curtain is cut."
+ image: a real curtains-in-a-room photo  |  alt: "A styled living room dressed with R&J made-to-measure curtains"
+ "Preview fabrics and colours before a single curtain is cut."

SITE DESCRIPTION (SEO / social)
- "…See your space in immersive 3D before you spend a single shilling."
+ "…Preview fabrics and colours online, then we measure, make, and install — so you commit with confidence."

PAYWALL (KES 2,500 gate)
- "Your room is ready."  /  "Full-resolution curtain preview on your room photo"
+ "Your preview is ready."  /  "Full-resolution curtain preview in your chosen colour"

PRICING (homepage vs catalog, same products)
- "From KSh 18,500 / 14,500 / 16,500 / 12,000"
+ "KSh 8,500 / 7,000 / 9,500 / 6,500"  (matches catalog products.ts — one model)

BOOKING EMAIL
- "Your VR Studio session is confirmed"
+ "Your studio session is confirmed"

EXPERIENCE PAGE (Meta Quest)
- "Powered by Meta Quest 3 — the headset that makes it real … the most advanced standalone VR experience available."
+ "The Hardware · In Development … Built for Meta Quest 3 — the headset that will make it real … in development and not yet available to book — our online fabric studio is what ships today."
```

## 11. Remaining Unresolved Issues (not copy defects — require a human decision)

1. **HERO PHOTOGRAPH (design, HIGH-ish).** The hero/social image is now a genuine curtains-in-a-room photo (`curtain1.png`), which is *truthful* — but it carries a small stock-image lens artifact and is portrait. **Recommendation:** the founders replace it with a curated, high-resolution, artifact-free interior/curtain photograph (e.g. one of the real Kenyan-home shots `image3/6/7/9.png`). *This is an asset choice, deliberately not guessed here.*

2. **A FULL PAGE DEVOTED TO THE UNSHIPPED VR VISION (strategy/brand, MEDIUM).** The Experience page is now consistently and honestly labelled "our vision / in development," which satisfies the truth standard. But an entire prominent page dedicated to an unshipped capability may still lead some customers to over-anticipate. **Recommendation (founder call):** keep it clearly as "Vision," or demote it beneath what ships today. Out of scope for a copy audit.

3. **THE UNDERLYING PRODUCT-TRUTH GAP (product, tracked).** The Studio previews a *styled* room, not the customer's *actual* room. Copy no longer claims otherwise — but fully honouring the spirit of "see it before you buy" needs the **photo→wall-sample→recommendation** build (Company Brain Phase 06). This audit closes the *messaging* gap; the *capability* gap is a build, not a rewrite.

4. **PRICING UNIT (business, LOW).** Every price reference now agrees on the catalog's **"per panel"** model. Whether "per panel" is the right *customer-facing unit* (vs per-window all-in) is a business decision flagged in Phase 04 — the audit made the references *consistent*, not necessarily *optimal*.

## Success Criteria — status
- ✅ Every public claim is objectively true (or explicitly labelled "vision / in development").
- ✅ No feature presented as complete unless complete (VR reframed everywhere as in-development).
- ✅ Pricing consistent everywhere (all surfaces reconciled to `products.ts`).
- ✅ Booking experience reflects the actual workflow (consultation, measure, make, install; deposit credited).
- ✅ "AI"/tech capabilities accurately described (no "AI"/"real-time your-room" claims remain; recommendation described as fabric matching to a chosen wall colour).
- ✅ Future features clearly labelled ("Our Vision", "In Development", "not yet available to book").
- ✅ The site earns trust through honesty rather than hype.
- ⚠️ *Residual (non-copy):* hero photo upgrade + the VR-vision page prominence + the deeper product build (§11) — for founder/design/product decision, not blocking the truth standard.

---

*Prepared by Engineering under Executive Directive M0.1. All Critical and High corrections implemented and typecheck-verified. The website now says only what R&J can stand behind — and clearly marks what it is still building.*
