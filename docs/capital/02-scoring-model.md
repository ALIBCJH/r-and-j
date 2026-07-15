# 02 — The Scoring Model (Expected Capital Value)

**R&J Interiors · Capital Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Financial Analyst + Startup CFO · Review cadence: When the rubric produces a ranking that feels wrong (then fix the rubric, not the number)

> **What this document is.** The single objective lens through which every opportunity in the register is ranked. It exists so that the pipeline is ordered by **expected return**, not by cheque size, recency, or excitement. If two people score the same opportunity, they should land within a band of each other.

---

## 1. The core idea

A funding opportunity is not worth its headline number. It is worth:

> **the capital on offer, discounted by the chance of actually getting it, weighted by how much it helps beyond the cash — divided by what it costs you in ownership, effort, and time.**

We make that computable as **Expected Capital Value (ECV)**.

```
                Capital Available  ×  P(success)  ×  Strategic Multiplier
   ECV  =      ───────────────────────────────────────────────────────────
                     Dilution Cost  ×  Effort Cost  ×  Time Cost
```

Every term is scored on a defined scale below. ECV is a **ranking device, not a valuation** — its absolute value is meaningless; only the order it produces matters.

---

## 2. The seven factors and how to score them

### 2.1 Capital Available (the prize)
The realistic cash (or cash-equivalent) value to R&J, in KES. For in-kind (credits, mentorship), convert to a defensible cash-equivalent (e.g. $5,000 cloud credits ≈ its sticker value; a network/brand benefit → score via the Strategic Multiplier, not here). Use the **midpoint of the realistic range for R&J's ask**, not the program's headline maximum.

### 2.2 Probability of Success — `P(success)`, 0.05–0.90
Honest odds R&J wins this, given its *current* readiness. Anchor with this table:

| Band | P | When |
|---|---|---|
| Near-certain | 0.80–0.90 | Credits/entitlements with only an application (AWS Activate, WEF group loan if organised) |
| Strong | 0.50–0.70 | Excellent fit, pre-launch-eligible, levers align (women-/tech-founder door), low competition |
| Even | 0.30–0.45 | Good fit but competitive, or a readiness gap partly closed |
| Long | 0.10–0.25 | Competitive + a stage/readiness gap (equity funds wanting traction) |
| Lottery | 0.05–0.10 | Elite/global competitions (thousands of applicants), or clear stage mismatch |

Adjust for R&J specifics: **+** for women-founder (Rose) or technical-founder (Simon) gates R&J *satisfies*; **–** for open unit-economics/validation gaps a diligent reviewer would find (see [`04-readiness-gaps.md`](04-readiness-gaps.md)).

### 2.3 Strategic Multiplier — 0.5–2.0
How much this capital helps *beyond the money*. Start at 1.0 and adjust:

| Add / subtract | Reason |
|---|---|
| **+0.3** | Brings a **network/credential** that opens the next door (accelerator brand, marquee investor logo) |
| **+0.2** | Delivers **validation signal** we can cite in every later application |
| **+0.2** | Comes with **mentorship/expertise** R&J genuinely lacks (fundraising, ops) |
| **+0.2** | **Strategic customer/partner** attached (B2B pipeline, supply terms) |
| **+0.1** | **Follow-on capital** likely from the same source later |
| **–0.3** | Distracts from building / from customers ("grant-preneur" trap, Principle 5) |
| **–0.2** | Forces off-mission positioning to qualify |

Cap the result to `[0.5, 2.0]`.

### 2.4 Dilution Cost — 1.0–3.0 (divisor)
The ownership price. This is what makes equity expensive at R&J's stage.

| Value | Meaning |
|---|---|
| **1.0** | Non-dilutive — grant, competition, credit, fellowship. **No ownership given.** |
| **1.3** | Debt / equipment / customer financing — no equity, but a repayment obligation & risk |
| **2.0** | Equity at a *fair, milestone-supported* valuation |
| **2.5–3.0** | Equity raised *too early / too cheap* — permanent dilution against an unproven story |

### 2.5 Effort Cost — 1.0–3.0 (divisor)
Total founder work to apply *and* comply.

