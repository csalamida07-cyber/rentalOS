# RentalOS

RentalOS is an operations and reputation intelligence platform for **short-term rental (STR)** hosts and small property managers.

For the current MVP, RentalOS is focused on a single line of value:

- **Retention & Reputation Recovery**
- help hosts increase review yield quality
- detect reputation risk quickly
- reduce time-to-response on negative feedback

## MVP Focus (Now)

### In Scope
- Retention event contracts and validation
- Review risk analysis (sentiment + issue tagging)
- Risk queue primitives for triage workflows
- Assistive response workflows (copy-only / user-initiated)

### Out of Scope (for now)
- Dynamic pricing
- Full PMS or channel manager replacement
- Autonomous posting/automation to OTA platforms
- Broad multi-OTA inbox orchestration

## Repository Structure

```text
backend/
  src/
    ingestion.ts              # in-memory ingestion primitives
    alerting.ts               # confidence drop alerting logic
    retentionEvents.ts        # retention event taxonomy + envelope validation
    riskQueue.ts              # MVP risk scoring and queue primitives
  tests/
    alerting.test.ts
    retention-events.test.ts
    risk-queue.test.ts

docs/
  compliance-guardrails.md
  decision-protocol.md
  domain-model.md
  event-contracts.md
  kpi-framework.md
  mvp-line1-execution-plan.md
  brand-guidelines.md

rentalos-api/
  openapi.yaml
  src/replyGenerationService.js
  scripts/no-autopost-endpoints.sh

rentalos-extension/
  manifest.json
  ui/extraction-panel.ts
  utils/dom-parser.ts
  tests/dom-parser.contract.test.ts
```

## Product Principles

- **Usability over polish** in early MVP
- **Assistive, not autonomous** interactions
- **Compliance-first** product decisions
- **Host-time saved** is the key value metric

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

> If your environment blocks npm registry access, package install may fail. In that case, run tests in a network-enabled environment.

### Run tests

```bash
npm test
```

## Current MVP Milestones

1. Retention event contract foundation
2. Risk analysis and triage queue core
3. Risk queue API endpoints
4. RentalOS dashboard and host workflow UI
5. Weekly digest and pilot hardening

## Brand + Product Docs

- Brand system and messaging: `docs/brand-guidelines.md`
- MVP execution backlog: `docs/mvp-line1-execution-plan.md`
- Event contract spec: `docs/event-contracts.md`
- KPI framework: `docs/kpi-framework.md`

## Contribution Notes

- Keep changes aligned to the current MVP line unless explicitly expanded.
- Avoid introducing autonomous posting behavior.
- Preserve contract-test and compliance guardrails when modifying APIs/extension flows.
