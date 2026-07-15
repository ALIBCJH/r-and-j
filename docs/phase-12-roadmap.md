# Phase 12 — Roadmap

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (jointly) · Review cadence: Fortnightly through launch, then monthly

> **Scope discipline — this phase sequences; it does not re-decide.** Every decision already lives in its source phase (01–11) and its mitigation in Phase 11. This phase adds the one thing no single phase could: **the order.** It arranges all prior decisions onto a single **critical path**, aligned to the **same M0–M5 milestone ladder** the Capital Brain uses (`docs/capital/00-capital-strategy.md §5`), so the execution roadmap and the capital roadmap are one system. It answers the only question a two-person team actually needs answered each week: *what is the one next thing, and what must we NOT do yet?*
>
> **Anchor date:** public launch is **31 Aug 2026** (~7.5 weeks out). Everything before it is M0–M2; the launch tests M1; M3–M5 follow.

---

## 1. The Sequencing Logic (why order is the whole game)

A small team's failure mode is not picking bad work — it is doing good work **in the wrong order** (Phase 11 R6). Three rules govern the sequence:

1. **Keystone-first.** Phase 11 §3 proved two cheap actions — the **honesty pass** and the **event store + monthly close** — de-risk more than anything else *and* unblock measurement of everything downstream. They come before all feature and growth work. Nothing else is allowed to jump them.
2. **Measure before you scale, validate before you raise.** The capital ladder is deliberately gated (Capital Brain): you cannot honestly claim intent (M1) or economics (M3) you haven't instrumented. So instrumentation precedes the claims that unlock capital.
3. **One priority per stage.** Each milestone has *one* headline objective. Parallel work is allowed only where it doesn't dilute the headline (e.g. M1 intent-instrument and M2 interviews run together because both are cheap and founder-time-separable).

---

## 2. The Critical Path (the spine everything hangs on)

The single dependency chain that determines how fast R&J becomes fundable and scalable:

> **Honesty pass** *(defuse R1)* → **Event store + instrumentation** *(defuse R3)* → **Real per-order margin + AOV** *(M3, closes G3)* → **Breakeven vs capacity** *(Phase 10 §4)* → **the strategic fork:** *survival-problem → fix price/unit/AOV/SOPs; acceleration-problem → open the capital sequence* → **Productised fulfilment (SOPs + first hire)** *(M4)* → **H2 wedge signal** *(M5).*

Everything else (referral engine, content loop, B2B pilot, customer financing, grants) hangs *off* this spine at the point its prerequisite is met. **If a task doesn't advance the spine or attach cleanly to it, it waits.**

---

## 3. The Time-Phased Roadmap (mapped to M0–M5)

Each stage lists its **theme**, the **actions** (referenced to their phase — not re-explained), the **one priority**, what to **NOT do yet**, and the **exit criterion**.

### M0 — Fundable Basics · *now → ~end July (weeks)*
**Theme:** stop the bleeding, make the clock visible, become applyable.
- Honesty pass across homepage/About/`referralMessage`/`sendBooking` (Phase 06 step 1; Phase 08 §1; Phase 11 R1). **← the one priority.**
- Fix the price contradiction + define the per-window unit (Phase 04 §3; Capital G6).
- Stand up the event store + minimal schema (Phase 07 §3; Phase 11 R3).
- State runway = cash ÷ burn (Phase 10 §1); verify prod KV provisioned (Phase 07 §5).
- Compliance: business reg + KRA PIN + MSEA/KCEA/AGPO (Capital G4); data-room v1 (Capital G5).
- **NOT yet:** no paid ads (Phase 09 §8 gate); no equity conversations; no new features beyond the photo→recommendation wiring.
- **Exit:** truthful site, visible runway, instrumentation live, legally applyable. *Unlocks: the ability to apply to anything (Capital M0).*

### M1 — Real Intent · *Aug → launch (1–2 mo)* · **parallel with M2**
**Theme:** convert curiosity into committed demand; run the launch.
- Convert the refundable deposit into an **intent instrument** (Phase 04 §5; Capital G2).
- Wire photo→wall-sample→recommendation (Phase 06 step 2) — ships the honest "your wall" experience.
- Run the **launch motion** to 31 Aug; discount expires honestly; report **deposit→order conversion** (Phase 09 §3). **← the one priority.**
- **NOT yet:** no cold paid acquisition; no hiring; no B2B scale (one pilot conversation only).
- **Exit:** a credible number of *committed* pre-orders and a measured launch-conversion rate. *Unlocks: the "validated demand" line (Capital M1).*

