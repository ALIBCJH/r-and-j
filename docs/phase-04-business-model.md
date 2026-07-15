# Phase 04 — Business Model

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (Rose Kabathi, Simon Juma) · Review cadence: Quarterly, or on any pricing-architecture change

> **What this document is.** How R&J *makes money, keeps money, and turns a small margin into a durable one* — the revenue model, the pricing architecture, the unit economics, and the path from a founder-bound service margin to a scalable one. It inherits the sizing and venture-scale framing from [Phase 03 — Market](phase-03-market.md) §3/§9, the willingness-to-pay bet from [Phase 02 — Customer](phase-02-customer.md) §7, and the "trust over growth" constraint from [Phase 01 — Foundation](phase-01-foundation.md).
>
> **Evidence grade: C (framework, not actuals).** R&J's real order data — actual AOV, order volume, repeat rate, and true per-order margin — lives in the runtime KV store (`app/lib/orders.ts`, Redis), **not in the repository, and has not been exported for this analysis.** Pricing figures, tiers, and campaign mechanics are read directly from code (grade-A). Everything about *margin and volume* is a labelled assumption (grade-C). **This document builds the model and names every knob; §11 is the plan to fill it with real numbers.** Until then, no pricing-architecture change (a one-way door, Phase 01 §13) should be locked on these assumptions.

---

## 0. Pre-Work: Audit, Contradictions, Open Questions

### 0.1 Current-state audit (the business model as it actually exists in code)
Read from `app/lib/products.ts`, `app/lib/campaign.ts`, `app/lib/orders.ts`:

- **Core revenue:** made-to-order curtain panels, catalog price **KSh 4,500–10,000/panel** (`products.ts`), with consultation + delivery + installation included in the offer (Phase 01 §7).
- **Consultation:** **KES 2,500**, credited to the order (the standalone studio deposit, `GateScreen` / `orders.ts` header comment) — a paid, refundable-via-credit qualification step.
- **Founding pre-sale:** a **KSh 1,000** deposit reserves one of **20 founding slots** (`FOUNDING_DEPOSIT_KSH`, `FOUNDING_SLOTS`), locking a "founding price." Backing **tiers** (`campaign.ts`): KSh 100→5%, 200→7%, 500→10%, 1000→12% launch discount. The pledge is **credited in full** to the eventual order; campaign closes **31 Aug 2026** (`LAUNCH_DATE`).
- **Order object** (`orders.ts`): tracks `total_ksh` (locked would-be price), `deposit_ksh` (charged today), `discount_pct`, `is_founding` — i.e. the model is explicitly a *deposit-now, balance-on-fulfilment* structure.
- **Payment rail:** M-Pesa STK push (Daraja), with a mock mode for demo.

### 0.2 Contradictions found (tracked to owners) — these are *business-model* defects, not cosmetics
1. **Two different prices for the same product, same unit.** Homepage `TextilesShowcase.tsx` shows **From KSh 12,000–18,500**; catalog `products.ts` shows **KSh 6,500–9,500** for the *same four products* — and for three of them the unit note is **identically "per panel."** This is not a panel-vs-window reconciliation; it is a **~2× price contradiction** that reads as bait-and-switch and directly corrodes the trust the whole company is built on (Phase 01 §0.2.2; Strategy Review §6.6). **Owner: Product — fix immediately, before any further paid traffic.**
2. **The pricing *unit* is undefined.** Notes mix "per panel," "per window · pair included," and "tri-layer set." A customer cannot tell what KSh 8,500 *buys* — one panel, a pair, or a window. **You cannot compute AOV, quote reliably, or defend margin on an undefined unit.** This is a genuine business-model gap, not a copy nit. **Owner: Product/Finance — define the priced unit (recommendation: price per finished *window*, all-in) before Phase 10.**
3. **"Refundable deposit" as demand proof.** The founding deposit is fully creditable/refundable (`campaign.ts`, founding page copy) — which means it measures *curiosity, not committed intent* (Phase 01 §0.2.3, Phase 02 §7). Presenting "spots taken" as validated demand is self-deception and an anti-metric (Phase 01 §12). **Owner: Finance/GTM — convert to an intent-measuring instrument (§5).**
4. **Included services silently compress margin.** Consultation (credited), delivery, and installation are bundled into a KSh 4,500–10,000 panel. On a small-ticket custom item, free skilled labour + logistics can eat most of the gross margin — and it is currently **unmeasured** (§4). **Owner: Finance.**

