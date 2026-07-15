# Phase 06 — Product

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (Rose Kabathi, Simon Juma) · Review cadence: Quarterly, or on any change to the Studio's core promise

> **What this document is.** A precise, code-grounded account of *what the product actually is today*, *the single gap between what it promises and what it ships*, and *the sequenced roadmap to close that gap and extend the product* — all governed by Phase 01's technology philosophy (§10: "technology exists to manufacture and protect trust; it is never the product"). This is the phase every earlier one pointed to: [Phase 02](phase-02-customer.md) §0.2.1, [Phase 04](phase-04-business-model.md) §0.2.2, and [Phase 05](phase-05-brand.md) §0.2.1/§0.2.3 all deferred the same defect here — **the "see it in your actual room" promise the product does not yet keep.**
>
> **Evidence grade: A on the audit.** What the product does is read directly from the code (`MobileStudio.tsx`, `colorEngine.ts`, the style-picker, `products.ts`), cited by file/line. The roadmap and sequencing are grade-B strategic judgment consistent with Phases 01–05 and gated on the Phase 02 validation plan. Where a build is proposed, its feasibility is assessed against what already exists in the codebase — because the most important finding of this phase is that **the pieces to close the core gap are largely already built; they are simply not wired together.**

---

## 0. Pre-Work: Audit, Contradictions, Open Questions

### 0.1 Current-state audit — exactly what ships today

Three product surfaces, read from code:

1. **The Studio (`/studio` → `MobileStudio.tsx`) — a stock-room configurator + honest recommendation engine.**
   - Loads a **fixed stock photo**: `img.src = '/assets/sittingroom.png'` (line 120). *There is no photo upload, no camera input in this flow.*
   - Three controls: **Fabric** (recolour the drapes), **Window** (Modern/French/Heritage frame profile), **Walls** (10 **preset** wall swatches).
   - Selecting a wall swatch re-derives a **fabric palette via `getRecommendations()`** — but, per the code's own comment (line 124), *"the wall in the photo stays fixed, but it drives which fabrics we recommend."* The room never changes; the *recommendations* do.
   - `drawScene()` (`curtainRenderer.ts`) composites recoloured curtains + the chosen window frame over the stock photo. Funnels to **"Pay to Book" → /checkout.**

2. **The recommendation engine (`colorEngine.ts`) — the genuine, differentiated asset.**
   - Converts a wall colour to HSL, infers **warm/cool undertone**, and generates **five ordered recommendations (safe → bold)** using real colour theory: neutral, soft neutral, tonal (same hue deeper), value anchor, complementary (hue + 180°).
   - Matches each to the **nearest real catalog fabric**, and — critically — **refuses to fake a match**: *"Returns undefined if no fabric is close enough… we'd rather say nothing than claim a misleading match"* (line 163). **This is honesty encoded in the product — the exact Principle-3 discipline, already shipping.**
   - Contains `sampleCanvasColor()` — a primitive that can read an average wall colour **from any canvas, including a photo** — but in the shipped Studio it is **not wired to a user photo**; recommendations are driven from the preset swatch hex.

3. **The style-picker (`/style` → `StepPhoto` + `StepColour`) — captures a photo it doesn't use.**
   - `StepPhoto` lets the customer photograph/upload their window ("A photo helps us show you curtains in your actual light"), stores the `File`, shows the raw preview — **but no curtain is composited onto it** (Phase 02 §0.2.1). Then a colour step, then the payment gate.

**Plus:** a catalog (`products.ts`, 8 products, KSh 4,500–10,000), checkout (M-Pesa), and the founding pre-sale.

### 0.2 Contradictions found (tracked to owners) — the one that matters, stated precisely
1. **Promised ≠ shipped, exactly specified.**
   - **Promised** (hero, About, `referralMessage`): *"Step into your finished home before a single curtain is cut," "see your curtains in your actual room," "a VR studio so you walk through your own space."*
   - **Shipped:** a **stock sitting-room** re-tint driven by **preset** wall swatches; a photo-capture step whose photo is **never rendered on**; and **no VR at all.**
   - So the product delivers *"see a fabric you might like, previewed on an example room"* while the brand sells *"see it in YOUR room"* and *"immersive VR."* **This is the company's single largest promised-vs-shipped gap, and closing (or honestly re-scoping) it is the #1 product priority.** **Owner: Product — this phase's whole roadmap orbits it.**
