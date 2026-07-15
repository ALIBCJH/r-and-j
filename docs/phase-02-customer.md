# Phase 02 — Customer Research

**R&J Interiors · Company Brain**
Status: Draft for founder approval · Version 1.0 · 2026-07-09
Owner: Founders (Rose Kabathi, Simon Juma) · Review cadence: After first 10 customer interviews, then quarterly

> **What this document is.** The definition of *who R&J serves, what job they hire R&J to do, and what we must prove before we trust any of it.* It sits directly under [Phase 01 — Foundation](phase-01-foundation.md) and inherits its Non-Negotiable Principles. Where Phase 01 declared the customer in one paragraph (§8, "The Certainty-Seeker"), this document interrogates that claim, decomposes it into jobs, segments, a persona, a buying journey, and — most importantly — a plan to replace assumption with evidence.
>
> **The honesty note that governs everything below.** R&J has conducted **zero structured customer interviews to date** `[ASSUMPTION — confirm; if any exist, log them here]`. Therefore **this is a hypothesis document, not a findings document.** Every persona, every number, every motivation is a *bet* derived from the shipped product, the founders' domain knowledge, and first principles — not from primary research. Per the Company Brain workflow, unverified claims are tagged `[ASSUMPTION — verify]` so they are never mistaken for truth. **The single most valuable output of this phase is §12, the Validation Plan** — the instrument that turns this document from hypothesis into knowledge. Until that runs, we treat this doc as a map drawn from memory: useful for direction, not yet safe for a one-way-door decision.

---

## 0. Pre-Work: Audit, Contradictions, Open Questions

### 0.1 Current-state audit (what the shipped product reveals about the assumed customer)

The product is itself a set of claims about the customer. Read that way:

- **The homepage/About narrative** targets someone with **buyer's remorse**: *"The swatch looked perfect in the shop… then it hung against your own walls and it was off. And curtains don't come with a refund."* (`app/components/about/StorySection.tsx`, Chapter 01). The customer this addresses is emotionally burned, quality-conscious, and loss-averse — not a bargain hunter.
- **Pricing** (`app/lib/products.ts`) runs **KSh 4,500–10,000 per panel**. A full room (multiple panels + install) is a **mid-hundreds-to-low-thousands-of-shillings-per-window** commitment — a considered purchase, not an impulse buy. This encodes a customer with disposable income above the median.
- **The style-picker** (`app/components/style-picker/config/steps.config.ts`) captures only **two customer inputs before the payment gate: a room photo and a colour.** The product currently believes the customer's decision reduces to *"what will this colour look like in my light?"* — a narrow, testable hypothesis about what the customer actually needs.
- **The consultation** (KES 2,500, credited to order — Phase 01 §7) presumes a customer willing to pay a small qualifying fee and invite the founders into their home. This is a customer who values expertise and human contact, consistent with Belief 7 ("trust is still built in person").
- **The pre-launch deposit campaign** (refundable KSh 100–1,000) presumes a customer willing to commit a token sum months ahead for a 5–12% discount — a customer with *some* forward intent, but the refundability means we cannot yet distinguish them from the merely curious (Phase 01 §0.2.3).

### 0.2 Contradictions found (tracked to owners)

1. **"In your actual room" is a promise the product does not yet keep.** `StepPhoto.tsx` tells the customer *"A photo helps us show you curtains in your actual light"* and captures the image — but the curtains are **re-tinted onto stock scenes, not composited onto the customer's uploaded photo.** The photo is previewed back to them and (as far as the picker flow goes) not used to render the result. So the core emotional promise the customer is buying — *see it in MY room* — is currently **aspirational, not delivered.** This resolves Phase 01 §0.2.4: **as shipped, R&J is closer to "a beautiful stock-room colour picker" than "your actual room."** **Owner: Product. This is the single most important gap in the company, because the entire customer thesis (§3, §7) rests on it.** `[verify: confirm the Studio/mobile-studio does not composite onto user photos either; StepPhoto does not]`
2. **The customer is told VR exists.** About Chapter 02 (*"We paired a curtain atelier with a VR studio — so you walk through your own space"*) sells the unshipped VR to the customer as present tense. Beyond the trust risk already logged in Phase 01 §0.2.1, it **corrupts customer research**: anyone who "converts" partly on a belief in VR is not evidence for the real product. **Owner: Brand. Same fix as Phase 01.**
3. **Two customers addressed at once.** Phase 01 §8 commits to residential homeowners only ([[target-audience-homeowners]]), yet product copy elsewhere gestures at offices ("living rooms and offices" — `products.ts` item 2, 4) and the About CTA has historically addressed partners/showrooms (strategy review §1.3). A research doc cannot profile two customers as if they were one. **This document profiles the homeowner only; B2B is deferred to Phase 04/09 as a separate customer with a separate JTBD.**

