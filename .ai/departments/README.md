# R&J Interiors — Departments (Operating OS)

**What this folder is.** The **operational org layer** of R&J. Where `docs/` (the Company Brain + Capital Brain) holds the *strategy* — why R&J exists, what it decides, in what order — this folder holds the *operating charters*: **who owns which function, how they run it day to day, and where their boundaries are.** Strategy is decided in `docs/`; it is *operated* here.

**One company, two views.**
- `docs/phase-NN-*.md` → the **brain**: mission, market, model, roadmap, risks (the *why/what*).
- `.ai/departments/*.md` → the **org**: functional charters that execute the brain (the *who/how*).
- Charters **reference** the brain; they never restate strategy. If a charter and a phase disagree, the phase wins.

**Reality check.** R&J is two founders (Phase 13 §2): **Rose** owns the *trust layer* (design, craft, customer, brand), **Simon** owns the *systems & money layer* (platform, data, finance, capital). "Departments" here are **functions, not headcount** — one person wears several hats. The charters define how the *function* operates so it can later be delegated (Phase 08 §3: the SOP is the unit of delegation) or run by an AI agent as R&J systematises.

## The departments

| Charter | Function | Owner | Source phase(s) |
|---|---|---|---|
| [EXPERIENCE_DESIGN](EXPERIENCE_DESIGN.md) | The Studio + product experience; the certainty engine's UX; design craft | Rose (aesthetic) · Simon (tool) | 06 Product · 05 Brand |
| [ENGINEERING](ENGINEERING.md) | Platform, data/instrumentation, the certainty engine build, reliability | Simon | 07 Technology |
| [BRAND_AND_MARKETING](BRAND_AND_MARKETING.md) | Identity, voice, the content engine, honesty of claims | Rose (voice) · Simon (systems) | 05 Brand · 09 GTM |
| [GROWTH](GROWTH.md) | The acquisition ladder, referral engine, launch, B2B pilot | Simon (funnel) · Rose (relationships) | 09 GTM · 02 Customer |
| [OPERATIONS](OPERATIONS.md) | Fulfilment pipeline, QC, SOPs, sourcing, scheduling | Rose (QC) · Simon (systems) | 08 Operations |
| [FINANCE](FINANCE.md) | Model, runway, monthly close, unit economics | Simon | 10 Finance · 04 Business Model |
| [CAPITAL](CAPITAL.md) | Fundraising execution against the ECV register | Simon · Founders (joint) | Capital Brain (`docs/capital/`) |
| [CUSTOMER_INSIGHT](CUSTOMER_INSIGHT.md) | Customer research, JTBD, validation, the truth about demand | Rose | 02 Customer |

## Charter format (every file follows this)
1. **Mandate** — one sentence: what this function exists to do.
2. **Owns / Doesn't own** — boundaries with adjacent departments (no overlap).
3. **Governing principles** — the relevant Non-Negotiables (Phase 01 §11) + source-phase rules, made operational.
4. **Decision rights** — decides alone (two-way door) vs joint/in-writing (one-way door), per Phase 13 §2.
5. **Standards & Definition of Done** — what "good" means here.
6. **Current priorities** — mapped to the M0–M5 roadmap (Phase 12).
7. **Metrics** — what this function is judged by (ties to Phase 01 §12 trust metrics where relevant).
8. **Interfaces** — upstream/downstream handoffs to other departments.
9. **Anti-goals** — what this function must NOT do.

## The two laws every department obeys
- **The honesty law** (Phase 01 Belief 4, Phase 11 R1): never claim more than R&J delivers. Applies to code, copy, emails, and pitches alike.
- **The sequencing law** (Phase 11 governance, Phase 12): no growth spend while the two keystones (honesty pass + instrumentation) are incomplete; advance on exit criteria, not activity.

*This folder is a living operating layer. When a `docs/` phase is revised with new evidence, the affected charters are re-checked. Non-Negotiables change only by dated, written founder approval (Phase 01 §Amendment).*
