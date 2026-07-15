# Phase 10 — Finance

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Simon Juma (acting CFO) + Founders · Review cadence: Monthly close; model refreshed each month

> **Scope discipline — three documents, three jobs.** This phase deliberately does **not** duplicate its two neighbours:
> - **Phase 04 (Business Model)** owns *how R&J makes money* — revenue model, pricing architecture, the unit-economics *framework* and the margin-squeeze finding.
> - **The Capital Brain (`docs/capital/`)** owns *how R&J accesses money* — the non-dilutive-first doctrine, the ECV-scored opportunity register, and the readiness gaps.
> - **This phase (Finance)** owns the *internal financial operating system that connects them* — the **model, cash, runway, breakeven, founder-wage discipline, working-capital dynamics, controls, and the uses-of-capital budget.** It is the "uses & model" counterpart to the Capital Brain's "sources," and it is where the Capital Brain's financial readiness gaps **G3 (unit economics), G5 (data room / model), and G9 (runway)** are not just flagged but **built and closed.**
>
> **Evidence grade: C, and that is itself the headline.** R&J cannot currently produce a P&L, a cash position, or a runway from anything in the repository (orders live in KV, unexported — Phase 04 §11, Phase 07 §3). **A finance function that cannot state its own runway is the finding.** This phase's deliverable is less a set of numbers than the *machine that produces them.*

---

## 1. The Runway Question (G9) — the number that governs everything

**R&J does not currently know its runway.** Not "it's short" or "it's long" — *unknown*, because burn and cash position are unstated (Capital-Brain gap **G9**, a **P0**). This is the single most important gap in the whole company's finances, because **runway sets the clock on every other decision** — how fast to raise, whether equity is even on the table yet, how much launch can cost, how long the founders can go unpaid.

**Decision (owns G9): establish the cash baseline this week.** Three numbers, a one-hour exercise:
1. **Cash on hand** (business + any founder funds committed to the business).
2. **Monthly burn** (fixed costs + any founder draw — see §3).
3. **Runway = cash ÷ burn**, in months.

Until these exist, the Capital Brain's capital *sequence* cannot be finalised (`docs/capital/00-capital-strategy.md §9` lists runway as the first of five blocking founder decisions). **Finance's first act is to make the clock visible.**

---

## 2. The Financial Model Architecture (closes G5)

The Capital Brain needs a data room with a financial model (**G5**); Phase 04 needs its unit economics turned into a company view. Both are the same artifact: **a minimum-viable, driver-based model.** This phase specifies its *shape* (the unit-economics inputs themselves belong to Phase 04):

**The model is one equation, driven by five inputs:**
> **Monthly profit = (Orders × AOV × Gross-Margin%) − Fixed Costs − Founder Wage**

- **Orders/month** — bounded by fulfilment capacity (Phase 08 §5), not demand, in H1.
- **AOV** — per *order* (per finished window), not per panel; pending the unit definition + price fix (Phase 04 §3, G6).
- **Gross-Margin%** — the true, all-in figure (G3) — the model's most load-bearing and most unknown input.
- **Fixed Costs** — workshop, hosting/tools, comms, transport base.
- **Founder Wage** — imputed, non-optional (§3).

**Build discipline:** keep it a single, legible spreadsheet driven by these five cells (dependency-minimalism applies to finance too — Phase 07 §1). Every input traces to a real source once G3 is closed. **A model no one can follow is worse than none** — this is the same "legible over impressive" ethos as the codebase.

---

## 3. Founder-Wage Discipline (the illusion Finance must kill)

Phase 04 §4 flagged that founder labour is uncosted; Finance makes it a rule. **The model must impute a market wage for Rose and Juma, and every margin, breakeven, and "profit" figure is computed *after* it.**

**Why this is non-negotiable:** a business that only "makes money" because its founders work for free is **not profitable — it is subsidised by the founders' unpaid time**, and that subsidy is invisible, unsustainable, and fatal to any honest diligence (a lender/investor imputes it immediately — Capital Brain G3). Worse, it hides the real scalability problem: if the numbers only work at a founder wage of zero, then *hiring anyone* (Phase 08 §3) breaks the model — which means the model, not the hire, is broken.

**Decision:** set an imputed monthly founder wage (even a modest, below-market one to start), put it in the model as a fixed cost, and judge the business on profit *after* it. This single discipline converts every downstream number from flattering fiction to decision-grade truth.

---

## 4. Company-Level Breakeven (new — the number the founders live by)

Phase 04 gave *per-order* economics; Finance gives the *company* breakeven — the orders/month at which R&J covers fixed costs **plus** the founder wage:

> **Breakeven orders/month = (Fixed Costs + Founder Wage) ÷ (AOV × Gross-Margin%)**

