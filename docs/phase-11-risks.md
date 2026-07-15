# Phase 11 — Risks

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (jointly) · Review cadence: Monthly risk review; full re-score quarterly

> **Scope discipline — this is a synthesis phase, not a repetition.** Every prior phase (§9-ish) carried its own local risk list. This phase does **not** restate them. It does four new things: (1) **consolidates** the scattered symptoms into a small set of *root* risks; (2) surfaces the **cross-cutting risks no single phase owns** (correlation/cascade, founder concentration, sequencing, compliance, platform dependency); (3) applies one **scoring and correlation framework**; and (4) installs **risk governance** — a pre-mortem, early-warning indicators, kill-criteria, and owners. Underlying detail stays in the source phase and is referenced, not repeated.
>
> **Evidence grade: B (synthesis of A/C findings).** The risks are drawn from the audited phases; their *ranking and correlation* are judgment.

---

## 1. Scoring Framework (new)

Each root risk is scored on three axes (1–5), because the usual likelihood×impact misses the axis that matters most for a small team: *can you see it coming?*
- **Likelihood (L)** — probability within 12 months.
- **Impact (I)** — severity if it lands (5 = existential).
- **Velocity/Detectability (V)** — how fast it hits and how blind R&J is to it (5 = sudden + currently invisible). *A high-V risk is dangerous even at moderate L×I, because there's no time to react.*

**Priority = L × I × V**, but the framework's real output is the **§3 correlation view**, because R&J's risks are not independent — they compound.

---

## 2. The Root-Risk Register (consolidated, deduplicated)

The dozens of per-phase risks collapse into **nine roots.** Symptoms are cited to their phase; not re-explained.

| # | Root risk | Rolls up (source phases) | L | I | V | Priority |
|---|---|---|---|---|---|---|
| **R1** | **Trust-breach cascade** — the "honesty cluster": unshipped-VR claim (P05, P06, P08 booking emails), "actual room" over-promise (P02, P06), price contradiction (P04, P10/G6) | P02·P04·P05·P06·P08 | 4 | 5 | 4 | **80** |
| **R2** | **Founder concentration** — brand, design, QC, ops, finance all founder-bound; 2-person bus factor; partnership/health/continuity | P05·P08·P10 + new | 3 | 5 | 4 | **60** |
| **R3** | **Flying blind** — no instrumentation → can't measure margin, demand, promise-kept, funnel; *makes every other risk undetectable* | P02·P04·P06·P07·P10 | 5 | 4 | 5 | **100** |
| **R4** | **Unvalidated demand** — WTP unproven (vitamin-not-painkiller), refundable deposit ≠ intent | P02·P04·P09 | 3 | 4 | 3 | 36 |
| **R5** | **Capacity ceiling + unknown margin** — H1 may not pay a founder wage; scale bounded by founder hands | P04·P08·P10 | 3 | 4 | 3 | 36 |
| **R6** | **Self-inflicted sequencing** (new) — doing things in the wrong order (paid traffic before honesty/instrumentation; equity before validation; scale before SOPs) | cross-cutting | 3 | 4 | 3 | 36 |
| **R7** | **Whitespace land-grab** — a funded entrant brands "trusted made-to-order" first | P03·P05 | 2 | 4 | 2 | 16 |
| **R8** | **External / structural** (new consolidation) — imported-fabric FX, middle-class fragility, platform dependency (Vercel/M-Pesa/Resend), supply shock | P03·P07·P08 | 3 | 3 | 3 | 27 |
| **R9** | **Compliance & legal** (new consolidation) — registration/KRA/MSEA (Capital G4), consumer-protection on refund/deposit promises, customer-photo **data-privacy (Kenya DPA 2019)**, "Kickstarter" trademark | Capital G4 · P05 · P07 | 3 | 3 | 3 | 27 |

**The two that dominate: R3 (flying blind, 100) and R1 (trust cascade, 80).** Everything else is secondary until these two are addressed — and, crucially, they are the two that are **cheapest to fix** (an event store; an honesty pass).

---

## 3. Correlation & Cascade (the new insight this phase exists for)

R&J's risks are **dangerously correlated** — a property invisible when each phase lists its own. Two cascade chains matter:

**Cascade A — the trust detonation (R1 → everything).**
In a *referral-driven* market (Phase 02 §10, Phase 09 §4), trust is both the asset and the **contagion vector**. A single trigger — one customer discovering the "VR" doesn't exist, or that the delivered curtain doesn't match the "actual room" preview, or spotting the 2× price gap — does not stay local. It propagates through the *same referral network* that is the entire growth engine, and it hits a company that **cannot detect it happening** (R3) because nothing is instrumented. *One exposed overclaim can turn the growth flywheel backwards.* This is why R1's velocity is high and why it is existential despite being "just copy."