2. **The best asset is buried; the unshipped spectacle is featured.** The honest, differentiated recommendation engine (the real "AI that matters," Strategy Review §7) is hidden inside the Studio, while VR spectacle leads the brand (Phase 05 §0.2.1). **The product's marketing inverts its own strengths.** **Owner: Product/Brand.**
3. **Two disconnected "studios."** The `/studio` configurator (stock room, preset walls, no upload) and the `/style` picker (uploads a photo, no render) are **two half-products that, combined, would be the promised one.** Neither alone keeps the promise; together they nearly do. **Owner: Product — this is the integration insight of the phase (§5).**

### 0.3 Open questions / assumptions carried into this document
- **Does the customer actually need her *own* room rendered, or is a convincing example room + a wall-matched *recommendation* enough to remove the fear?** The whole roadmap priority hinges on this — and it is the Phase 02 §12 "killer question," still unanswered `[ASSUMPTION — verify in interviews before the expensive build]`.
- **Feasibility of honest photo-compositing** (perspective, window masking, drape geometry on an arbitrary user photo) vs the achievable **photo-to-recommendation** (already 80% built via `sampleCanvasColor`) `[assess in a spike]`.
- **Funnel behaviour:** do Studio users convert / return-fewer-complaints than non-users? Uninstrumented (Phase 02 §12, Phase 04 §11).

---

## 1. Executive Summary

R&J's product is **better than its strategy documents feared and its marketing is dishonest about — in opposite directions.** The shipped Studio is a *tastefully executed* stock-room curtain configurator, and buried inside it is a **genuinely differentiated, genuinely honest recommendation engine** (`colorEngine.ts`) that reads a wall's undertone, applies real colour theory, and — remarkably — *refuses to fake a fabric match.* That engine is the seed of the "photo-to-recommendation AI" the Strategy Review called the only AI worth building. **The product's real problem is not that it's weak; it's that it's pointed at the wrong promise.**

The **one gap that matters**, now specified to the line: the brand promises *"see it in your actual room"* and *"immersive VR,"* while the product renders a **stock room** from **preset** wall swatches, captures a customer photo it **never draws on**, and ships **no VR.** This gap is the source of the trust liability every prior phase flagged.

**The strategically decisive — and encouraging — finding is that the pieces to close the gap largely already exist and are merely unwired.** The Studio can composite curtains onto a room image (`drawScene`); the engine can sample a real wall colour from a photo (`sampleCanvasColor`); the style-picker already captures the customer's photo. **Connecting these three — photo → sample the real wall → recommend fabrics for *that* wall → preview them — would convert the honest recommendation engine into an honest, personalised "your-room" experience, without the fantasy of full VR.** That is the roadmap's H1 spine.

The product philosophy that governs all of it (Phase 01 §10): **build only what removes a named customer uncertainty, and never let a demo promise more than the product delivers.** By that test, the next build is *photo-to-recommendation* (removes "will this suit MY wall?"), and the next *retirement* is the VR overclaim (adds spectacle, subtracts trust). **Ship honesty; retire the fantasy.**

---

## 2. What the Product Is — and Must Become

**Is today:** a **stock-room curtain configurator** with an **honest fabric-recommendation engine**, funnelling to a consultation/booking. A competent *hook* (Phase 05: the tool is the trust-builder, not the product).

**Must become (H1):** an **honest certainty tool** that answers the customer's real question — *"what will suit MY room, and can I trust how it'll look?"* — using her actual wall colour and light, backed by real catalog fabrics and a human consultation. Not a spectacle; a **confidence machine** (Phase 02 §3 emotional job).

**Must never become:** a VR showpiece built ahead of demand, or an AI-theatre generator that produces impressive-but-dishonest renders (Phase 01 §10.3; Phase 05 §4 "Maker, not Magician").

---

## 3. Product Principles (Technology Philosophy, Applied)

From Phase 01 §10, made concrete for product decisions:
1. **Every feature names the uncertainty it removes.** No uncertainty removed → not built. (Kills feature-for-fashion.)
2. **Honesty over spectacle — enforced in the render.** A preview may never look better than the delivered curtain will (Belief 4). `colorEngine`'s "refuse to fake a match" is the template: **when unsure, show less, not a prettier lie.**
3. **Build the differentiator, rent the commodity.** Build the certainty engine + its data; rent payments (M-Pesa), hosting (Vercel), and *do not* rebuild a commodity AR SDK to chase VR.
4. **Solve it by hand first.** Rose already gives fabric guidance in consultation — the recommendation engine should *encode her judgment*, validated against her, not replace it (Principle 5; Belief 7).
5. **Instrument before you feature.** Measure preview→consultation→order and preview-vs-delivered match *before* building the next visualization layer (Phase 04 §11).

