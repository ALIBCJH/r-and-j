# Phase 08 — Operations

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Rose Kabathi (craft/QC) & Simon Juma (systems) · Review cadence: Monthly until the first trained hire, then quarterly

> **Scope discipline.** Phase 04 §7 established *that* fulfilment is the capacity ceiling and *why* productising it matters; this phase does not re-argue that. It specifies the **operating model itself** — the fulfilment pipeline as built, the quality gate that is missing, the "R&J standard" as explicit procedure, and the sequence for handing work off a founder without diluting trust. New evidence is read from `orders.ts`, `AdminClient.tsx`, `admin.ts`, `whatsapp.ts`, and `sendBooking.ts`.
>
> **Evidence grade: A on the system audit; C on the physical process** (production times, sourcing, QC rework are in the founders' heads / unexported KV, not the repo — flagged, not invented).

---

## 1. The Operating Model as Built (new evidence)

**The fulfilment pipeline is already a five-state machine** (`orders.ts` `FULFILLMENT_FLOW`, mirrored in `AdminClient.tsx`):

`pending_payment → confirmed → in_production → ready → delivered`

Driven from the **admin console** (`/admin`) — a password-gated (12h signed-cookie, constant-time check — `admin.ts`) dashboard that lists orders, shows totals (backers, collected, pending), and advances each order's status. **This is R&J's entire operations system today**, and for a two-person team it is correctly weighted.

**Comms & booking layer:**
- **WhatsApp** (`+254 781 830 101`, `whatsapp.ts`) is the primary customer channel and the manual confirmation rail — the booking email instructs *"Confirm slot with client via WhatsApp or email within 24 hours."*
- **Consultation booking** (`sendBooking.ts`): the customer requests a date/time, gets a confirmation email (KES 2,500 deposit payable at arrival, credited to order), and a **human manually confirms** within 24h. There is **no calendar, slot-capacity, or scheduling system** — confirmation is founder judgment over WhatsApp.

**Two defects visible in the ops layer (new):**
1. **The pipeline is a *tracker*, not an *execution system*.** The state machine records *which* stage an order is in; it does **not** orchestrate the physical work inside each stage (measure, cut, sew, line, QC, schedule install, route). All of that lives in the founders' heads. The distance between "status tracker" and "operations system" *is* the productisation work Phase 04 §7 assigned here.
2. **The VR overclaim has reached transactional operations.** `sendBooking.ts` sends *"New VR Studio Booking"* / *"Your VR Studio session is confirmed."* The unshipped-VR problem (Phase 05 §0.2.1, Phase 06 §0.2.1) is not only in marketing — it is in the **operational emails a paying, booked customer receives**, which is the worst place for it (a booked customer will arrive expecting VR). **Fold this into the honesty pass (Phase 06 step 1) — it is an ops fix, not just copy.**

---

## 2. The Missing Quality Gate (the phase's central operational finding)

**The state machine steps `in_production → ready → delivered` with no explicit quality checkpoint** — yet the company's single most important metric is the **Promise-Kept Rate** (Phase 01 §12) and its brand promise is literally *"not right → not finished"* (Phase 05 §4, `ValuesSection` "We Make It Last"). **The operational embodiment of the entire company thesis is not in the operating system.**

**Decision — insert a QC gate as a first-class state.** Add an explicit `qc` (or `quality_check`) step between `in_production` and `ready`, gated on a **QC checklist** that operationalises the promise:
- Measurements match the signed quote (the single biggest custom-order error — Strategy Review §7).
- Fabric, colour, lining, header, hardware match what the customer previewed/agreed (**this is the Promise-Kept check** — it directly measures the Phase 06 §8 "preview-vs-delivered match").
- Finish quality: hems, seams, drop, symmetry.
- **Sign-off is Rose's** (or, later, a trained maker against her checklist) — a named accountable human, per the brand's "name on the door."

**Why this matters beyond quality:** the QC gate is also the **data capture point** for the Promise-Kept Rate (Phase 07 §3 event store). A structured pass/fail/rework outcome at QC is the metric. **No QC state → the company's #1 number can never be measured.** This ties the operational fix directly to the Phase 07 event-store decision.

---

## 3. The "R&J Standard" — Making the Tacit Explicit

**The core operational asset R&J does not yet have written down is its own standard.** Today the standard *is* Rose and Juma. To ever hand work off (the Phase 04 §7 brief) — or to open the H3b platform, which would sell *the standard* to other makers (Phase 03 §9) — the standard must become **explicit, teachable SOPs.** This is the phase's principal build.

**The SOP set to author (in priority order):**
1. **Measurement SOP** — how to measure a window to R&J tolerance; the checklist a *trained installer* follows so the founders needn't attend every measure. *(Highest leverage — measurement is both the top error source and a top founder-time sink.)*
2. **Making SOP** — cut/sew/line/header/hardware spec per product; the definition of "made to standard."
3. **QC SOP** — the §2 checklist.
4. **Install & handover SOP** — how a curtain is hung and how the customer is walked through the result (the final trust moment → referral ask, Phase 02 §10).
5. **Consultation SOP** — what Rose does in a consult, so the design judgment can eventually be partially trained/assisted (never fully replaced — Belief 7).

**The productisation principle (operational form of Phase 04 §7 — new, not a repeat):**
> **Separate the trust-defining acts from the standard-executing acts.** *Trust-defining* (design judgment, the final guarantee, the QC sign-off) stays founder-owned — it is the moat. *Standard-executing* (measuring, making, installing to SOP) is delegated to trained staff the moment the SOPs exist. **The SOP is the unit of delegation; write it once, delegate forever.** This is precisely how a two-person atelier becomes a brand without becoming a factory.

---

## 4. Supply Chain & Sourcing (the operational unknown)

Analogous to the margin unknown in Phase 04, the **sourcing and production process is undocumented in anything this program can see** and must be captured:
- **Fabric procurement** — suppliers, lead times, minimum orders, price volatility, FX exposure on imported textiles, the reliability of the "hand-woven in central Kenya" East African Series (`products.ts`) supply.
- **Workshop** — in-house vs outsourced making; capacity in panels/week; the true production lead time per order.
- **Inventory policy** — made-to-order means near-zero finished stock (good for cash, Phase 04), but implies **fabric** inventory or reliable just-in-time sourcing; which is it?

**Decision:** capture a one-page **sourcing & lead-time map** (supplier, item, lead time, cost, risk) as a Phase 10 (Finance) input — it is the missing half of the unit-economics model (Phase 04 §4) and a supply-risk input to Phase 11.

---

## 5. Scheduling & Capacity Management (the layer that breaks first)

Phase 04 §7 quantified the *ceiling*; the **operational bottleneck that hits before the ceiling is scheduling.** Manual 24h WhatsApp confirmation (§1) works at low volume and fails silently as bookings cluster:
- No visibility of **founder availability** → double-booked consults/installs.
- No **install routing** → wasted travel (a real cost on a KSh-thin margin, Phase 04 §4 "amortise the trip").
- No **capacity signal** → the founders can't see when they're full, so they either over-commit (breaking "when we say a slot, we keep it") or under-utilise.

**Decision — introduce lightweight capacity management before headcount.** Not a heavy system (dependency-minimalism, Phase 07 §1): a shared founder calendar with **defined weekly consult/install slots**, and a booking flow that offers only **open** slots. This protects the "we keep the slot" promise (Phase 05 §8) operationally and produces the utilisation data Finance needs. *Batch installs by geography* to defend the per-trip margin.

---

## 6. Operations Metrics (new — Tier-2 operational, feeding Phase 01 §12)

These are the *operational* leading indicators of the trust metrics; none exist today (they require the Phase 07 event store):
- **QC pass-rate (first-time-right %)** — the operational Promise-Kept signal; target → high and rising.
- **Rework/Remediation rate** — orders needing redo/goodwill; the Regret-Rate's operational source (Phase 01 §12); target → 0.
- **On-time install rate** — "when we say a slot, we keep it," measured. The operational honesty metric.
- **Order lead time** (confirmed → delivered) — the promise you can make customers; also a capacity read.
- **Founder-touch ratio** — % of an order's steps that *required* a founder. **This is the productisation scoreboard**: it should fall over time as SOPs absorb standard-executing work, while staying 100% on the trust-defining acts (§3).

---

## 7. Operations Risks (new, ops-specific)
1. **Quality escapes with no QC gate (HIGHEST).** A single "it doesn't match what I previewed" detonates the Promise-Kept brand (Phase 05 §9). *Mitigation: §2 QC state + checklist.*
2. **Scheduling collapse under clustering (§5).** Breaks the "we keep the slot" promise before capacity is even reached. *Mitigation: §5 slot system.*
3. **Founder as single point of failure in every order** (bus factor, Strategy Review §6.9, operational form). *Mitigation: §3 SOPs → delegation.*
4. **Supply shock** (fabric price/FX/lead-time). *Mitigation: §4 sourcing map + a second supplier per key fabric.*
5. **VR expectation set at booking (§1).** A booked customer arrives expecting VR. *Mitigation: honesty pass into `sendBooking.ts`.*

---

---

## Executive Summary (one page)

R&J's operations are **correctly lightweight but incomplete in exactly the place the whole company is staked.** The fulfilment pipeline is a clean five-state machine (`pending_payment → confirmed → in_production → ready → delivered`) driven from a well-built, appropriately minimal admin console, with WhatsApp as the human confirmation rail. For two founders, this is the right weight. But it is a **status tracker, not an execution system** — it records which stage an order is in without orchestrating the physical work inside each stage, all of which lives tacitly in the founders' heads.

The central operational finding is a **missing quality gate**: the state machine steps from production to delivered with no explicit QC checkpoint, even though the Promise-Kept Rate is the company's #1 metric (Phase 01 §12) and "not right → not finished" is its brand promise (Phase 05). The operational embodiment of the entire thesis is absent from the operating system — and, because QC is also the natural capture point for the Promise-Kept signal, its absence means that number can never be measured. Inserting an explicit `qc` state with Rose's sign-off against a checklist is the phase's first decision, and it ties directly to the Phase 07 event store.

The phase's principal *build* is making the **"R&J standard" explicit as SOPs** (measurement, making, QC, install/handover, consultation). Today the standard is the two founders; SOPs are the unit of delegation that lets a two-person atelier become a brand without becoming a factory — by separating **trust-defining acts** (design, guarantee, QC sign-off — kept founder-owned) from **standard-executing acts** (measure, make, install — delegated the moment the SOP exists). The operational scoreboard for this is a falling **founder-touch ratio** on standard work, held at 100% on trust work.

Two unknowns must be captured to complete the manual: the **sourcing & lead-time map** (§4 — the missing half of Phase 04's unit economics) and **lightweight scheduling/capacity management** (§5 — the bottleneck that breaks *before* the founder-capacity ceiling, silently, by clustering). Neither needs a heavy system; both fit the Phase 07 minimalism doctrine. Finally, the VR overclaim has leaked into the **booking emails** a paying customer receives — the worst possible place — and must be fixed as part of operations, not just marketing.

## Key Decisions
1. **Insert an explicit `qc` state** between `in_production` and `ready`, gated on a Promise-Kept checklist with a named human sign-off (Rose). It is both the quality gate and the metric-capture point.
2. **Author the "R&J standard" as five SOPs** (measurement → making → QC → install/handover → consultation), in that priority order; measurement first (top error + top founder-time sink).
3. **Adopt the productisation principle:** delegate standard-executing acts via SOP; keep trust-defining acts founder-owned. Track a **founder-touch ratio** as the scale scoreboard.
4. **Introduce lightweight, minimalism-consistent scheduling** (defined weekly slots, offer-only-open-slots booking, geographic install batching) *before* hiring.
5. **Capture a one-page sourcing & lead-time map** as a Phase 10 input and Phase 11 risk input.
6. **Fix the VR wording in `sendBooking.ts`** as part of the honesty pass.

## Dependencies on Previous Phases
- **Phase 04 §7** — the capacity-ceiling and productise-fulfilment brief; this phase supplies the *how* (SOPs, founder-touch ratio) without repeating the economics.
- **Phase 01 §12 & Phase 05 §4** — Promise-Kept Rate and "not right → not finished" are what the §2 QC gate operationalises.
- **Phase 06 §8** — the "preview-vs-delivered match" is measured *at* the QC gate; and the honesty pass (Phase 06 step 1) now includes the booking emails.
- **Phase 07 §3** — the QC/ops metrics have no home without the durable event store; ops instrumentation is a customer of that decision.
- **Phase 03 §9** — the explicit SOP/standard is the asset an H3b platform would eventually productise for other makers.

## Open Questions
- **True production lead time and workshop capacity** (panels/week, in-house vs outsourced) — grade-C; capture in the §4 sourcing map.
- **Sourcing resilience** — single vs multi-supplier per key fabric; FX exposure on imported textiles.
- **Who is the first hire, and for which SOP?** (Likely a trained measurer/installer — the highest founder-time sink.) Sequencing gated on H1 volume and margin (Phase 04 §11).
- **What QC rework rate is R&J actually running today?** Unknown until measured — the first number to pull once the event store and QC state exist.
- **Does the consultation SOP admit partial automation** (e.g. the Phase 06 photo→recommendation feeding Rose's consult) without breaking the human-trust core (Belief 7)?

---

*End of Phase 08. The operating system is well-built but stops one state short of the company's own promise; write the standard down, put quality in the machine, and the founders can finally begin to step out of every order without stepping away from the trust. Per the workflow, await founder challenge and approval before Phase 09 (Go-To-Market).*