**Cascade B — the blindness multiplier (R3 amplifies all).**
R3 is scored highest not because it is the worst *outcome* but because it **removes R&J's ability to see any other risk coming.** Unvalidated demand (R4), unknown margin (R5), a rising rework rate (Phase 08), a trust breach (R1) — all are currently *undetectable*. R3 converts every other risk from "manageable with warning" to "discovered too late." **Fixing R3 is therefore leverage on the entire register, not just on itself.**

**The keystone mitigation (new framing):** two cheap moves neutralise most of the compounded danger —
1. **The honesty pass** (one sweep over homepage/About/founding/`referralMessage`/`sendBooking` — Phase 06 step 1) defuses R1 at the source.
2. **The event store** (Phase 07 §3) + **monthly close** (Phase 10 §6) lift the blindness (R3), making R4/R5/R8 detectable.
*Two low-cost actions retire or de-fang the two highest-priority root risks and half the register.* No other pair of actions comes close on ROI.

---

## 4. Founder Concentration — the Master Structural Risk (R2, new treatment)

No single prior phase owns this because it is *everywhere*: the brand **is** Rose & Juma (Phase 05 §9), QC and design judgment are founder-only (Phase 08 §2–§3), the financial model runs in Simon's head (Phase 10 §1). Beyond the usual "bus factor," three under-examined facets:
- **Partnership fracture.** A two-founder company where "R&J" literally means both names has no documented answer to a founder split. **Decision: a founders' agreement** (equity split, vesting, roles, decision rights, exit/buyout, IP assignment) — before any capital, and independent of it (Capital Brain lists "equity floor" and "dilution appetite" as blocking decisions; this is their legal substrate).
- **Health / single-point availability.** Every order needs a founder now (Phase 08 §6 founder-touch ratio). *Mitigation is already in the plan* — SOPs (Phase 08 §3) and brand-in-the-standard (Phase 05 §9) — but Phase 11 elevates it from "ops nicety" to "risk mitigation with a deadline."
- **Knowledge concentration.** The model, the supplier relationships, the admin credentials ([[admin-dashboard-credentials]]) — document and share across both founders (no single-person secrets).

---

## 5. Pre-Mortem — Kill Criteria & "What Would Prove Us Wrong" (new)

Phase 02 §13 asked "what changes if we're wrong" about the *customer*; this phase generalises it to the *company*. **Imagine it's 2028 and R&J failed — the three most likely obituaries:**
1. **"They were never a painkiller."** Interviews/launch show WTP is vitamin-grade even for the Burned segment (R4). *Kill/pivot signal: deposit→order conversion stays low and price sensitivity high after launch.* → pivot wedge (B2B, Phase 09 §7) or accept a smaller lifestyle business.
2. **"They couldn't get out of their own hands."** Demand existed but the founders never productised; growth flatlined at two people's capacity (R2·R5). *Signal: founder-touch ratio doesn't fall 12 months post-SOP.* → hard stop-and-fix on delegation before more marketing.
3. **"They broke their own trust."** An overclaim was exposed, or deliveries stopped matching previews, and the referral engine reversed (R1). *Signal: first Promise-Kept miss + a negative referral event.* → this is the one with no recovery; hence the honesty pass is non-negotiable and first.

**Kill-criteria discipline:** each of the above has a *pre-committed signal*. Writing them down now prevents the sunk-cost self-deception of ignoring them later (Phase 01 §13 tie-breaker: choose what a *trusted* company would choose — including the honesty to quit or pivot).

---

## 6. Early-Warning Indicators (leading signals — the risk dashboard)

Each top risk gets a *leading* indicator R&J can watch *before* the risk lands (all require R3 fixed first — which is the point):
- **R1:** first Promise-Kept miss; any customer question "where's the VR?"; a public complaint mentioning price/expectation.
- **R2:** founder-touch ratio not falling; any week a founder is unavailable and an order stalls.
- **R3:** *the meta-indicator* — "can we answer this in one query?" If a basic question (last month's margin, this week's conversion) still can't be answered, R3 is unmitigated.
- **R4:** deposit→consult and consult→order conversion trending below plan.
- **R5:** breakeven orders/month drifting toward/above capacity (Phase 10 §4).
- **R8:** fabric cost/FX moves; a Vercel/M-Pesa/Resend outage (single-vendor dependency test).
- **R9:** any regulator/consumer contact; a data-subject request on a stored photo.

---

## 7. Risk Governance (new)
- **Owner per risk:** R1 Brand/Product · R2 Founders(legal) · R3 Simon · R4 Rose · R5 Finance · R6 Founders · R7 Brand · R8 Finance/Ops · R9 Founders(compliance).
- **Cadence:** a 30-minute **monthly risk review** — re-check the §6 indicators, re-score any risk that moved, confirm keystone mitigations (R1/R3) are progressing.
- **Trigger reviews (out of cadence):** any Promise-Kept miss, any funding term sheet, any founder-availability event, any regulator contact — force an immediate review.
- **The one rule:** *no growth spend while R1 or R3 is unmitigated* (Phase 09 §8 gate, elevated here to a risk-governance law).

---

---

## Executive Summary (one page)