---

## 4. The Real Asset — and How to Build On It

**`colorEngine.ts` is R&J's most under-exploited product asset.** It is:
- **Differentiated** — most competitors offer a colour *picker*; R&J offers colour *advice* grounded in the customer's wall and real inventory.
- **Honest** — it declines to mislead (the >60 RGB-distance cutoff). That honesty *is* the brand (Phase 05 §3).
- **A data flywheel seed** — every recommendation shown/chosen is taste-and-fit data (Phase 01 §9.4), *if instrumented now.*
- **80% of the way to the "your-room" experience** — `sampleCanvasColor` already reads a wall from a canvas; it simply isn't pointed at the customer's uploaded photo.

**The build this unlocks (H1 headline):** *photo → sample the real wall colour → recommend fabrics for that wall → show them.* This is **feasible now** (all primitives exist), **removes a named uncertainty** ("will this suit MY wall/light?"), and is **honest** (a wall-matched recommendation is a true statement, unlike a faked room render). It converts the buried engine into the personalised experience the brand wants — **without** claiming full photorealistic compositing or VR.

---

## 5. Product Strategy — Close the Gap by Integration, Not Invention

**The insight (§0.2.3): R&J already built the two halves of its promised product and left them disconnected.**
- `/style` **captures** the customer's room photo (but renders nothing).
- `/studio` **renders** curtains + recommends fabrics (but only on a stock room from preset walls).

**Integrate them into one honest flow:**
1. Customer photographs her window (existing `StepPhoto`).
2. Engine **samples her real wall colour** from the photo (existing `sampleCanvasColor`).
3. Engine **recommends fabrics for her actual wall + undertone** (existing `getRecommendations`), matched to real catalog products.
4. Preview shows those fabrics — first as an **honest, clearly-labelled representation** (on a matched example scene *or*, when feasible, lightly composited onto her photo), never over-claiming photorealism.
5. Funnel to consultation, where **Rose confirms in person** (the human trust layer, Belief 7).

**This is a re-scope of the promise to what the product can honestly keep**, plus a modest integration to make it personal — not a moonshot. It directly closes §0.2.1 while honouring Principle 3.

---

## 6. Product Roadmap (Sequenced)

Gated on the Phase 01 §10 sequencing stance and the Phase 02 §0.3 validation. **Do not skip a gate.**

**Now — H1 "Make the promise honest" (weeks):**
1. **Honesty pass (this week):** retire the VR hero imagery/claims; align all copy to what ships (Phase 05 §0.2.1/§0.2.3). *Highest priority — it's a trust fix, not a feature.*
2. **Wire photo → recommendation:** connect `StepPhoto` → `sampleCanvasColor` → `getRecommendations`. Ship the "fabrics matched to your wall" experience. *Feasible now; closes most of the gap honestly.*
3. **Instrument everything:** preview→consultation→order funnel, fabric-choice logging, and a post-install "did it match your preview?" probe (the Promise-Kept signal). *Prerequisite for every later decision (Phase 04 §11).*
4. **Fix the transactional defects:** the price contradiction + undefined unit (Phase 04 §0.2) — a product-data fix, not just copy.

**Next — H1+ "Richer, still honest" (months, gated on validation):**
5. **Honest photo-compositing spike:** assess perspective/window-masking feasibility on real user photos. Ship *only if* it can be done without over-claiming; otherwise keep the labelled-representation model.
6. **Encode Rose's design judgment** into the recommendation reasons (measured against her real advice).
7. **Light AR** (phone-based, honest) *only if* it measurably lifts confidence over the photo-recommendation flow.

**Later — H2/H3 (gated on H1 trust metrics, per Phase 03 §9):**
8. **Extend the engine to adjacent categories** (blinds, sheers, upholstery, cushions) — same photo→recommendation loop, larger basket (Phase 04 §4 AOV lever).
9. **Measurement-from-photo** (de-risks the wrong-size error; cuts founder measuring load — Strategy Review §7; attacks the Phase 04 §7 capacity ceiling).
10. **Immersive VR** — only when demand + confidence-lift justify the cost (Phase 01 §10 sequencing). Not before.
11. **The certainty engine as a platform** (H3b) — a separate-brand, founder-level decision (Phase 01 §14).

---

## 7. What NOT to Build (Non-Goals)