### 0.3 Open questions / assumptions carried into this document
- **True AOV per order** (not per panel) after the unit is defined and the price bug fixed `[ASSUMPTION — modelled at KSh 25,000–35,000/order]`.
- **True gross margin per order** after fabric, making-labour, consultation credit, delivery, install `[ASSUMPTION — modelled at 35–45% before founder labour]`.
- **Real order volume, repeat rate, and founding-slot conversion** — all in KV, unexported `[verify: export from admin/KV]`.
- **Consultation→order conversion** and **studio→consultation conversion** — the funnel efficiency that determines CAC `[verify: uninstrumented, Phase 02 §12]`.
- **Founder fulfilment capacity** (orders/month before quality breaks) — the true near-term revenue ceiling (Phase 03 §3 SOM).

---

## 1. Executive Summary

R&J's business model today is a **premium made-to-order service**: a customer previews (web Studio), pays a **KES 2,500 consultation** (credited), and commissions custom panels at **KSh 4,500–10,000 each** with delivery and installation included, paid via M-Pesa on a **deposit-now / balance-on-fulfilment** basis. A **founding pre-sale** (KSh 1,000 deposit, 20 slots, 5–12% launch-discount tiers) is layered on top to gather early commitments before public launch.

**The model's strength** is that vertical integration lets R&J capture the *whole* margin (design + make + deliver + install) instead of one thin link — and charge for *certainty*, an axis where it escapes the curtain price war (Phase 01 §6; Phase 02 §7).

**The model's three honest problems:**
1. **Margin is unproven and likely thinner than it looks.** A small-ticket custom item carrying free consultation, delivery, and installation can see most of its gross margin consumed by skilled labour and logistics — and R&J has **not measured it** (§4).
2. **The pricing architecture is currently incoherent** — a ~2× homepage/catalog contradiction on an *undefined unit* (§0.2.1–2). You cannot run, quote, or defend a business on that; it is the first fix.
3. **Revenue is capacity-bound, not demand-bound** (Phase 03 §3 SOM). Two founders in every order caps the service model at single-digit-millions KSh/year until fulfilment is productised. **This is the model's ceiling, and the whole scaling question.**

**The strategic conclusion (consistent with Phase 03 §9):** the service business is a **healthy cash engine and a trust-manufacturing machine — not, by itself, a scalable one.** The business model's job is therefore two-layered: (a) make the *service* margin real, defensible, and premium in H1; (b) use the trust it earns to unlock the **higher-margin, higher-frequency, higher-AOV** models in H2/H3 — basket expansion (own the room), B2B (repeat high-AOV buyers), and ultimately the platform (software margins). **The money today is in service; the money at scale is in what the service earns the right to sell next.**

---

## 2. Revenue Model — How R&J Makes Money

**Today (H1) — one line, three components:**
1. **Product margin** — the spread between the customer price of a panel and its landed cost (fabric + making). The core.
2. **Consultation fee (KES 2,500, credited)** — not a profit centre; a **qualification + commitment device** that filters tyre-kickers and funds the pre-sale visit. Its economic role is CAC reduction and intent-proof, not revenue.
3. **Bundled services (delivery + install)** — currently *given away* inside the product price; economically a **cost dressed as a feature** (§4). Could later be a priced line item.

**Revenue-model layers as R&J matures (mapped to Phase 03 horizons):**

| Layer | Model | Margin character | Horizon |
|---|---|---|---|
| Custom curtains | Made-to-order product + service | Service margin (30–45%?) | H1 (now) |
| Room / soft-furnishings expansion | Larger basket, same customer | Same, higher AOV → better $/order | H2 |
| B2B contracts | Volume, recurring, spec'd | Lower % but high volume, low CAC | H3a |
| Certainty-engine platform | SaaS / take-rate on maker GMV | **Software margin (70%+)** | H3b |

**The margin trajectory is the whole point:** R&J starts on *service* margins (capacity-bound, labour-heavy) and the strategy is to climb toward *software/network* margins as trust unlocks each next layer. An investor's interest is in the **slope of that climb**, not the H1 curtain margin.

---

## 3. Pricing Architecture

