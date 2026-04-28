# CLAUDE.md

Project memory for Claude Code sessions on the RentalOS / ReviewJet repo.

## What This Repo Is

RentalOS is a compliance-first monorepo. The **only MVP-scope module is ReviewJet** — a reputation-management product for Airbnb hosts. All other modules listed in [docs/rentalos-product-architecture.md](docs/rentalos-product-architecture.md) are explicitly deferred until ReviewJet pilot exit criteria are met.

## Subprojects

| Path | Purpose | Stack |
|---|---|---|
| [backend/](backend/) | Event validation, risk scoring, alerting, ingestion stubs | TypeScript + Vitest |
| [rentalos-api/](rentalos-api/) | Node API; reply generation service with compliance guards | Node.js |
| [rentalos-extension/](rentalos-extension/) | Chrome MV3 extension; user-initiated DOM parse only | TypeScript + Vitest |
| [clients/](clients/) | Dashboard / extension shell stubs | TypeScript |
| [docs/](docs/) | Governance, architecture, KPIs, milestones | Markdown |

## Governance — Read These First

The repo enforces governance via documents and CI guardrails. Do not bypass.

- [docs/decision-protocol.md](docs/decision-protocol.md) — 4-stage decision framework (Proposal → Critique → Revision → Vote). 2 rounds max.
- [docs/compliance-guardrails.md](docs/compliance-guardrails.md) — **Zero auto-post. Forbidden, not deferred.** Static CI guards enforce this.
- [docs/event-contracts.md](docs/event-contracts.md) — Schema changes are additive only with 90-day deprecation windows.
- [MASTER_PROMPT.md](MASTER_PROMPT.md) — Decision-protocol enforcement at session entry.

## The 4-Role Build Model

Every phase runs the same loop. **No role skips its turn.**

1. **CEO** — owns scope, priority, business outcome. Signs off only at phase exit.
2. **Orchestrator** — sequences phases, enforces decision protocol, opens/closes gates. Never writes code.
3. **Builder** — implements code + tests for the current phase only.
4. **Developer (Reviewer)** — independent triple-check on Builder's output:
   - Does it work?
   - Does it break anything?
   - Does it violate any guardrail?

Builder cannot self-approve. CEO cannot sign off without a Developer audit pass.

## Phase Plan & Status

- [docs/milestone-summary.md](docs/milestone-summary.md) — board: phase, owner, deliverable, exit criteria, status.
- [docs/prioritization-summary.md](docs/prioritization-summary.md) — explains *why* the order is what it is. Anchor for scope debates.
- [docs/mvp-line1-execution-plan.md](docs/mvp-line1-execution-plan.md) — source of truth for *what* is being built (8 epics, RACI, exit criteria).

When user says "what's the status" → read milestone-summary.md. When user proposes scope changes → run them against prioritization-summary.md and decision-protocol.md.

## Session & Memory Files

- [docs/session.md](docs/session.md) — rolling log of work done per session. Append a new entry at the top at the end of each session.
- [docs/memory.md](docs/memory.md) — persistent facts (user, project, constraints, tech stack, external resources). Update when a fact changes; do not log session activity here.

At session start, read both. At session end, append to session.md and update memory.md if any fact changed.

## Don't-Break-Prod Rules

1. **No phase starts** until the previous phase is signed off by CEO.
2. **Compliance CI must be green** at every phase exit. The workflow lives in [.github/workflows/](.github/workflows/).
3. **Contract changes are additive only.** Mutating a live contract requires a deprecation window per [docs/event-contracts.md](docs/event-contracts.md).
4. **Idempotency by `event_id`** is preserved through every refactor. See [backend/src/retentionEvents.ts](backend/src/retentionEvents.ts).
5. **No `mode: "posted"` paths.** The reply generation service must reject them. See [rentalos-api/src/routes/replies.js](rentalos-api/src/routes/replies.js).

## Working Style for Future Sessions

- **Edit existing docs over creating new ones.** The execution plan, KPI framework, and event contracts are the source of truth — extend them, don't fork.
- **Cite file paths** when referencing code or docs.
- **For exploratory questions**, recommend with a tradeoff before implementing. Wait for the user to confirm.
- **For UI changes**, the user must verify in a browser — type-checks alone do not prove a feature works.

## Obsidian Vault

A reference Obsidian vault exists on the user's local Mac at `~/Desktop/clawd-local/Clawd Projects/claude-os/obsidian/`. **It is not reachable from this codespace.** Decision on whether to mirror it into this repo (e.g. under `/obsidian/` or `/docs/vault/`) is deferred until the contents have been reviewed. Do not create a new vault before that review.

## Tech Stack Quick Reference

- **Test runner:** Vitest (root + backend + extension)
- **Type system:** TypeScript 5.6 (root tsconfig at [tsconfig.json](tsconfig.json))
- **Package manager:** npm 10+ with workspaces
- **Persistence:** None yet — in-memory stores only. Phase 1 introduces Postgres.
- **LLM provider:** Not yet wired. Phase 3 selects + integrates.