| Value | Meaning |
|---|---|
| **1.0** | A form + existing assets (reuse the one-pager/data room) |
| **1.5** | Tailored application, light bespoke material |
| **2.0** | Custom deck + financial model + interviews/pitch rounds |
| **3.0** | Multi-stage program, heavy reporting, relocation, or long diligence |

Effort **falls over time** as reusable assets mature — re-score periodically.

### 2.6 Time Cost — 1.0–3.0 (divisor)
Calendar time from apply → money in hand.

| Value | Meaning |
|---|---|
| **1.0** | Days–weeks (credits, mobile-credit) |
| **1.5** | ~1–2 months |
| **2.0** | 3–6 months (typical grant/accelerator cycle) |
| **3.0** | 6+ months, or blocked on a future milestone |

### 2.7 Stage-gate (a hard filter, applied *before* scoring)
Regardless of ECV, an opportunity R&J is **not yet eligible for** (needs a milestone it hasn't hit — trading history, revenue, an MVP it lacks) is **parked**, not ranked. Tag it with the unlocking milestone (M0–M5, [`00-capital-strategy.md §5`](00-capital-strategy.md)) and revisit. **Do not spend effort computing a precise ECV for a door you cannot yet walk through.**

---

## 3. Worked examples (calibration anchors)

**A — Cloud credits (AWS Activate-type), ~KES 130,000 ($1k) value:**
`Capital 130,000 × P 0.85 × Strat 1.3 (compute for the visualizer) ÷ (Dilution 1.0 × Effort 1.0 × Time 1.0)` → **ECV ≈ 143,650.** Free, near-certain, useful → top of the "do it now" list despite a small headline.

**B — A women-founder pre-launch grant, ~KES 1,300,000 ($10k), competitive:**
`1,300,000 × 0.40 × 1.5 (validation + network) ÷ (1.0 × 2.0 × 2.0)` → **ECV ≈ 195,000.** High strategic value and non-dilutive lift its rank above bigger, longer-odds equity.

**C — A pre-seed equity cheque, ~KES 13,000,000 ($100k), raised now:**
`13,000,000 × 0.15 (weak story today) × 1.2 ÷ (2.6 dilution-too-early × 2.5 effort × 2.5 time)` → **ECV ≈ 143,700.** The huge headline collapses under early dilution, long odds, and heavy effort — **exactly the point of the model.** Re-score post-M4: `P` rises to ~0.35, dilution cost falls to ~2.0, effort/time ease → ECV roughly **quadruples.** *Same cheque, right time, ~4× the expected value.*

> The model's whole purpose is visible in B > C-today and C-later ≫ C-today: **cheaper, likelier, better-timed capital wins, and timing is a lever we control.**

---

## 4. The ranking bands

After scoring, sort by ECV and bucket:

| Band | Meaning | Action |
|---|---|---|
| 🟢 **Act now** | Top ECV, eligible today, deadline live or rolling | In the 3–5 live-application portfolio |
| 🟡 **Prepare** | High ECV but blocked on a near-term readiness gap or an upcoming window | Close the gap / wait for the window; queued |
| 🔵 **Watch** | Good fit, but stage-gated (needs M3+/revenue) or window closed | Monitor; revisit at the tagged milestone |
| ⚪ **Park** | Low ECV or poor fit | Logged with a reason; not worked |

---

## 5. Rules of use

1. **Score every opportunity on all seven factors — no blanks.** A missing factor defaults to the pessimistic end.
2. **Re-score monthly.** `P`, effort, time, and dilution all move as R&J closes milestones and matures its assets. The ranking is a living thing.
3. **The model informs; founders decide.** ECV surfaces the order; a founder may still pursue a lower-ECV door for a reason the model can't see (a warm relationship, a strategic bet) — but they must *say so*, in writing, in the register.
4. **Never game the score to justify a favourite.** If the ranking feels wrong, the fix is to improve the *rubric* (§2), not to nudge a number. Truth over politeness applies to our own model.
5. **Absolute ECV is meaningless; only order matters.** Do not report "ECV = 195,000" as if it were a valuation.