### M2 — Customer Truth · *Aug–Sep (1–2 mo)* · **parallel with M1**
**Theme:** replace hypothesis with evidence.
- 15–20 structured interviews (Phase 02 §12), including the "your room vs example room" killer question. **← the one priority (Rose-owned).**
- **NOT yet:** no roadmap changes based on a single interview; wait for the pattern.
- **Exit:** personas + WTP moved to grade-A/B; the R4/blocker question answered. *Unlocks: interview credibility, sharper grant narratives (Capital M2).*

### M3 — Measured Economics · *post first orders, ~Sep–Nov*
**Theme:** know if you make money.
- Export KV → true **gross margin per order** + AOV (Phase 04 §11; Phase 10 §2; Capital G3).
- Insert the **QC state** (Phase 08 §2) — quality gate *and* Promise-Kept capture.
- Compute **breakeven orders/month vs capacity** (Phase 10 §4) → **take the strategic fork** (§2). **← the one priority.**
- **NOT yet:** no equity raise until this survives its own diligence (Capital doctrine).
- **Exit:** a real P&L, a real breakeven, a Promise-Kept number. *Unlocks: debt/working-capital, diligence-surviving angel talks (Capital M3).*

### M4 — Repeatable Service · *~6–12 mo of orders (2027 H1)*
**Theme:** get out of your own hands.
- Author + adopt the five SOPs; make the **first hire** (a trained measurer/installer) (Phase 08 §3); track founder-touch ratio falling.
- Turn on the **referral engine** + **content loop** + **customer financing** (Phase 09 §4–§5; Phase 10 §5).
- Run the **B2B pilot** to a signed *repeat* (Phase 09 §7). **← the one priority: positive contribution margin without heroics.**
- **NOT yet:** no H2 category launch until trust metrics (Promise-Kept, Referral) are strong.
- **Exit:** pipeline runs without a founder in every step; positive contribution margin. *Unlocks: larger debt, a credible pre-seed story (Capital M4).*

### M5 — H2 Wedge Signal · *~12–24 mo (2027 H2 → 2028)*
**Theme:** prove trust transfers beyond the window.
- Extend the certainty engine to one adjacent category (blinds/sheers/upholstery — Phase 03 §8, Phase 06 step 8); measure attach/own-the-room.
- Only *now* evaluate equity for the H2/H3 ambition, and the H3b platform as a **founder-level, separate-brand** decision (Phase 03 §9; Phase 01 §14).
- **Exit:** first evidence a curtain customer buys a second room. *Unlocks: the venture-scale narrative (Capital M5).*

---

## 4. Now / Next / Later (the founder's single view)

- **NOW (this month, M0):** tell the truth (honesty pass), fix the price, turn on measurement, state the runway, get compliant. *Cheap, unblocking, non-negotiable.*
- **NEXT (to launch + first orders, M1–M3):** convert intent, interview customers, ship the honest preview, then measure real margin and find breakeven. *This is where R&J learns whether it has a business.*
- **LATER (2027+, M4–M5):** productise, hire, spin the flywheel, then extend the wedge — and only then, if the platform ambition is real, raise equity. *Scale is earned here, not before.*

---

## 5. What Each Stage Defers (sequencing discipline, R6)

A roadmap is as much about *not yet* as *now*. The standing deferrals:
- **Paid acquisition** → deferred until honesty pass + instrumentation done (M0 exit).
- **Equity** → deferred until M4+ (economics survive diligence).
- **Hiring** → deferred until SOPs exist and breakeven is known (M3→M4).
- **H2 categories** → deferred until H1 trust metrics are strong (M4→M5).
- **VR / photorealistic compositing / platform** → deferred behind explicit validation gates (Phase 06 §7; Phase 01 §14).
- **Any M4 capital door** while sitting at M0 (Capital §5: "do not spend effort on an M4 door at M0").

---

## 6. Roadmap Governance
- **This document is the single "what now" source.** When phases conflict on priority, the critical path (§2) breaks the tie.
- **Fortnightly through launch, monthly after:** re-confirm the current stage's *one priority*, check exit criteria, re-sequence only if a dependency changed.
- **A stage is not "done" until its exit criterion is met** — resist the temptation to advance on activity rather than outcome (Phase 01 §12 anti-metric spirit).
- **The keystones (M0 honesty pass + event store) may not be leapfrogged** — no downstream stage starts its growth-spend or capital work while they're incomplete (Phase 11 governance law).

---

---

## Executive Summary (one page)

