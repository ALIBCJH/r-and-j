# Phase 07 — Technology

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Simon Juma (Tech Lead) · Review cadence: Quarterly, or on any infrastructure/data-architecture change

> **Scope discipline (per the operating-manual mandate).** This phase does **not** restate Phase 01 §10's technology *philosophy* or Phase 06's product *roadmap* — it assumes both. It adds only what those did not cover: the **actual system architecture**, the **build-vs-buy ledger**, the **data architecture that the moat depends on**, and the **security / reliability / technical-debt posture**. Where a claim originates in an earlier phase, it is referenced (e.g. "Phase 01 §9.4"), not re-argued.
>
> **Evidence grade: A.** Everything in §1–§3 is read directly from the repository (`package.json`, `app/lib/store.ts`, `app/lib/security.ts`, `app/lib/orders.ts`, `app/lib/colorEngine.ts`, `app/api/**`). The single most consequential finding is a matter of fact, not opinion: **the data the moat is supposed to compound is not being persisted.**

---

## 1. System Architecture (new evidence)

**Stack (from `package.json`):** Next.js **16.2.7**, React **19.2.4**, TypeScript 5, Tailwind CSS 4, framer-motion 12. Email via **Resend**. E2E via **Playwright**. *Notable: `@types/three` is present but there is **no `three` runtime dependency** — the 3D/VR capability is not installed, only type-hinted. The unshipped-VR claim (Phase 05 §0.2.1) is therefore unshipped down to the dependency tree.*

**Runtime shape:** a single Next.js app (App Router) on Vercel serverless. Three tiers:
- **Client:** the certainty engine runs **entirely in-browser** — `colorEngine.ts` (colour math) + `curtainRenderer.ts` (canvas compositing). No server round-trip, no model inference. *This is a privacy and cost property, not just an implementation detail (§4, §6).*
- **Server (API routes, `app/api/**`):** M-Pesa STK-push / callback / status, orders, admin auth, founding-slot count, waitlist. Thin, transactional.
- **Data:** Vercel KV / Upstash Redis over **REST**, with an **in-process `Map` fallback** when KV is unconfigured (`store.ts`).

**Integrations:** **M-Pesa Daraja** (STK push, idempotent callback, status polling, mock mode for demos — `mpesa.ts`, `orders.ts`); **Resend** (transactional email); **Vercel** (hosting, KV). No other third-party runtime services.

**Architectural signature — deliberate dependency-minimalism.** `store.ts` and `security.ts` are explicitly *"dependency-free by design"*: they call KV/Redis over raw `fetch` rather than install a client SDK, and hand-roll HTML-escaping, email validation, and rate-limiting. This is a *coherent, defensible* engineering doctrine — it is the code-level expression of Phase 01 §10.4 ("rent the commodity, build the differentiator"), taken to the point of not even renting SDKs. Its benefits (tiny attack surface, near-zero maintenance, trivial to reason about) and its limits (§5) are both real.

---

## 2. The Build-vs-Buy Ledger (new framework)

Phase 01 §10.4 stated the *rule*; here is the *actual ledger*, which no prior phase recorded. This is the reference map for every future "should we build this?" decision.

| Capability | Decision | Verdict |
|---|---|---|
| Payments rail | **Rent** (M-Pesa Daraja) | ✅ Correct — never build a payments rail |
| Hosting/CDN/serverless | **Rent** (Vercel) | ✅ Correct |
| Data store | **Rent** (Upstash/Vercel KV) | ✅ Correct *primitive*, wrong *shape* (§3) |
| Transactional email | **Rent** (Resend) | ✅ Correct |
| KV client / HTTP | **Build** (raw `fetch`) | ✅ Defensible — avoids SDK churn; cheap to own |
| Input safety / rate-limit | **Build** (`security.ts`) | ⚠️ Fine now; rate-limiter must be rented at scale (§5) |
| **Certainty engine** (colour theory + compositing) | **Build** | ✅ **Correct — this is the differentiator** (Phase 01 §9.3) |
| **Analytics / event store / data warehouse** | **Neither built nor rented** | ❌ **The critical gap (§3)** |
| 3D/VR | **Neither** (types only) | ✅ Correct to defer (Phase 06 §7) |