### 0.3 Open questions / assumptions carried into this document

These are the load-bearing unknowns. Each maps to a validation task in §12.

- **Income band, age, gender skew** of the paying customer `[ASSUMPTION — verify: Phase 01 §8 guesses ~30–55, often a woman leading the aesthetic; unverified]`.
- **Is the pain a painkiller or a vitamin?** Does the customer feel *agony* (will pay a premium) or *mild anxiety* (will use a free tool then buy cheapest)? The strategy review (§3) argues vitamin-leaning; this is **the** willingness-to-pay question (§7).
- **Does the visualizer change the decision, or only the pre-purchase anxiety?** i.e. does a Studio user convert higher / return fewer complaints than a non-user? Uninstrumented today.
- **How does the customer currently discover a curtain maker** — referral, Instagram, WhatsApp seller, Jumia, physical shop? Determines the entire acquisition model (§10).
- **Frequency & trigger.** What event makes someone buy curtains — a move, a renovation, a wedding, a birth, hosting? Trigger events are more acquirable than demographics.
- **Real order volume, repeat rate, and complaint/rework rate to date** `[ASSUMPTION — verify from `app/lib/orders.ts` / admin data]`.

None of these block *writing* the hypothesis. All of them block *acting* on it as if it were proven.

---

## 1. Executive Summary

R&J's customer is **not "someone who wants nice curtains."** It is **someone facing an expensive, irreversible home decision they are afraid of getting wrong** — and curtains are simply the first such decision R&J meets them at. We call her the **Certainty-Seeker**: an aspirational, quality-conscious Kenyan homeowner (working profile: woman, ~30–55, urban/peri-urban, considered-purchase income) who has either been burned by a home purchase she couldn't return, or watched someone close be — and who would rather pay a premium for *confidence* than gamble on the cheapest option.

The **job she hires R&J to do** is emotional before it is functional: *"Help me make this expensive change to my home without the fear of regret — and let me feel proud, not anxious, about the result."* The curtain is the occasion; **removing the fear is the product.**

The strategically honest finding of this phase is uncomfortable: **the product does not yet do the job it promises.** The customer is sold *"see it in your actual room,"* but the shipped Studio re-tints stock rooms and does not composite onto her photo (§0.2.1). This means we have **not yet built the painkiller** — we have built an attractive vitamin (a stock-room colour picker) and are marketing it as a painkiller (certainty in *her* room). The gap between those two is the difference between a service business with a nice gadget and a genuinely differentiated one. **Closing it is the top customer-driven priority for Phase 06 (Product).**

Everything else in this document — segments, journey, objections, acquisition — is a **testable bet**, not a finding, because R&J has run no structured interviews. The deliverable that matters most is therefore **§12: the plan to talk to 10–15 real customers and instrument the funnel**, which converts this map into knowledge before any expensive decision is anchored to it.

---

## 2. Research Method & Evidence Grade

**What this document is built from (in descending order of reliability):**

1. **The shipped product and copy** (highest reliability — it is real and observable). What the product asks for, prices at, and promises encodes the founders' implicit customer model. Audited in §0.1.
2. **Founder domain knowledge** — Rose and Simon are of this market, in Nyeri, selling to these people. This is real signal but is *insider* signal: prone to assuming the customer is like the founder, and to hearing "that's nice" as "I'll buy."
3. **First-principles reasoning** about irreversible-purchase psychology, transferable across geographies (loss aversion, the endowment of a decision made, the discounting of low-frequency skills).
4. **The Phase 01 Foundation and the Strategy Review** — internal, already-reasoned, but themselves not yet validated against customers.

