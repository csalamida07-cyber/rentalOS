# GuestOS Product Architecture (RentalOS Repository)

## 1) Product Naming Model

- **GuestOS**: Umbrella operating system brand for STR hosts.
- **ReviewJet**: Reputation management module (current MVP branch focus).
- **RentalOS repository**: Engineering codebase that powers GuestOS modules.

## 2) Core Problem Statement

STR hosts are experiencing operational burnout due to repetitive communication, review management overhead, inconsistent workflows, and fragmented tools. GuestOS exists to consolidate those workflows into one modular operating system.

## 3) Big Idea

Run Airbnb operations like a business, not a side hustle, through guided automation and AI-assisted decisioning.

> Product principle: assistive control over blind automation.

## 4) GuestOS Module Map

1. **GuestFlow**
   - Booking-to-checkout communication orchestration.
2. **ReviewJet** *(MVP now)*
   - Post-stay review requests, reputation analytics, sentiment/risk routing, and response assistance.
3. **AutoRebooker**
   - Reactivates prior guests for repeat bookings.
4. **GhostFilter**
   - Re-engages inquiry leads that did not convert.
5. **SilentButler**
   - Emergency routing workflows (e.g., lockouts/leaks) to the right responder.
6. **CleanerPulse**
   - Cleaner workflow quality tracking and proof collection.
7. **UpsellMachine**
   - Structured add-on offers (late checkout, experiences, etc.).
8. **VIPLoop**
   - Referral and loyalty flywheel for high-satisfaction guests.

## 5) ReviewJet Definition of Done (MVP)

### ReviewJet must do
- Track and optimize post-stay review request consistency.
- Detect negative sentiment and route high-risk items into triage.
- Provide assistive draft workflows (copy-first, user initiated).
- Provide visibility into trendlines and operational performance.

### ReviewJet must not do
- Auto-post messages/replies to Airbnb.
- Promise rating guarantees.
- Remove or suppress platform reviews.

## 6) Platform and Data Principles

- Built to integrate with CRM and automation systems (including GHL) while remaining module-oriented.
- Event contracts and telemetry first.
- Compliance-safe defaults for all AI behaviors.
- Human-in-the-loop for guest-facing final actions.

## 7) Initial KPI Ladder

### ReviewJet KPI focus
- Review request consistency rate
- Positive review yield
- Negative response SLA (time-to-response)
- Missed follow-up reduction
- Reputation trend stability

### GuestOS expansion KPI focus
- Repeat booking rate
- Emergency handling time
- Cleaner quality score trend
- Upsell attach rate

## 8) Commercial Model (Positioning Draft)

- Setup: **$497** one-time
- Core subscription: **$97/month**
- A la carte modules: **$29–$49** each
- Agency licenses: volume-based custom pricing

> Pricing here is a positioning baseline and should be validated with pilot cohort willingness-to-pay testing.

## 9) Rollout Sequence

1. Ship ReviewJet MVP and validate retention/reputation outcomes.
2. Stabilize onboarding, reporting, and module UX patterns.
3. Introduce next adjacent module based on strongest pilot pain (likely GuestFlow or CleanerPulse).
4. Expand into full GuestOS module suite with shared identity and operations layer.