**Current state: incoherent (must be fixed before anything else in this doc is trustworthy).**
- Catalog: KSh 4,500–10,000, unit variously "panel/pair/window."
- Homepage: KSh 12,000–18,500 for the same items, mostly "per panel."
- These cannot both be true. The catalog (`products.ts`) is the **transactional source of truth** (it feeds cart/checkout), so treat it as the real price and the homepage as an erroneous inflated display — **and fix the homepage down to match**, not the reverse (raising the real price to match the marketing would be the bait-and-switch made permanent).

**The deeper fix — define the priced unit.** Recommendation: **price per finished window, all-in** (fabric + making + lining + delivery + install), because:
- It matches how the customer actually thinks ("what will *this window* cost me, done?") — the certainty the brand sells (Phase 02 §3).
- It ends the panel/pair/window ambiguity that makes quotes unreliable and margin uncomputable.
- It lets R&J bundle the services it wants to include *without hiding* them — the price is honestly "the finished result," which is exactly the promise (Phase 01 §7 "you will not be surprised").

**Pricing *strategy* (from Phase 02 §7): premium via customer selection, never discount into the price war.**
- Anchor price on **certainty + guaranteed outcome**, not on beating the WhatsApp tailor.
- Keep the **KES 2,500 consultation** — it is a smart trust/qualification/commitment device; credited so it doesn't feel like a toll (Phase 02 §8, Strategy Review §3).
- The **top of the range (Maasai Ember Velvet, KSh 10,000)** exists for the Proud Upgrader (Phase 02 §4) and should not be dumbed down.

**The founding discount tiers (5–12%)** are a *launch* pricing mechanic (§5), not the standing architecture. They must expire honestly at `LAUNCH_DATE` (`campaign.ts` even warns against a resetting fake deadline — keep that discipline; it is Principle 2 in code).

---

## 4. Unit Economics

> Illustrative model — every figure grade-C, to be replaced by real KV data (§11). The point is the *shape* of the economics and the *squeeze* to watch, not the exact numbers.

**Per-order (one window, ~2 panels) worked example** `[ASSUMPTION — all lines]`:

| Line | Amount (KSh) | Note |
|---|---:|---|
| Customer price (2 panels, all-in) | 16,000 | pending unit definition (§3) |
| — Fabric + materials | (5,500) | landed cost |
| — Making / workshop labour | (3,000) | cut, sew, line |
| — Delivery | (1,000) | Nairobi/Central |
| — Installation labour | (1,500) | skilled, on-site |
| — Consultation credit absorbed | (2,500) | given back against order |
| **Gross margin (pre-founder-labour)** | **~2,500 (16%)** | **the squeeze** |
| Add back: consultation as CAC not COGS | +2,500 | if viewed as acquisition spend |
| **Contribution (consultation as CAC)** | **~5,000 (31%)** | more flattering framing |

**What the model reveals (the honest finding):**
- **The bundled services are the margin story.** Free consultation-credit + delivery + install on a mid-ticket custom item can compress gross margin toward the mid-teens % if not priced deliberately. Whether R&J is a *30–45% gross* business or a *~15% gross* business depends entirely on how these are accounted and priced — and it is **currently unmeasured.** This is the single most important number to go get (§11).
- **Founder labour is uncosted.** The consultation, measurement, and often the install are done *by the founders*, whose time is free in the P&L and scarce in reality. A true unit economic must impute founder labour — and when it does, the "margin" may be substantially the founders working for below-market rates (the scalability tax, §7).
- **The lever is AOV, not price-per-panel.** Because fixed-ish service costs (a visit, a delivery, an install trip) amortise across a larger order, **a whole-room order is dramatically more profitable per trip than a single-window one.** This is the unit-economics case for (a) selling rooms not panels now, and (b) the H2 basket-expansion strategy (Phase 03 §9). *The model wants bigger baskets, and the business model should be engineered to produce them.*

**CAC & LTV framing:**
- **CAC** is hypothesised low if acquisition is referral-led (Phase 02 §10) — the consultation fee even offsets it. Paid acquisition of cold strangers would invert this.
- **LTV is the model's weakness:** a ~once-a-decade purchase (Phase 03 §6) means low repeat unless the basket expands (H2) or the customer is B2B (H3a). **Without line expansion, R&J is on a permanent new-customer treadmill** (Strategy Review §6.8). LTV is therefore not a curtain metric — it is the *reason* H2 exists.

---

## 5. The Founding Pre-Sale as a Business Instrument