Read across the whole operating manual, R&J's many local risks collapse into **nine roots**, and two of them dominate — and, tellingly, are the two cheapest to fix. **R3, "flying blind"** (no instrumentation, so margin, demand, promise-kept, and funnel are all unmeasured), scores highest because it doesn't just *hurt* — it removes R&J's ability to *see any other risk coming*, converting every risk from "manageable with warning" to "discovered too late." **R1, the "trust-breach cascade,"** is the honesty cluster — the unshipped-VR claim (now even in booking emails), the "actual room" over-promise, and the 2× price contradiction. It is existential not because copy is precious, but because in a referral-driven market trust is both the asset and the **contagion vector**: one exposed overclaim propagates through the exact network that is the growth engine, and turns the flywheel backwards — at a company too blind (R3) to notice.

The phase's central new insight is **correlation**. These risks are not independent; they compound in two cascades (trust detonation, and blindness-as-multiplier). That reframes mitigation around a **keystone**: two low-cost actions — the **honesty pass** (defuses R1 at the source) and the **event store + monthly close** (lifts the blindness of R3, making R4/R5/R8 detectable) — retire or de-fang the two highest-priority roots and half the register. No other pair of actions matches that ROI, and it explains why every prior phase kept pointing at the same two fixes.

Beyond the cheap wins sit two structural risks that time and money alone won't solve. **R2, founder concentration**, is the master risk no single phase owned: brand, design, QC, ops, and finance are all founder-bound, and a two-founder company literally named for both has no documented answer to a partnership fracture — hence a **founders' agreement** (vesting, roles, buyout, IP) is elevated here to a pre-capital necessity, alongside the already-planned SOP delegation. And **R6, self-inflicted sequencing** — spending on ads before the honesty pass, taking equity before validation, scaling before SOPs — is a risk entirely within the founders' control, governed by one law: *no growth spend while R1 or R3 is unmitigated.*

Finally, the phase installs **governance**: a scored register, per-risk owners, leading-indicator early warnings, a monthly review with out-of-cadence triggers, and a **pre-mortem** with pre-committed kill-criteria — the three most likely 2028 obituaries ("never a painkiller," "couldn't get out of their own hands," "broke their own trust"), each with a signal written down now so sunk-cost can't explain it away later. The net: R&J's risk profile is **frightening on paper but cheap to de-risk in practice** — the two worst risks yield to two inexpensive moves, and the rest is discipline.

## Key Decisions
1. **Adopt the two keystone mitigations as the top corporate priority:** the honesty pass (R1) and the event store + monthly close (R3). These outrank all feature/growth work.
2. **Install the risk-governance law:** *no growth spend while R1 or R3 is unmitigated* (elevates Phase 09 §8 to a standing rule).
3. **Execute a founders' agreement** (equity/vesting/roles/buyout/IP) before any capital — the legal substrate of R2.
4. **Adopt the L×I×V scoring + correlation view** and the nine-root register as the standing risk model; re-score monthly.
5. **Pre-commit the kill-criteria** (§5) in writing, with their leading signals (§6), so pivot/stop decisions are honest.
6. **Assign a named owner and a monthly review** to the register (§7).

## Dependencies on Previous Phases
- **All phases' risk sections** are the raw material; this phase consolidates rather than repeats them.
- **Phase 06 step 1 / Phase 08 §1** — the honesty pass (R1 mitigation) spans marketing *and* transactional ops copy.
- **Phase 07 §3 / Phase 10 §6** — the event store and monthly close are the R3 mitigation and the prerequisite for every §6 early-warning indicator.
- **Phase 05 §9 / Phase 08 §3** — SOP delegation and brand-in-the-standard are the R2 (concentration) mitigations already in the plan; elevated here with a deadline.
- **Phase 09 §8** — the paid-spend gate is the seed of the §7 governance law.
- **Capital Brain 04-readiness-gaps (G4, G6, G8)** — the compliance and honesty gaps are the fundraising face of R9 and R1.

## Open Questions
- **Is prod KV provisioned?** (Phase 07 §5) — an unmitigated R8 *correctness* risk (missed M-Pesa callbacks) hiding in the "external" bucket; verify.
- **Does Kenya's Data Protection Act 2019 apply** to the (currently client-side-only) room photos if compositing ships server-side later? Get a read before Phase 06 step 5.
- **What is R&J's actual insurance/liability exposure** on installation work in customers' homes? Unexamined; a physical-world risk no digital phase surfaced.
- **Refund/deposit consumer-protection posture** — are the founding-deposit refund promises airtight and honoured operationally? (R1 + R9 overlap.)
- **Which single external dependency (Vercel / M-Pesa / Resend) is least substitutable**, and what's the fallback if it fails at launch?

---

*End of Phase 11. R&J's risks look terrifying listed out and turn out to be cheap to tame: the two that matter most yield to the two cheapest fixes, the structural ones are known and have a deadline, and the rest is governance. Fix the blindness, tell the truth, sign the agreement — then the register is just a monthly habit. Per the workflow, await founder challenge and approval before Phase 12 (Roadmap).*