**This is the most important operating number the founders don't yet have.** It answers: *how many windows a month must we sell to keep the lights on and pay ourselves?* And it immediately stress-tests the whole H1 thesis against two ceilings already established:
- If breakeven orders/month **exceeds fulfilment capacity** (Phase 08 §5), the H1 service **cannot** pay a founder wage at current price/margin — a red flag that forces either the price/unit fix (Phase 04 §3), the AOV lever (bigger baskets, Phase 04 §4), or faster productisation (Phase 08 §3).
- If breakeven sits comfortably **below** capacity, R&J has a viable H1 cash engine and the capital question becomes about *acceleration*, not *survival* — which changes the entire Capital-Brain sequence.

**Decision:** compute breakeven the moment G3 (real margin) and AOV land, and treat it as a standing dashboard number (§7). *Everything strategic downstream depends on which side of capacity it falls.*

---

## 5. Working-Capital Dynamics (a genuine, under-appreciated strength)

Amid the unknowns, R&J has a real structural financial advantage that no prior phase named: **a favourable (near-negative) working-capital cycle.**
- **Made-to-order** means near-zero finished-goods inventory (cash isn't tied up in stock — Phase 08 §4).
- **Customer cash arrives *before* most COGS:** the KES 2,500 consultation deposit, the founding pre-sale deposits (Phase 04 §5), and a deposit-now/balance-on-fulfilment structure (Phase 04 §1) mean R&J is **partly funded by its own customers** — the cheapest capital there is (Capital Brain doctrine: revenue/customer cash before equity).

**Decision — protect and lean into this:**
- Formalise a **deposit-against-order** policy (a meaningful deposit on every custom order) so the customer float reliably funds fabric purchase — turning working capital into a *feature*, not an afterthought.
- This is also why **customer-financing rails** (Capital Brain's Faraja/Aspira lever) are a *finance* decision, not just a GTM one: they let R&J be paid in full up-front while the customer pays over time — improving the cash cycle **and** AOV/conversion. Finance owns wiring these in at soft-launch.

---

## 6. Financial Controls & Bookkeeping (enables G5, links G4)

A two-person team running on M-Pesa with order records in KV has **no formal books** — which blocks the data room (G5), weakens compliance (G4), and is why runway is unknown (§1). The fix is minimal and doctrine-consistent:
- **Separate business banking + a dedicated M-Pesa till** — never commingle founder and business cash (also a compliance/AGPO prerequisite, Capital Brain G4).
- **Monthly close (one hour):** reconcile M-Pesa/till against KV order records (Phase 07 §3 export), categorise spend, update the model's five inputs, refresh runway.
- **Clean transaction history is itself an asset:** Capital-Brain G11 notes that ~6 months of clean M-Pesa records *is the key* to Tier-2 SME debt/RBF. **Bookkeeping is not overhead here — it is future collateral.**

---

## 7. The Financial Dashboard (new — the CFO scoreboard)

Distinct from the trust metrics (Phase 01 §12) and the GTM ladder (Phase 09 §9); these are the survival-and-health numbers, refreshed at each monthly close:
- **Cash on hand · Monthly burn · Runway (months)** — the §1 triad; the survival gauge.
- **True gross margin %** (G3) — the model's keystone.
- **Contribution per order** (after all variable cost + imputed founder time on that order).
- **Breakeven orders/month** vs **actual orders/month** — the §4 viability check, side by side.
- **Deposit float** — customer cash held against undelivered orders (§5); the cheap-capital gauge.
- **Cash-conversion timing** — days from customer deposit to COGS outlay (should stay ≤ 0 where possible).

---

## 8. Uses of Capital — the Budget Behind the Milestones (new; the counterpart to the Capital Brain)

The Capital Brain tags every capital ask to a milestone **M0–M5** (`docs/capital/00-capital-strategy.md`); it supplies the *sources*. Finance must supply the **uses** — what each milestone actually *costs* — or the asks have no denominator. The stage budget (to be costed once §1–§4 land):
- **M0–M1 (pre-launch → launch):** cheapest possible — honesty pass + instrumentation are *engineering time*, not spend; the big "spend" is **founder runway** to reach launch. *Fund with: free credits (cloud), customer deposits, minimal grants — never equity (Capital Brain doctrine).*
- **M2–M3 (early trading → first hire):** the first *real* uses — a trained measurer/installer (Phase 08 §3), fabric working capital, light tooling. *Fund with: revenue + customer financing + county/creative grants + (once ~6mo trading) SME debt.*
- **M4–M5 (scale / H2 basket / H3 platform):** the only stage where equity is doctrinally appropriate, and only for the platform ambition (Phase 03 §9, Capital Brain doctrine) — never to subsidise the H1 service.

**The finance principle binding sources to uses:** *match the cost of capital to the reversibility and margin of the use.* Cheap, reversible, revenue-generating uses (fabric float, a hire) get cheap capital (deposits, grants, debt). Only the one-way-door, venture-scale use (the platform) justifies the most expensive capital (equity). This is the Phase 01 §13 reversibility test, applied to money.

---

---

## Executive Summary (one page)

R&J's finance function has one defining fact: **it cannot currently state its own runway, margin, or P&L**, because order data lives unexported in KV and the business keeps no formal books. That is not a small housekeeping gap — a company that cannot see its own clock cannot make a single well-timed decision about launch spend, hiring, or fundraising. So this phase's real deliverable is not a set of numbers but the **machine that produces them**: a cash baseline, a legible five-input model, a monthly close, and a dashboard.

The model is deliberately one equation — *profit = (orders × AOV × gross-margin%) − fixed costs − founder wage* — and its most important discipline is the last term. **Founder labour must be imputed at a real wage, and every margin and breakeven computed after it.** A business that only "works" because its founders are unpaid is not profitable; it is subsidised, and that subsidy hides the true scalability problem — because if the numbers only pencil at a founder wage of zero, then hiring anyone (the whole productisation plan of Phase 08) breaks the model. From this falls the single number the founders most need and don't have: **company-level breakeven — the orders/month to cover fixed costs plus a founder wage.** Whether that number sits above or below fulfilment capacity (Phase 08 §5) decides whether H1 is a survival problem or an acceleration problem — and reshapes the entire capital sequence.

Amid the unknowns sits a genuine, under-used strength: a **favourable working-capital cycle.** Made-to-order means near-zero inventory, and customer cash (consultation deposit, founding deposits, deposit-on-order) arrives *before* most COGS — R&J is partly funded by its own customers, the cheapest capital there is. Finance should formalise a deposit-on-every-order policy and wire in customer-financing rails (the Capital Brain's Faraja/Aspira lever) as a *cash-cycle and AOV* decision, not just a GTM one.

The phase closes three Capital-Brain readiness gaps by owning them here: **G9 (runway — state it this week), G3 (true gross margin — from the KV export), and G5 (the model + data room).** It also supplies the **uses-of-capital budget** that the Capital Brain's milestone-tagged *sources* lack a denominator for — binding the two systems with one principle: *match the cost of capital to the reversibility and margin of the use.* Cheap, revenue-generating uses (fabric float, a hire) get cheap capital (deposits, grants, debt); only the one-way-door platform ambition justifies equity. The net: **build the boring financial machine, impute the founder wage, find breakeven — and the company will finally be able to make timed decisions instead of blind ones.**

## Key Decisions
1. **State runway this week** (cash ÷ burn) — closes G9 and unblocks the Capital-Brain sequence. Finance's first act.
2. **Build the five-input driver model** as a single legible sheet — closes G5; becomes the data-room centerpiece.
3. **Impute a founder wage and judge all profitability after it** — the discipline that makes every number decision-grade.
4. **Compute company-level breakeven** (orders/month) and track it against fulfilment capacity as a standing dashboard number.
5. **Formalise deposit-on-every-order + wire customer-financing rails** — turn the working-capital advantage into policy.
6. **Institute a one-hour monthly close** (M-Pesa/KV reconciliation → model refresh) — bookkeeping as future debt collateral (G11).
7. **Author the uses-of-capital budget (M0–M5)** as the denominator to the Capital Brain's sources; match cost-of-capital to use-reversibility.

## Dependencies on Previous Phases
- **Phase 04 §4, §11 (& §3, §5)** — supplies the unit-economics inputs (AOV, margin), the uncosted-founder-labour flag this phase turns into a rule, and the deposit structure behind the working-capital cycle.
- **Phase 07 §3** — the KV event/export store is the *only* source of the real margin and order data (G3); no model exists without it.
- **Phase 08 §5, §3** — fulfilment capacity is the ceiling breakeven is tested against; the first hire is the first major *use* of capital.
- **Phase 03 §9** — the H2/H3 horizons define the only stage where equity is doctrinally appropriate (uses budget, M4–M5).
- **Capital Brain (`docs/capital/` — 04-readiness-gaps G3/G5/G9, 00-capital-strategy §9, the Faraja/Aspira lever)** — this phase resolves the financial readiness gaps and supplies the uses side the Capital Brain's sources require.

## Open Questions
- **What is the actual runway?** (§1) — a yes/answerable-today question with survival stakes; the first thing to resolve.
- **What is true gross margin per order?** (G3) — everything in §4 is blocked on it; export KV and cost one real order end-to-end (with Phase 08 §4 sourcing data).
- **Does breakeven fall above or below fulfilment capacity?** — the finding that reshapes the strategy; computable the moment margin + AOV land.
- **What imputed founder wage is realistic** for the model without pricing the company into permanent loss? Start modest, revisit.
- **Which customer-financing rail to wire first** (Faraja vs Aspira, Capital Brain) and at what soft-launch date — a finance+GTM joint call.

---

*End of Phase 10. R&J's finances are not in trouble — they are *invisible*, which is more dangerous, because you cannot steer what you cannot see. Build the small, legible machine; impute the wage; find breakeven; state the runway. Per the workflow, await founder challenge and approval before Phase 11 (Risks).*