**The ledger's verdict:** the build/buy *instincts* are sound almost everywhere. The one strategic error is not a wrong build-vs-buy call — it is a **missing capability entirely**: there is nothing, built or bought, capturing the data the whole strategy is premised on.

---

## 3. Data Architecture & the Flywheel Gap (the centerpiece)

**The finding, as fact:** the persistence layer is a **transactional cache, not a data asset.**
- Order and payment records are written to KV with a **30-day TTL** (`orders.ts`: `TTL_SECONDS = 30 * 24 * 60 * 60`). *After 30 days they are gone.*
- There is **no event stream, no analytics store, no warehouse, no durable log** of Studio sessions, fabric choices, wall-colour samples, recommendation accept/reject, or funnel steps.
- Customer room photos are held **client-side only** (`StepPhoto` keeps a `File` + object URL) and never persisted anywhere.

**Why this is the most important technical issue in the company:** Phase 01 §9.4 names "compounding taste-and-fit data" as one of the four moat pillars. Phase 02 §12, Phase 04 §11, and Phase 06 §8 all demand an instrumented funnel. **None of that can exist on the current architecture — the store is designed to *forget*.** The flywheel has no wheel. Today, the "data moat" is not thin (as the Strategy Review §5 charitably assumed); it is **architecturally absent.**