Eleven phases produced a great many correct decisions; this phase supplies the only thing missing — **their order.** For a two-person team, the failure mode is not choosing bad work but doing good work in the wrong sequence, so the roadmap is built on one spine (the **critical path**, §2) and one discipline (**one priority per stage**). The spine is: *honesty pass → event store/instrumentation → real per-order margin & AOV → breakeven vs capacity → a strategic fork → productised fulfilment → H2 wedge signal.* Everything else — referral engine, content loop, B2B pilot, grants, customer financing — hangs off that spine at the point its prerequisite is met. If a task neither advances the spine nor attaches cleanly to it, it waits.

The roadmap is aligned to the **same M0–M5 milestone ladder as the Capital Brain**, so execution and fundraising are one system rather than two competing to-do lists. **M0 (now → end July)** is cheap, unblocking, and non-negotiable: tell the truth (honesty pass across site *and* booking emails), fix the price/unit, turn on measurement, state the runway, get compliant. **M1 and M2 (August, in parallel)** convert curiosity into committed intent and run the 31 Aug launch, while replacing customer hypotheses with 15–20 real interviews — the launch's one verdict being *deposit→order conversion*, not "spots taken." **M3 (post-launch)** is where R&J finally learns whether it has a business: true per-order margin, a QC gate that also captures the Promise-Kept number, and a company breakeven whose position relative to fulfilment capacity forks the entire strategy into a *survival* problem or an *acceleration* one. **M4 (2027)** is the productisation stage — SOPs, the first hire, the referral and content flywheels, positive contribution margin without heroics — and **M5 (2027–28)** is the first proof that trust transfers beyond curtains, which is the only thing that justifies opening the equity door for the H2/H3 ambition.

The roadmap is as much about *not yet* as *now*: paid acquisition waits for the honesty pass and instrumentation; hiring waits for SOPs and a known breakeven; equity waits for M4+ economics that survive diligence; H2 categories wait for strong H1 trust metrics; VR/platform wait behind explicit validation gates. Governance is deliberately light — this document is the single "what now" source, the critical path breaks priority ties, a stage isn't done until its *exit criterion* (not its activity) is met, and the two keystones may never be leapfrogged. The net: a frighteningly under-resourced company has a **clear, cheap, correctly-ordered first 60 days** that de-risk it more than any raise could — and a legible path from there to the venture story, earned rather than claimed.

## Key Decisions
1. **Adopt the §2 critical path as the tie-breaker** for all prioritisation; work that neither advances nor attaches to it waits.
2. **Run M0 as the immediate, non-negotiable block:** honesty pass, price/unit fix, event store, runway, compliance — before any growth or capital work.
3. **Map execution to the Capital Brain's M0–M5** so the roadmap and the fundraise are one system; do not pursue a milestone's capital before its execution exit criterion is met.
4. **Treat M3's breakeven-vs-capacity result as the strategic fork** that determines whether the next move is fixing the model or opening the capital sequence.
5. **Enforce the deferral list (§5)** as standing discipline; advance stages on exit criteria, not activity.
6. **This document is the single source of "what now,"** reviewed fortnightly to launch.

## Dependencies on Previous Phases
- **Phase 11 §3 & governance** — the keystone-first ordering and the "no growth spend while R1/R3 unmitigated" law are the roadmap's backbone.
- **Phases 04, 06, 07, 08, 09, 10** — supply the individual actions the roadmap sequences (price/unit, photo→recommendation, event store, QC/SOPs, launch/referral/content, model/breakeven); this phase re-orders, not re-decides.
- **Phase 02 §12** — the M2 interview plan is a critical-path node, not optional.
- **Capital Brain (`00-capital-strategy.md §5`, `04-readiness-gaps.md`)** — the M0–M5 ladder and the gap→milestone mapping that this roadmap executes; the two systems share one milestone spine.

## Open Questions
- **Can M0's keystones (honesty pass + event store) realistically land before a launch push?** If not, an *honest* short launch slip beats launching on the old hero (Phase 09 §6) — decide the trigger now.
- **Which milestone is R&J actually at today?** (Likely pre-M0.) An honest self-placement prevents chasing M4 doors from an M0 reality (Capital §5).
- **What is the realistic founder-time budget** to run M0–M2 in parallel without dropping fulfilment? (A Capital-Brain blocking decision that gates this whole schedule.)
- **Does the M3 fork point toward fixing the model or opening capital?** Unknowable until margin + breakeven land — but pre-agree the criteria now so the fork is taken on evidence, not mood.

---

*End of Phase 12. The decisions were already made; this phase just puts them in a line and points at the front of it. Do M0 — truth, measurement, runway, compliance — and R&J will have de-risked itself more in 60 cheap days than a funding round could. Per the workflow, await founder challenge and approval before Phase 13 (Founder Playbook), the final phase.*