**What it is NOT built from — and this is the point:**
- **No structured customer interviews** `[ASSUMPTION — confirm none exist]`.
- **No instrumented funnel** — Studio→consultation→order conversion is unmeasured (Phase 01 §12 Tier 2; strategy review Rec. 4).
- **No cohort/repeat data**, no complaint-rate data surfaced.

**Evidence grade of this document: HYPOTHESIS (C).** On a scale of A (validated with data) → B (triangulated from multiple indirect sources) → C (reasoned assumption) → D (guess), most claims here are **C**. A handful (pricing, what inputs the product captures) are **A** because they are read directly from code. Every claim is tagged where it matters. **We advance to Phase 03 with this understanding; we do not make one-way-door bets on C-grade claims (Phase 01 §13 reversibility rule).**

---

## 3. Jobs-To-Be-Done

People do not buy curtains; they hire something to make progress in their lives. R&J's customer hires it along three job dimensions. Ranked by what actually drives the purchase:

**Functional job (what she needs done):**
> *"Dress my windows correctly — right size, right light control, right privacy — with fabric and colour that suit my room, without me having to become an expert in fabric."*

Real, but weakly differentiating: every curtain seller claims this, and a WhatsApp tailor can do the mechanical part cheaply. Functional job alone loses to price.

**Emotional job (what she needs to feel) — THE PRIMARY DRIVER:**
> *"Let me stop being afraid I'll waste money on something I can't return and will resent every day. Let me feel confident before I commit — and proud, not embarrassed, when guests see it."*

This is the painkiller. It is where willingness-to-pay a premium lives (Phase 01 Belief 3: people pay not for features but for *not being wrong*). **R&J's entire right to a premium rests on owning this job better than a cheaper seller can.**

**Social job (what she needs to signal):**
> *"Let my home say I have taste and I've arrived — to family, to guests, to myself. Let me be the person whose home looks considered, not thrown together."*

In a relationship-and-status-aware market (Belief 7), the social job is strong and under-exploited. It also powers **referral** — the home *is* the advertisement, and a proud owner is R&J's cheapest acquisition channel (§10). `[ASSUMPTION — verify weight of social vs emotional job in interviews]`

**The JTBD one-liner the whole company can hold:**
> *"When I'm about to spend real money changing my home and I'm scared of getting it wrong, help me commit with confidence and end up proud."*

Note what is **absent** from every version above: the word "technology," "VR," or "app." The customer does not hire a visualizer; she hires *certainty*. The visualizer is one possible tool for delivering it — and only earns its place if it measurably does (Principle 3). This is the customer-side proof of Phase 01's positioning: **trust company, not tech company.**

---

## 4. Customer Segmentation

We segment by **relationship to the decision**, not by demographics — because the emotional job (§3) cuts across age and income, and because trigger + mindset predict purchase better than "35-year-old Nairobi woman" does.

**Primary segment — "The Burned Certainty-Seeker" (the founding customer).**
Has already made an expensive home mistake she couldn't undo (wrong sofa, wrong paint, wrong curtains) — or vividly watched someone close do it. Now approaches every irreversible home purchase with learned caution. **Highest pain, highest willingness to pay for confidence, highest referral value.** This is the customer R&J is built for and should obsess over. `[ASSUMPTION — verify prevalence]`

**Secondary segment — "The First-Time Nester."**
New home, new marriage, first place of her own, or a fresh renovation. High aspiration, high stakes, but *no scar tissue yet* — she may underestimate the regret risk and be more price-sensitive because she hasn't been burned. Acquirable via **trigger events** (moving, marriage). R&J's job here is partly *educational*: make the risk vivid before she learns it the hard way. Large and reachable, slightly lower current willingness-to-pay.

**Tertiary segment — "The Proud Upgrader."**
Established home, disposable income, redecorating by choice not necessity, strong social job (§3). Least fear, most taste-driven, best average order value, strong referral network. Converts on *aspiration and taste* more than on *fear*. A premium brand and beautiful visualization matter most here.