**What it is (from code):** KSh 1,000 deposit → 1 of 20 founding slots → locks a founding price; tiers KSh 100–1,000 unlock 5–12% launch discounts; fully credited to the eventual order; closes 31 Aug 2026.

**What it does well:**
- Generates a little **working capital** and a lot of **early commitment signal** ahead of public launch.
- Creates honest **scarcity** (20 slots) and a real **deadline** (with an explicit anti-fake-deadline warning in `campaign.ts` — good).
- Gives investors a *narrative* of pre-launch traction (the funding-shortlist doc leans on this).

**What it does NOT do — and must stop pretending to (Phase 01 §0.2.3):**
- A **fully refundable/creditable KSh 100–1,000 deposit measures curiosity, not purchase intent.** "Spots taken" is an **anti-metric** (Phase 01 §12). Treating a full waitlist as validated demand is the exact self-deception the Foundation forbids.

**How to make it a real business instrument (Strategy Review Rec. 7):**
1. **Track the metric that matters:** *deposit → real quote → paid order* conversion. That ratio, not "slots filled," is the demand proof.
2. **Introduce a non-refundable component** (e.g. a small non-refundable *design credit* on top of the refundable deposit) so at least part of the signal is skin-in-the-game.
3. **Report intent, not vanity:** "X of Y depositors converted to a paid quote at KSh Z AOV" — a number an investor can underwrite.

**Consistency fix:** the founding copy and `referralMessage` still say *"see your curtains in your actual room"* — the same promise the product doesn't yet keep (Phase 02 §0.2.1). A pre-sale that sells an unshipped capability is selling the wrong thing; align the pledge to what ships (the honest web Studio) per Principle 2.

---

## 6. Cost Structure

**Variable (per order):** fabric + materials, making labour, delivery, installation labour, M-Pesa fees, consultation credit. **This is where the margin squeeze lives (§4).**

**Fixed / semi-fixed:** workshop, tooling, hosting/domain (`Vercel`), the founders' own time (currently uncosted), any marketing spend.

**Structural cost insight:** R&J's cost base is **labour-and-logistics heavy and location-bound** — the opposite of a software company's near-zero marginal cost. This is *why* the H1 model is capacity-bound and *why* the venture case routes through models with better marginal economics (B2B volume, then platform software margin — §2, Phase 03 §9). Every horizon shift is, economically, a **move toward lower marginal cost.**

---

## 7. Capacity & the Economics of a Founder-Bound Service

**The ceiling, stated plainly:** revenue ≈ (orders the founders can personally fulfil per month) × AOV. With two people measuring, making, and installing, that is a **small number** (Phase 03 §3 SOM ≈ 180–240 orders/yr → single-digit-millions KSh/yr). **The business is bounded by hands, not by demand.**

**The tension with the brand:** the premium *is* "measured, made, and installed by the two people whose name is on the door" (About Chapter 04). That intimacy is the moat — and the ceiling. **Productising delivery risks diluting the exact intimacy that justifies the price** (Strategy Review §6.4).

**The resolution (the business-model bet):** separate what *must* be founder-delivered (the trust-defining moments — the design judgment, the promise-kept guarantee) from what *can* be systematised (measurement, making, install execution by trained staff to the R&J standard). Automate quote→order→production-ticket→install-scheduling (Strategy Review §7 "automation") so a **trained installer executes the R&J standard** while the founders own the taste and the guarantee. *This is the difference between a two-person atelier forever and a scalable brand* — and it is the core brief for Phase 08 (Operations).

---

## 8. Path to Venture Economics

Tying the model to Phase 03 §9's three doors, by *economic character*:

- **H2 — Own the room:** the highest-leverage near-term move because it **multiplies AOV against the same fixed service cost per visit** (§4) — better margin per trip *and* better LTV *and* a 5–50× larger category (Phase 03 §3). **The cleanest economic upgrade; do this first after H1 trust is proven.**
- **H3a — B2B:** trades % margin for **volume, recurrence, and low CAC** — the antidote to once-a-decade LTV. One developer/hospitality contract can equal dozens of homeowner orders. **Run one experiment now** to test the economics (Strategy Review Rec. 8).
- **H3b — Platform:** the only door with **software margins (70%+) and near-zero marginal cost** — i.e. the only genuinely venture-scale *economic* model. Take-rate or SaaS on other makers' GMV. Requires the identity decision + Principle-3 amendment (Phase 01 §14). **Do not open on assumption; open on proof that the certainty engine works for R&J first.**