**The decision this forces (the phase's #1 output):** stand up a **durable, append-only event store** *before* the Phase 06 photo→recommendation feature ships — so that from the first session, every recommendation shown/chosen, wall sampled, and funnel step is captured. Concretely and cheaply, within the existing doctrine:
- Add an **events list/stream** in KV/Upstash **without TTL** (or mirror to a cheap durable sink — e.g. an append to object storage / a lightweight analytics service) — *rent the durability, keep the minimalism.*
- Define a **minimal event schema** now: `session_id`, `event_type`, `wall_hex`, `fabric_id`, `recommendation_rank`, `accepted`, `funnel_step`, `ts`. Small, additive, privacy-preserving (colours and choices, not photos or PII).
- Keep **transactional** records on their 30-day TTL (correct for orders); make **analytical** events durable (the opposite policy).

**Privacy dividend to protect:** processing the room photo **client-side** (the engine runs in-browser) means R&J can deliver personalisation *without uploading a customer's home photo to a server* — a genuine trust/privacy advantage (Phase 05 essence: "you will not be surprised" extends to "we don't hoard your home"). The data architecture should capture **derived, non-identifying signals** (a sampled wall hex, a chosen fabric) — not the photo. This is both cheaper and more trustworthy.

---

## 4. What Is Actually Defensible (technical view of the moat)

Phase 01 §9 argued the moat is a *compound*; this phase adds the **technical mechanics** of why the software layer alone is not it, and what would make the data layer real.

- **The algorithm is not defensible.** `colorEngine`'s colour theory and `curtainRenderer`'s compositing are competent but reproducible in days (Strategy Review §4). Defending them is the "software hill" error (Phase 01 §9).
- **The honesty *discipline* is quietly defensible-ish.** The "refuse to fake a match" rule (Phase 06 §4) is a *product-culture* asset more than a technical one — copyable in code, hard to copy in temperament under growth pressure.
- **The only technical moat that can compound is the captured data** (§3) — *once it exists.* A rival can copy the re-tint in a weekend; they cannot copy two years of "which fabric suited which wall/light/customer, and which the customer kept and loved." **That asset begins accruing only the day the event store ships — every day without it is moat that will never exist.** This reframes §3 from "tech debt" to "the moat's start date."

---

## 5. Reliability & Technical Scalability (distinct from Phase 04's fulfilment ceiling)

Phase 04 §7 covered the *human* capacity ceiling; this is the *system* one, which is far higher but has named edges:
- **Stateless serverless scales trivially** for the read/configure/checkout paths — the client-side engine adds ~zero server load (a cost/scale advantage of the §1 architecture).
- **Two per-instance in-memory limitations** (both flagged in-code, both fine now, both must close before horizontal scale):
  1. `security.ts` **rate-limiter is per-instance** (`Map`), so limits are not enforced globally across serverless instances → move to Upstash rate-limiting when traffic warrants.
  2. `store.ts` **`Map` fallback is per-instance** → production **must** have KV configured (the code says so) or the async M-Pesa callback and the browser poll can land on different instances and miss each other. *This is a correctness risk, not just scale — verify KV is provisioned in prod (ties to the open Vercel-env thread in [[funding-kickstarter-flow]]).*
- **M-Pesa callback idempotency** is handled correctly (`handleCallback` no-ops on completed payments) — good.

---

## 6. Security & Privacy Posture (new)

A stage-appropriate audit; not a substitute for a dedicated review before scale (a `/security-review` pass is warranted).
- **Input safety:** `security.ts` escapes HTML and strips CR/LF (header-injection defence) on email actions — sound for the current surface.
- **PII footprint is small and should stay small:** orders hold name/phone/email/address (necessary); the room photo stays client-side (§3). *Keep it that way* — do not start uploading photos without a privacy reason and a retention policy.
- **Payments:** no card data touched (M-Pesa handles it) — a deliberate PCI-scope-avoidance win of renting the rail.
- **Admin:** password-gated (`admin.ts`, `/api/admin/*`); credentials tracked in memory [[admin-dashboard-credentials]]. Before scale: confirm session/cookie hardening, brute-force protection on `/api/admin/login`, and that the admin panel isn't indexable.
- **Secrets:** KV/M-Pesa/Resend creds via Vercel env — confirm none are committed and that prod env is fully populated (§5, funding thread).

---

## 7. Technical Debt & Risk Register (new specifics)

Ranked by "how much future value it silently destroys":
1. **No durable analytics/event store (HIGHEST — §3).** Every day it's missing, un-recoverable moat data is lost. *Fix before Phase 06 step 2 ships.*
2. **Prod KV must be provisioned (correctness, §5).** Without it, payment callbacks can be missed. *Verify now.*
3. **Per-instance rate-limiter (§5).** Fine at current traffic; a DoS/scale edge later.
4. **Admin hardening (§6).** Low likelihood, high blast radius.
5. **Next.js 16 novelty.** A very new major (AGENTS.md flags breaking changes) — pin versions, read the bundled docs before upgrades, keep Playwright coverage on the checkout/M-Pesa path as the regression net.
6. **Single-app coupling.** Fine now; if H3b platform (Phase 03 §9) is ever pursued, the certainty engine should be extracted into a service/SDK — but not before (avoid premature abstraction).

---

## 8. Technology Roadmap (infrastructure enablers — not product features)

Deliberately framed as *platform/infra* work so it does not duplicate Phase 06's *feature* roadmap. Each item **enables** a Phase 06 step rather than restating it.
- **Now:** (a) ship the **event store + schema** (§3) — the enabler for Phase 06 step 3 instrumentation and the moat's start date; (b) **verify prod KV** (§5); (c) fix the **product-data defects** (price/unit) as a data-integrity task (Phase 04 §0.2).
- **Next:** (d) durable **funnel/analytics views** over the event stream (turn events into the conversion + Promise-Kept dashboards Phases 02/04/06 need); (e) **Upstash rate-limiting** when traffic warrants.
- **Later (gated):** (f) if measurement-from-photo (Phase 06 step 9) proceeds, decide *then* whether it stays client-side (preferred) or needs server inference; (g) if H3b platform proceeds, extract the engine into an SDK/service (§7.6) — a founder-level, separate-brand decision (Phase 01 §14).

---

---

## Executive Summary (one page)

R&J's technology is **architecturally sound and philosophically disciplined — with one strategically critical hole.** The stack (Next.js 16 / React 19 on Vercel, M-Pesa Daraja, Resend, a client-side canvas certainty engine) is modern, cheap to run, and built on a coherent *dependency-minimalism* doctrine that is the code-level expression of Phase 01's "rent the commodity, build the differentiator." The build-vs-buy calls (§2) are almost all correct: rent payments/hosting/email/data-primitive, build only the certainty engine. Running the engine **client-side** is a genuine cost and **privacy** advantage — personalisation without uploading a customer's home.

**The critical hole is the data architecture (§3).** The persistence layer is a *transactional cache*, not a *data asset*: order records self-delete after 30 days, and there is **no event store, no analytics, no warehouse** capturing Studio sessions, wall samples, fabric choices, or funnel steps. This means the "compounding taste-and-fit data" that Phase 01 §9.4 names as a moat pillar — and that Phases 02/04/06 all assume — **does not merely lack scale; it is architecturally absent.** The flywheel has no wheel. The technical moat is currently hollow (§4): the algorithm is copyable in days, and the only defensible layer (accumulated fit data) has no home. Its **start date is the day the event store ships** — every prior day is moat that will never exist.

Secondary but real: production **must** have KV provisioned or async M-Pesa callbacks can be missed (a correctness risk, §5); the hand-rolled rate-limiter and admin auth are stage-appropriate but need hardening before scale (§5–6); Next.js 16's novelty argues for pinned versions and Playwright coverage on the payment path (§7).

The net: **do not build new product spectacle; build the boring durable event store first.** It is small, cheap, fits the existing doctrine, preserves privacy (capture derived signals, not photos), and it is the single highest-leverage engineering act in the company — because it converts the certainty engine from a copyable toy into the origin of a compounding asset.

## Key Decisions
1. **Stand up a durable, append-only event store *before* the Phase 06 photo→recommendation feature ships** — durable analytical events alongside 30-day-TTL transactional records. *This is the phase's defining decision.*
2. **Capture derived, non-identifying signals (wall hex, fabric choice, funnel step) — never the room photo.** Keep engine processing client-side; make privacy a moat, not a liability.
3. **Ratify the dependency-minimalism doctrine** as R&J's standing engineering principle, with two named exceptions to revisit at scale (rate-limiting, rate-limited admin auth → rent).
4. **Verify production KV provisioning immediately** — treat the missing-callback scenario as a correctness bug, not a scale nicety.
5. **Do not extract/service-ify the certainty engine** until (and unless) the H3b platform door is opened — avoid premature abstraction.

## Dependencies on Previous Phases
- **Phase 01 §9.4 & §10.4** — supplies the moat-pillar ("compounding data") and the build/buy rule this phase implements and audits; §3 shows the pillar is unbuilt.
- **Phase 02 §12, Phase 04 §11, Phase 06 §8** — all three request an instrumented funnel / margin data; this phase specifies **where it must live** and reveals the current store cannot hold it.
- **Phase 06 §5–§6** — the photo→recommendation build is the first customer of the event store; sequencing (store before feature) is set here.
- **Phase 03 §9 & Phase 01 §14** — the H3b platform path governs the "extract the engine" deferral (§7.6, §8g).
- **[[funding-kickstarter-flow]]** — the open Vercel-env thread is elevated here to a correctness risk (§5).

## Open Questions
- **Minimum viable event schema** — is the §3 field set sufficient for the Phase 02 funnel *and* the future recommendation model, or does it need session-level context (light/time-of-day)? *Resolve before the store ships.*
- **Durability sink choice** — TTL-less KV list vs object-storage append vs a light analytics service: which best fits the minimalism doctrine at lowest cost? *Spike.*
- **Is prod KV actually provisioned right now?** *Verify (§5) — this is a yes/no with correctness stakes.*
- **When does client-side processing stop being enough?** Measurement-from-photo (Phase 06 step 9) may force server inference — decide the trigger, not now.
- **Does a `/security-review` pass surface anything before scale?** Recommended before any paid-traffic ramp.

---

*End of Phase 07. The engineering is disciplined and the instincts are right — but the company is, today, throwing away the one asset that compounds. Build the event store, and the moat's clock finally starts. Per the workflow, await founder challenge and approval before Phase 08 (Operations).*
