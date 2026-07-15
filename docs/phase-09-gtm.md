# Phase 09 — Go-To-Market

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (Rose — content/relationships, Simon — funnel/systems) · Review cadence: Monthly through launch, then quarterly

> **Scope discipline.** Phase 02 §10 set the *referral-led thesis* and channel-mix hypothesis; Phase 05 §5 set the *messaging hierarchy*; Phase 03 §8 set *geographic sequencing*; Phase 04 §5 set the *deposit-as-instrument* rule. This phase does not restate any of them. It designs the **GTM engine and the launch motion** — the conversion ladder, the launch sequence, the referral mechanics, the content loop, and the urgency governance — that turn those theses into a repeatable go-to-market. New evidence is read from `campaign.ts`, `FoundingClient.tsx`, `app/api/waitlist/route.ts`, and `whatsapp.ts`.
>
> **Evidence grade: A on the mechanics as built; B on the plan.** The urgency of this phase is real: the public launch date is **31 Aug 2026** (`LAUNCH_DATE`), ~7 weeks out. The launch sequence below is time-boxed against it.

---

## 1. The GTM Engine as Built (new evidence)

R&J already ships a **three-rung acquisition ladder**, though it has never been named or measured as one:

| Rung | Mechanism (code) | Commitment | Job |
|---|---|---|---|
| **Waitlist** | `/api/waitlist` — free "notify me at launch," stored 180 days | None | Capture soft interest not ready to pay |
| **Founding reservation** | `/founding` — KSh 100–1,000 deposit → slot → locks 5–12% tier (`campaign.ts`) | Token | Convert interest into (weak) commitment + working capital |
| **Consultation** | `sendBooking` — KES 2,500, credited | Real intent | The first true purchase signal |

Plus two engine parts already built but **inert** (no incentive, no tracking, no trigger timing):
- **Referral share:** `whatsappShareUrl` + `referralMessage` — a pre-filled "tell a friend" WhatsApp link.
- **Urgency levers:** live slot counter ("*X of 20*," "*Only N spots left at this price*"), and a countdown to `LAUNCH_DATE`.

**The finding:** the *components* of a strong GTM engine exist; what is missing is the **motion that connects them** — a launch sequence, a referral loop with a trigger and a tracker, and a content engine to feed the top of the ladder. This phase supplies that motion. *(Also: `referralMessage` still contains the "actual room" overclaim — fold into the honesty pass, Phase 06 step 1.)*

---

## 2. The Conversion Ladder (the GTM operating system)

Each rung gets an explicit **job, conversion action, and metric** — so the funnel Phase 07 §3 will finally store has a *designed* shape, not an accidental one.

1. **Stranger → Waitlist.** Action: capture name + contact + product interest. Metric: waitlist adds/week by source. *The soft top-of-funnel; cheap, honest, no pressure.*
2. **Waitlist → Founding reservation.** Action: convert soft interest to a deposit before launch. Metric: waitlist→deposit %. *The first commitment step.*
3. **Founding/Waitlist → Consultation.** Action: book the KES 2,500 consult. Metric: **deposit→consult %** — the pre-sale's real validation (Phase 04 §5), not "spots taken."
4. **Consultation → Order.** Action: quote → paid order. Metric: **consult→order %** and AOV. *The money moment.*
5. **Order → Referral.** Action: trigger the referral ask at delight (§4). Metric: **Referral Rate** (Phase 01 §12). *The loop that closes back to rung 1.*

**The GTM principle this encodes:** R&J's funnel is a *trust escalator*, not a pressure funnel — each rung asks for slightly more commitment in exchange for slightly more certainty. The whole ladder is designed to move a stranger to an advocate **without a single dishonest step** (Principle 2).

---

## 3. The Launch Motion (time-boxed to 31 Aug 2026)

The founding pre-sale is not the event; it is the *rehearsal*. The launch is where the pre-sale's meaning is tested.

**Phase A — Pre-launch (now → 30 Aug): fill the ladder honestly.**
- Grow waitlist + founding reservations via the content and referral engines (§4–§5) — **not** paid ads onto an un-instrumented, still-VR-claiming funnel (§8).
- Instrument every rung from day one (Phase 07 §3) so launch decisions are data-backed.
- Complete the **honesty pass** (Phase 06 step 1 + the booking/referral copy) *before* any traffic push — you cannot launch a trust brand on an unshipped-VR hero.

**Phase B — Launch (31 Aug): convert commitment to revenue.**
- The founding discount expires **honestly** (`campaign.ts` warns against a resetting deadline — hold that line; a fake deadline is the one urgency move that violates Principle 2).
- **The launch test that matters:** what % of founding depositors and waitlist convert to a *paid consultation/order*? This is the number that tells R&J (and any funder — see `docs/capital/`) whether the pre-sale measured demand or curiosity (Phase 04 §5). Report *that*, never "spots taken."

**Phase C — Post-launch: turn fulfilment into the flywheel.**
- Every delivered order feeds the referral loop (§4) and the content engine (§5). Acquisition cost should *fall* over time as the flywheel spins (Phase 02 §10 "slowly, then all at once").