**The one-sentence business-model thesis for investors:**
> *R&J earns a defensible premium service margin today by selling certainty in the highest-regret home purchase, and converts the trust that margin buys into progressively higher-margin, lower-marginal-cost models — bigger baskets, then B2B volume, then software. The investable question is the slope of that margin climb, and it is gated on proving H1 unit economics and trust metrics first.*

---

## 9. Business Model Risks
1. **Unknown/thin true margin (HIGHEST).** If gross margin after all bundled services is mid-teens %, the H1 business is fragile and every expansion is underfunded. *Mitigation: measure it now (§11) — this is the #1 finance action.*
2. **Undefined pricing unit + live price contradiction.** Can't quote, can't defend, reads as dishonest. *Mitigation: §3 fix immediately.*
3. **Capacity ceiling.** Demand can't be served past founder hours. *Mitigation: productise fulfilment (§7 → Phase 08).*
4. **Once-a-decade LTV.** Permanent new-customer treadmill without expansion. *Mitigation: H2 basket expansion is the LTV fix, not a nice-to-have.*
5. **Deposit ≠ demand.** Building the plan on refundable-deposit vanity. *Mitigation: §5 intent instrumentation.*
6. **Founder-labour subsidy hides losses.** A "profitable" order that only pencils because founders work free. *Mitigation: impute founder labour in the model (§4).*

---

## 10. Applying the Decision Framework to Business-Model Bets
- **Bet: "Fix homepage price down to catalog; define per-window unit."** All Four Gates ✅ (Trust Gate especially) → **do immediately**, two-way door.
- **Bet: "Keep the KES 2,500 credited consultation."** ✅ all gates → **keep.**
- **Bet: "Report 'founding slots taken' as demand to investors."** Trust/Evidence Gates ❌ (anti-metric) → **rejected; report deposit→quote→order instead (§5).**
- **Bet: "Raise real prices to the KSh 12–18.5k homepage level."** Trust Gate ❌ (that's the bait-and-switch made permanent) unless justified by a *defined, richer unit* (per-window all-in) and honest value → **only via §3's unit redefinition, never as a silent hike.**
- **Bet: "Open the platform model (H3b) for revenue now."** One-way door + Principle-3 conflict → **defer to founder-level decision after H1 proof (Phase 01 §14).**

---

## 11. Open Questions & Validation (the real deliverable)
The model above is a scaffold. It becomes trustworthy only when these are filled from **real KV/admin data** (owner: Finance/Simon):
1. **Export order history** from KV (`orders.ts` index) → compute **actual AOV, order count, geography, is_founding mix, repeat rate.**
2. **Cost a real order end-to-end** (fabric receipts, labour hours, delivery, install) → **true gross margin**, with founder labour imputed.
3. **Instrument the funnel** (Phase 02 §12): studio→consultation→order, and **founding deposit→quote→paid order** conversion.
4. **Define the priced unit** (recommend per-window all-in) and re-baseline pricing on it.
5. **Fix the homepage/catalog price contradiction** and confirm one source of truth.

**Exit criterion:** Phase 04 upgrades from "framework (C)" to "validated" when AOV, gross margin, and deposit-conversion are grade-A from real data. Until then, treat all economics here as directional.

---

## Future Revision Notes
- **Blocked on data:** the entire unit-economics section (§4) and AOV/LTV claims are grade-C pending KV export. This is the most data-starved phase after Phase 02 — and the two share the funnel-instrumentation dependency.
- **Contradictions to close:** §0.2.1 (price bug) and §0.2.2 (undefined unit) are *live in product code* and are the highest-priority fixes in the whole program so far, because they corrode trust on contact.
- **Trigger for review:** any pricing change, the first real margin measurement, an H2 launch, or any B2B/platform pricing decision.
- **Dependency handoff:** Phase 05 (Brand) inherits the "premium via certainty, never discount" pricing posture; Phase 08 (Operations) inherits the capacity ceiling + productise-fulfilment brief (§7); Phase 10 (Finance) inherits the entire unit-economics model to populate with real numbers and build the P&L.

---

*End of Phase 04. The business model is a sound premium service today with an unproven margin and a hard capacity ceiling — and a credible, sequenced path to better economics. The next move that matters is not writing the next phase; it is getting the two live pricing defects fixed and the real margin measured. Per the workflow, await founder challenge and approval before Phase 05 (Brand).*