**How the segments should shape the company (not just describe it):**
- Product/copy leads with **the Burned Certainty-Seeker's fear** because it is the sharpest wedge (and already the About Chapter-01 voice — which is correct).
- Acquisition should learn to catch **First-Time Nesters at the trigger** (move/marriage/renovation) — the most *scalable* channel because the trigger is observable.
- Pricing and premium finishes should not be dumbed down for the **Proud Upgrader**, who anchors the top of the range (the KSh 10,000 Maasai Ember Velvet exists for her).

**Explicitly deferred (not this document's customer):** commercial/office/hospitality/developer buyers. Different JTBD (yield, turnover, spec-compliance — not personal regret), different sales motion, different unit economics. Phase 04/09 treats them as a distinct customer, per Phase 01 §8 and [[target-audience-homeowners]].

---

## 5. Primary Persona

> **Persona is a thinking tool, not a fact.** The following is a *composite hypothesis* to make the customer concrete for product and copy decisions. It is grade-C. Replace it with the real thing after §12 interviews.

**"Wanjiru" — The Burned Certainty-Seeker** `[ASSUMPTION — persona is illustrative; verify every attribute]`

- **Who:** ~38, lives in Nairobi (or Nyeri/peri-urban), owns or long-term-rents a home she intends to stay in. Household has considered-purchase disposable income — not wealthy, but able to choose quality over cheapest. Often the household's aesthetic decision-maker.
- **Context:** She is upgrading a sitting room or bedroom. She's done this before and once got it wrong — a fabric that looked warm in the shop went cold and cheap on her wall, and she couldn't return it. She still notices it every day.
- **The job she's hiring for:** *"Don't let me get it wrong again. Let me see it before I pay, and stand behind it if it's off."*
- **What she fears:** wasting money on something non-returnable; looking like she has no taste; a maker who takes her deposit and disappears or delivers something different from what was agreed.
- **What earns her trust:** a real person who shows up and measures; seeing a credible preview of the actual outcome; a name and a face she can hold accountable ("Rose and Juma, name on the door"); other women like her who've had a good result (referral).
- **Where she is:** WhatsApp, Instagram, Facebook groups, and — decisively — **conversations with friends and family** about who did their curtains. `[ASSUMPTION — verify channel mix]`
- **Her buying blocker:** *"How do I know it'll actually look like that in MY room, and that you'll actually deliver what we agreed?"* — which is precisely the promise the product does not yet fully keep (§0.2.1).

**Design implication:** every product and copy decision should be run past "Would this make Wanjiru feel *more certain and less afraid*, or does it just look impressive?" (Principle 1, the Trust Gate).

---

## 6. The Buyer's Journey

Mapping the real decision process shows where R&J builds or loses trust. Stages, with the customer's internal question and R&J's job at each:

| Stage | Her internal question | R&J's job | Current state |
|---|---|---|---|
| **1. Trigger** | *"This room isn't right / we're moving / guests are coming."* | Be discoverable at the moment the thought forms. | Uninstrumented; trigger unknown `[verify]` |
| **2. Anxiety / research** | *"I want to change it but I'm scared of a costly mistake."* | Name her fear back to her (the About Chapter-01 does this well). | Strong copy; **VR overclaim corrupts it** (§0.2.2) |
| **3. Consideration** | *"Can I trust these people, and will it look right in MY room?"* | Deliver a credible, honest preview + a human. | **Gap: preview is stock-room, not her room** (§0.2.1) |
| **4. Commitment** | *"Is this worth the money and non-refundable risk?"* | De-risk with consultation (credited), clear quote, guarantee. | Consultation model is sound; deposit ≠ intent (§0.2, Ph01 §0.2.3) |
| **5. Fulfilment** | *"Will what arrives match what I agreed?"* | Measure, make, deliver, install — promise-kept. | Vertically integrated — R&J's real strength |
| **6. Post / advocacy** | *"Am I proud? Would I recommend them?"* | Convert a kept promise into a referral. | **Referral is the growth engine but uninstrumented** (§10) |

**The two moments of truth:**
- **Stage 3 (Consideration)** is where R&J's *differentiation* is won or lost — and where the product currently under-delivers on its own promise. Fixing the "her-room" preview is the highest-leverage customer investment.
- **Stage 5→6 (Fulfilment→Advocacy)** is where R&J's *moat* is built — vertical integration keeping the promise, converting to referral. This is R&J's genuine strength and must be measured (Promise-Kept Rate, Phase 01 §12).

**The journey confirms the strategy:** R&J's edge is not at Stage 1–2 (any marketer can name a fear) but at **Stage 5** (few can *keep* the promise). The product should stop over-investing in the impressive front (VR theatre) and over-deliver at the trustworthy back (fulfilment + honest preview).

---

## 7. Willingness to Pay — The Painkiller/Vitamin Question

This is the most consequential unknown in the document, because it determines whether R&J is a **premium** brand or a **commodity** one.

**The bear case (strategy review §3):** a KSh 6,500 curtain mistake *stings but is survivable*. That makes the pain a **vitamin** for most homeowners — real anxiety, not agony. If so, the visualizer raises *trust and conversion* (good) but does **not** justify a *price premium* (the actual question), and R&J competes with WhatsApp sellers on a hill where certainty is a nice-to-have.

**The bull case (Phase 01 Belief 3):** for the **Burned** segment specifically, the pain is not the KSh 6,500 — it's the **daily regret + the social embarrassment + the irreversibility**, which together *are* a painkiller. People demonstrably pay premiums to avoid *being wrong* on irreversible choices (wedding vendors, tattoo artists, contractors). If R&J concentrates on the Burned/Proud segments, willingness-to-pay is real.

**The synthesis (the bet this company should make):**
> **Willingness-to-pay a premium is real but segment-specific.** It is a painkiller for the *Burned Certainty-Seeker* and *Proud Upgrader*, and a vitamin for the *price-first shopper* (whom we deliberately cede — Phase 01 §8). R&J's pricing power therefore depends on **customer selection**, not on the average homeowner. The strategic error would be to price for the average; the discipline is to be the *obvious* choice for the fearful-and-able and let the bargain-hunter go to WhatsApp.

**What this means concretely:**
- R&J must **not** compete on curtain price. It competes on *guaranteed outcome* — a different axis (Phase 01 §6 secondary problem: "a player who can guarantee the outcome escapes the price war").
- The premium is defensible only if the promise is actually kept (Stage 5) **and** honestly previewed (Stage 3). A premium charged on an unkept "your actual room" promise is the bait-and-switch risk the strategy review warns of.
- **This must be tested, not assumed.** §12 includes a willingness-to-pay probe (not "would you pay more?" — everyone lies — but revealed-preference: consultation-fee acceptance, non-refundable deposit uptake, premium-fabric mix).

**Evidence grade: C.** Do not set the pricing architecture (a one-way door, Phase 01 §13) on this until §12 returns data.

---

## 8. Objections & Trust Barriers

What stops the Certainty-Seeker from buying — ranked by how often they likely kill a sale `[ASSUMPTION — verify/rank in interviews]`, each with the antidote R&J must own:

1. **"Will it actually look like that in MY room?"** — The core objection. Antidote: an *honest* preview in her real space (the §0.2.1 gap) + a promise-kept guarantee. **Currently under-served.**
2. **"Will you deliver what we agreed, or disappear with my deposit?"** — The trust-in-the-maker objection, acute in a market with many unaccountable sellers. Antidote: named founders, consultation, in-person measurement, install, visible accountability. **R&J's strength — lean into it.**
3. **"Is it worth the money vs a cheaper tailor?"** — The price-justification objection. Antidote: reframe from *curtain price* to *cost of getting it wrong* (irreversibility). Do **not** discount into the WhatsApp price war.
4. **"I can't picture it / I don't trust my own taste."** — The confidence objection. Antidote: the visualizer + Rose's design authority as reassurance, not replacement.
5. **"I'll just do it later."** — Inertia, the silent killer of considered purchases. Antidote: trigger-timed outreach (§6 Stage 1) + honest, non-manipulative urgency. (Note: the pre-launch countdown flirts with manufactured urgency — must stay honest per Principle 2 and the anti-metrics rule.)

**The meta-objection:** every one of these is a *trust* objection, not a *product-feature* objection. This is the customer-side confirmation of the entire Foundation: **R&J sells trust; the curtain is the occasion.**

---

## 9. Anti-Personas — Who R&J Does NOT Serve

Naming who we lose on purpose is a strategic act — it keeps the product from being diluted to please everyone.

- **The Price-First Shopper.** Wants the cheapest curtain that covers the window; does not value certainty. R&J *should lose her* to WhatsApp sellers and should not distort pricing or product to chase her (Phase 01 §8).
- **The Renter-in-Transit.** Short-term renter with no autonomy or motivation to invest in a space she'll leave. Low stakes, low emotional job — not worth CAC.
- **The Commercial/Office Buyer (for now).** Different customer entirely (§4); deferred to Phase 04/09. Serving her by accident dilutes the residential wedge and the intimate brand.
- **The Tech-Toy Tourist.** Comes for the "VR/AI" novelty, plays with the Studio, buys nothing (or buys from a cheaper seller afterward). She inflates vanity metrics (Studio sessions) while contributing nothing to trust metrics — the exact anti-metric Phase 01 §12 rejects. **Do not optimize the product for her engagement.**

---

## 10. Acquisition & Referral

**The central hypothesis:** in this market, R&J is bought on **trust transferred through relationships**, so its primary and most durable channel is **referral from a satisfied customer** (Phase 01 Belief 7; Referral Rate is a Tier-1 metric). The home is the ad; the proud owner is the salesperson.

**Likely channel mix (to be verified in §12):** `[ASSUMPTION — verify all]`
- **Referral / word-of-mouth** — hypothesized primary; highest trust, lowest CAC; compounds. Currently uninstrumented.
- **Instagram / Facebook** — where taste is browsed and the social job (§3) plays out; strong for the Proud Upgrader; visual proof of kept promises (before/after real installs) is the content that converts here — *not* VR renders.
- **WhatsApp** — the transactional and referral rail of Kenyan commerce; the FAB already exists in-product (`WhatsAppFab.tsx`).
- **Trigger-based** (movers, new builds, weddings) — the most *scalable* because the trigger is observable; underexploited.

**The strategic acquisition insight:** R&J should invest in making **Stage 6 (advocacy)** systematic — turning every kept promise into a captured referral — before spending on paid acquisition of cold strangers. A referral-led business grows slower early and cheaper forever; a paid-led business is a treadmill (strategy review §6.8). This matches the Foundation's "slowly, then all at once" (Phase 01 §1).

**Instrumentation requirement:** we cannot manage what we don't measure. Capturing *"how did you hear about us?"* at consultation, and tracking referral chains, is a Phase 06/07 prerequisite — and a §12 task.

---

## 11. Applying the Decision Framework to Customer Bets

Running the Phase 01 §13 Four Gates on the major customer decisions this document implies:

- **Bet: "Fix the 'her-room' preview (composite onto the customer's photo)."** Trust Gate ✅ (directly increases Stage-3 certainty). Mission Gate ✅. Evidence Gate ⚠️ (verify with customers that stock-room preview is actually the blocker — don't assume). Long-Term Gate ✅. → **Pursue, but validate the blocker first (§12) before large build.**
- **Bet: "Concentrate on the Burned/Proud segments; cede the price-shopper."** All four gates ✅. This is a two-way door (repositionable) — **decide fast, learn.**
- **Bet: "Set premium pricing architecture on assumed willingness-to-pay."** Evidence Gate ❌ (grade-C, §7) and it's a **one-way door** (Phase 01 §13). → **Do not decide until §12 returns revealed-preference data.**
- **Bet: "Keep the VR-in-your-actual-room copy to aid conversion."** Trust Gate ❌ (it's the overclaim). → **Killed by the framework, as intended.**

---

## 12. Validation Plan — The Real Deliverable

This is the instrument that converts this document from hypothesis (grade C) to knowledge (grade A). **Until it runs, Phases 03–10 build on sand for anything customer-dependent.** Owner: Founders. Target: complete first round within 30 days of approval.

**A. Customer discovery interviews — 10–15, structured.**
Recruit from: recent buyers, deposit-campaign backers, and *lost* prospects (the ones who didn't buy — most informative). Mix all three segments (§4). Rules: open questions, ask about *past behaviour* not hypothetical willingness ("tell me about the last time you bought something for your home you regretted"), never pitch, record verbatim.
- **Core questions to answer:** What triggered the purchase? What were you afraid of? How did you decide whom to trust? Where did you look? What made you hesitate? (For buyers) Did the result match what you expected? (For lost) What made you walk away?
- **The one killer question** (tests §0.2.1): *"When you used the Studio, did you feel you were seeing YOUR room, or a nice example room? Did that matter?"*

**B. Instrument the funnel** (strategy review Rec. 4; Phase 01 §12 Tier 2 prerequisite).
Studio-session → consultation → order conversion; choice-logging (colour/fabric/room); drop-off points; "how did you hear about us?" at consultation; referral-chain tagging. **No customer claim in this doc is safe until this exists.**

**C. Willingness-to-pay — revealed, not stated (§7).**
Track consultation-fee acceptance rate; non-refundable vs refundable deposit uptake (make the deposit campaign *measure intent* per strategy review Rec. 7); premium-fabric mix in real orders.

**D. Promise-Kept probe** (Phase 01's #1 metric).
Post-install: *"Does the delivered result match what you previewed/expected?"* — the truest read on whether R&J is doing the job.

**Exit criterion for this phase:** Phase 02 upgrades from "Draft (hypothesis)" to "Validated" only when (a) ≥10 interviews are logged, (b) the funnel is instrumented, and (c) §0.3's six open questions have grade-A or grade-B answers. Until then, every downstream phase must treat this document's personas and numbers as provisional.

---

## 13. What Changes If We're Wrong

Intellectual honesty requires naming the ways this document could be false, and what each would force:

- **If the pain is a vitamin even for the Burned segment** → R&J cannot hold a premium; it must either drop price toward the WhatsApp line (unattractive) or pivot the wedge to a higher-stakes category. Kills the current pricing thesis.
- **If customers don't care about "their actual room" (a nice stock preview is enough)** → the §0.2.1 gap is not urgent, and R&J should invest the product effort elsewhere (e.g. fulfilment reliability, referral tooling). *This is why we test the blocker before building the fix.*
- **If acquisition is not referral-led but ad-led** → the "slowly, then all at once" thesis weakens and CAC becomes a permanent cost; the business looks more like a marketing-driven retailer than a trust compounder.
- **If the real buyer is B2B (developers/hospitality), not homeowners** → the entire customer definition flips (strategy review §7 flags this as *possibly a better beachhead*). Phase 04 must keep this door visibly open, not assume it shut.

None of these are disproven today. That is exactly why §12 exists.

---

## Future Revision Notes
- **Blocked on data:** the entire document is grade-C until §12 runs. §5 (persona), §7 (willingness-to-pay), §10 (channels) are the most speculative and must be revised first.
- **Contradictions to close:** §0.2.1 (her-room vs stock-room) is now *identified* and owned by Product/Phase 06 — update this doc when the product either closes the gap or the interviews show it doesn't matter. §0.2.2 (VR copy) shares the Phase 01 fix.
- **Trigger for review:** first 10 interviews complete; funnel instrumented; any evidence that the real buyer is B2B; any Promise-Kept signal below target.
- **Dependency handoff:** Phase 03 (Market) inherits the segments in §4 for sizing; Phase 04 (Business Model) inherits the willingness-to-pay question in §7; Phase 06 (Product) inherits the §0.2.1 gap as its top customer-driven brief.

---

*End of Phase 02. This is a hypothesis document by construction — R&J has not yet interviewed its customers. Its purpose is to make the current bet explicit and testable, and to hand Phase 06 a sharp brief. Per the workflow, await founder challenge and approval; do not treat the personas or numbers as established until §12 has run.*