---

## 4. The Referral Engine (mechanics, not thesis)

Phase 02 §10 said referral is the channel; here is **how it is made to actually fire**. The share link exists but is inert; three additions make it an engine:

1. **Trigger at delight, not at random.** The referral ask fires at the **install handover** — the peak-emotion moment when the customer first sees the finished window (Phase 08 §3 install/handover SOP). A referral asked at the right second converts many times better than a banner.
2. **A two-sided incentive that doesn't cheapen the brand.** Not a discount war (Phase 04 §3). Prefer a *gift that reinforces craft* — e.g. a free premium add-on (tie-backs, a second-window design credit) for both referrer and friend. Certainty and generosity, not price.
3. **Track the chain.** Tag referral source through to order (Phase 07 §3 event) so **Referral Rate becomes measurable** (Phase 01 §12) and the best advocates are known. Fix the `referralMessage` overclaim as part of this.

**The referral content is real homes, not renders.** What a proud owner actually shares is a photo of *their* finished room (§5) — which is also the most honest, most converting asset R&J can produce (Phase 05 §6).

---

## 5. The Content Engine (fulfilment → marketing loop)

**The single highest-leverage, lowest-cost acquisition asset R&J is not systematically capturing: its own finished work.** Every completed install is potential top-of-funnel content — and it is free, honest, differentiating, and referral-ready.

**Decision — a capture-and-publish loop wired into operations:**
- **Capture at QC/handover** (Phase 08 §2/§3): a consistent *before/after* of every job (with customer consent), plus the occasional making/behind-the-scenes and the founders' hands.
- **Publish** on the channels the customer actually uses (Instagram/Facebook for the social job + taste browsing, Phase 02 §3; WhatsApp status for referral reach) — leading with *real Kenyan homes*, per the Phase 05 §6 imagery mandate.
- **This makes marketing a by-product of fulfilment** — a two-person team's only scalable content model. No studio shoots, no ad agency; the work *is* the content.

*The strategic point:* the content engine and the referral engine share the same fuel (real finished homes), and both are fed by doing the operational job well. GTM, for R&J, is mostly **operations done visibly.**

---

## 6. Urgency & Scarcity Governance (new GTM ethics rule)

The founding page uses real scarcity (20 slots) and a real deadline — both legitimate. But urgency is the easiest place for a trust brand to betray itself, so this phase sets the standing rule:
- **Real scarcity and real deadlines: allowed.** 20 slots is a real limit; 31 Aug is a real date. Displaying them honestly is fine and useful.
- **Manufactured urgency: forbidden.** No resetting countdowns, no fake "only 2 left" that isn't true, no invented scarcity. (`campaign.ts` already encodes this discipline — GTM must not undo it.)
- **"Spots taken" is never reported as demand** (Phase 04 §5, Phase 01 §12 anti-metric). Internally and to funders, the demand metric is deposit→consult→order, not slots filled.

---

## 7. The B2B Pilot (concrete experiment)

Phase 02 §4 and the Strategy Review §7 flagged B2B as *possibly a better beachhead*. This phase designs the **single, cheap experiment** to test it (not a pivot):
- **Target:** one **boutique hotel or a property developer/stager** in Nairobi/Central (high-AOV, repeat, lower-CAC — Phase 04 §8).
- **Offer:** dress a show unit / a few rooms to the R&J standard; measure the economics (AOV, margin per trip, repeat potential) against the homeowner baseline.
- **Hypothesis:** one B2B contract ≈ dozens of homeowner orders at better margin-per-trip and far lower CAC.
- **Success criterion:** a signed second engagement (repeat) — the true test of B2B stickiness. **One conversation, one contract, real numbers** — decided at founder level whether to scale (Phase 03 §9 H3a).

---

## 8. Channel Sequencing & CAC Discipline (new governance)