Naming these protects the roadmap from fashion (Principle 6):
- **No immersive VR now.** It is unshipped, over-promised, copyable, and ahead of demand. Retire the *claim* immediately; defer the *build* to step 10.
- **No generative "AI reimagine your room" theatre.** Crowded, near-free, and prone to producing beautiful lies that widen the preview-vs-reality gap (Belief 4; Phase 03 §6.6).
- **No consumer-facing software product.** R&J sells certainty and curtains, not apps (Phase 01 §7 non-goals).
- **No feature that can't name its uncertainty.** The gate in Principle 1.

---

## 8. Product Metrics

Tied to Phase 01 §12 (trust metrics lead):
- **Preview-vs-Delivered Match** (post-install probe) — the product's truest score; the Promise-Kept Rate at the product layer. *Target → 100%.*
- **Preview → Consultation → Order conversion** — does the tool actually drive trust and sales, or is it a toy? (The Strategy Review's open question, §2/§3.)
- **Recommendation acceptance** — do customers pick a recommended fabric? (Validates the engine + seeds the data flywheel.)
- **Anti-metric (rejected):** raw Studio sessions/plays (Phase 01 §12; Phase 02 §9 "Tech-Toy Tourist"). Engagement that doesn't convert to trust is noise.

---

## 9. Product Risks
1. **Building the expensive "your-room render" before validating it's the real blocker (HIGHEST).** Phase 02 §0.3 warns the stock-room may not actually be what stops customers. *Mitigation: ship the cheap photo→recommendation first; validate the blocker before the costly compositing build.*
2. **The promise stays ahead of the product.** Every day the VR/"actual room" claims live, trust erodes. *Mitigation: honesty pass now (step 1).*
3. **Honest compositing may be technically hard** on arbitrary photos. *Mitigation: spike it; fall back to labelled representation — never ship a dishonest render.*
4. **Un-instrumented product = flying blind.** No funnel data → no evidence-based roadmap. *Mitigation: step 3.*
5. **Feature creep toward spectacle** (VR/AI) under investor pressure to look "tech." *Mitigation: Principle 1 gate + §7 non-goals.*

---

## 10. Applying the Decision Framework to Product Bets
- **Bet: "Wire photo → wall-sample → recommendation (step 2)."** All Four Gates ✅ (removes a named uncertainty, honest, feasible now) → **build next.**
- **Bet: "Honesty pass on VR/'actual room' copy (step 1)."** Trust Gate ✅✅ → **do this week**, before any feature.
- **Bet: "Build full photorealistic your-room compositing now."** Evidence Gate ⚠️ (blocker unvalidated) + feasibility risk → **spike first, don't commit.**
- **Bet: "Build immersive VR to look venture-grade."** Trust + Evidence + Long-Term Gates ❌ → **rejected; defer to step 10.**
- **Bet: "Add generative AI room re-imagining."** Trust Gate ❌ (dishonest-render risk) → **rejected (§7).**

---

## 11. Open Questions & Validation
- **Validate the real blocker** (Phase 02 §12 killer question): does the customer need her own room rendered, or does a wall-matched recommendation + example scene remove the fear? *Answer before the compositing build.*
- **Spike honest photo-compositing** feasibility; report back with a go/no-go.
- **Instrument the funnel** (step 3) — everything downstream depends on it.
- **Validate the engine with Rose** — do its recommendations match a master's judgment? If not, encode hers.

---

## Future Revision Notes
- **Contradictions to close (product code):** §0.2.1 is the company's headline gap; steps 1–2 close it honestly. §0.2.3 (two disconnected studios) is closed by the §5 integration.
- **Assets to protect & promote:** `colorEngine.ts` (honest recommendation + the "refuse to fake" discipline), the Studio's craft, the existing photo-capture and canvas-sampling primitives — R&J is closer to its promised product than any phase assumed.
- **Trigger for review:** the compositing spike result, first funnel data, any move on VR/AR, or an H2 category launch.
- **Dependency handoff:** Phase 07 (Technology) inherits the roadmap's build sequence and the "rent commodity / build differentiator" stance; Phase 08 (Operations) inherits measurement-from-photo as a capacity lever; Phase 10 (Finance) inherits the instrumentation as the source of the funnel + margin data it needs.

---

*End of Phase 06. The product is a good hook hiding a great, honest engine behind a dishonest promise. The work is not to invent — it is to retire the fantasy, wire together the pieces R&J already built, and let the honest engine keep the promise the brand wants to make. Per the workflow, await founder challenge and approval before Phase 07 (Technology).*