Sequencing, tying prior phases into a spend rule:
- **Organic first (now):** referral (§4) + content (§5) + the existing warm network (Nyeri/founder relationships). Cheap, compounding, honest.
- **Paid only to *accelerate a proven funnel* — and gated.** Do **not** spend on cold acquisition until: (a) the honesty pass is done (Phase 06 step 1 — no paying for traffic to an unshipped-VR hero, Strategy Review §6.2), and (b) the funnel is instrumented (Phase 07 §3 — no buying clicks you can't measure). **These two gates are non-negotiable pre-conditions for the first shilling of ad spend.**
- **When paid opens:** start with retargeting warm waitlist/site visitors (cheapest, highest-intent) before cold prospecting.

---

## 9. GTM Metrics (new — the ladder's scoreboard)
- **Rung conversion rates** (§2): waitlist→deposit, deposit→consult, consult→order — each a managed number.
- **Referral Rate** (§4) — the Phase 01 §12 Tier-1 metric, now with a capture mechanism.
- **Content→lead** — waitlist adds attributable to content, by piece/channel.
- **Blended CAC** — trending *down* if the flywheel works (the health check on the whole thesis).
- **Anti-metrics (rejected):** slots filled, social follower/like counts, Studio plays (Phase 01 §12; Phase 02 §9). Watched, never targeted.

---

---

## Executive Summary (one page)

R&J has unknowingly already built the *components* of a strong go-to-market — a three-rung acquisition ladder (free waitlist → paid founding reservation → KES 2,500 consultation), a WhatsApp referral share, and honest scarcity/countdown levers — but has never connected them into a **motion**, and has never measured any rung. This phase supplies the motion and, critically, does it **without adding a single dishonest step**: the funnel is designed as a *trust escalator*, where each rung asks for slightly more commitment in exchange for slightly more certainty, from stranger all the way to advocate.

The engine has two nearly-free, compounding assets that R&J is not systematically using. First, **referral**: the share link exists but is inert; three additions make it fire — trigger the ask at the **install-handover moment of delight** (not at random), offer a **craft-reinforcing two-sided gift** (never a discount), and **track the chain** so Referral Rate finally becomes measurable. Second, the **content engine**: every finished install is free, honest, differentiating, referral-ready top-of-funnel content — so the decision is a *capture-at-QC-and-publish* loop that makes marketing a **by-product of fulfilment**, the only scalable content model a two-person team has. Both engines run on the same fuel — real finished Kenyan homes, not VR renders (Phase 05 §6) — which means, for R&J, GTM is largely *operations done visibly*.

The clock is real: public launch is **31 Aug 2026**, ~7 weeks out. The launch motion is: **fill the ladder honestly pre-launch** (organic only — no paid traffic onto a still-VR-claiming, un-instrumented funnel), **convert commitment to revenue at launch** with the discount expiring honestly, and **spin the fulfilment flywheel post-launch** so CAC falls over time. The launch's one decisive metric is not "spots taken" but the **deposit/waitlist → paid order** conversion — the number that finally tells R&J and its funders whether the pre-sale measured demand or mere curiosity (Phase 04 §5). Two non-negotiable gates precede any ad spend: the honesty pass done, and the funnel instrumented. Alongside, one cheap, well-scoped **B2B pilot** (a boutique hotel or developer show-unit) tests whether the better beachhead is business, not homeowners — a one-contract experiment, decided at founder level.

## Key Decisions
1. **Name and instrument the three-rung ladder as the GTM operating system** (§2), with a job/action/metric per rung — the funnel Phase 07 §3 stores must be a *designed* shape.
2. **Make referral an engine, not a link:** trigger at install-handover, two-sided craft gift (no discount), track the chain, fix the overclaim in `referralMessage`.
3. **Build the fulfilment→content loop:** capture before/after at QC/handover (with consent), publish real homes — marketing as a by-product of operations.
4. **Run the launch motion to 31 Aug** with the discount expiring honestly; report **deposit→order conversion** as the launch verdict, never "spots taken."
5. **Gate all paid acquisition** behind two pre-conditions: honesty pass complete + funnel instrumented. Organic/referral/content first.
6. **Run one scoped B2B pilot** (hotel/developer show-unit) with "signed repeat engagement" as the success test.

## Dependencies on Previous Phases
- **Phase 02 §10** — referral-led thesis and channel mix; this phase builds the firing mechanism, doesn't restate the thesis.
- **Phase 05 §5–§6** — messaging hierarchy and real-homes-not-VR imagery are the content engine's editorial rules.
- **Phase 06 step 1** — the honesty pass is a hard pre-condition for launch traffic; `referralMessage` and booking copy are in its scope.
- **Phase 07 §3** — every rung metric, referral chain, and content-attribution needs the durable event store; GTM is its largest customer.
- **Phase 08 §2–§3** — the referral ask and content capture are wired into the QC/install-handover SOPs; GTM literally runs on the ops moments.
- **Phase 04 §5 & §8** — deposit-as-instrument (launch metric) and B2B economics (pilot).
- **`docs/capital/`** — the deposit→order conversion is the traction number funders will underwrite.

## Open Questions
- **Actual channel mix** — which rung-1 source (referral, Instagram, WhatsApp, warm network) actually produces converting leads? Unknown until instrumented; confirm in the first launch cohort.
- **Referral incentive calibration** — what craft-gift maximises sharing without eroding premium perception? A/B once volume allows.
- **Is 31 Aug the right launch date** given the honesty pass + instrumentation must land first? If they can't, a short, *honest* extension beats launching on a dishonest hero — but the deadline must not become a serial reset (§6).
- **B2B pilot target selection** — which single account best tests the hypothesis with least effort?
- **Content cadence a two-person team can actually sustain** without stealing fulfilment time — find the minimum viable rhythm.

---

*End of Phase 09. R&J already built the parts of a trust-escalator funnel and a referral loop; the work is to connect them, capture the real homes it produces, and let good operations become visible marketing — then convert honestly at launch and measure whether the pre-sale meant anything. Per the workflow, await founder challenge and approval before Phase 10 (Finance).*
