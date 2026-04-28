# Persistent Memory

Long-lived context for Claude Code sessions on this repo. Unlike [session.md](session.md) which logs *what happened*, this file records *what is true* — facts, preferences, and constraints that should carry across every session.

Update entries when they change. Remove entries that become wrong.

---

## User

- **Name:** Carl Salamida
- **Email on file:** help@mg.pageforge.tech
- **Primary OS:** Windows (works locally); also uses GitHub Codespaces (Linux) for remote work.
- **Tooling:** Has Obsidian installed locally with a vault at `C:\Users\Carl Salamida\OneDrive\Desktop\Claude Projects\rentalOS\RentalOS\`.
- **Reference Obsidian vault** (different project, used as a structure template): `C:\Users\Carl Salamida\Downloads\Telegram Desktop\obsidian\obsidian`.
- **Working style:**
  - Wants plans before implementation. Recommendation + tradeoff first, then ask.
  - Wants file paths cited when referencing code/docs.
  - Wants UI changes verified in a browser, not just type-checked.
  - Prefers governance enforced via documents + CI, not ad-hoc.

## Project

- **Name:** RentalOS (umbrella) / ReviewJet (MVP module).
- **Domain:** Reputation management for Airbnb hosts.
- **Scope rule:** ReviewJet is the **only** MVP module. Every other module in [rentalos-product-architecture.md](rentalos-product-architecture.md) is explicitly deferred.
- **Current state:** Foundations exist (event validation, risk scoring, alerting, extension manifest, CI guardrails). Persistence, GHL ingestion, LLM drafting, dashboard, digest are not yet built.
- **Active phase:** None. Phase 0 (Discovery & Lock) has not been opened yet.

## Hard Constraints

These cannot be relaxed without running the [decision-protocol.md](decision-protocol.md) and updating governance docs.

1. **Zero auto-post.** Forbidden, not deferred. Enforced by static CI guards in [.github/workflows/](../.github/workflows/) and code in [rentalos-api/src/routes/replies.js](../rentalos-api/src/routes/replies.js).
2. **Idempotency by `event_id`** must be preserved through every refactor. See [backend/src/retentionEvents.ts](../backend/src/retentionEvents.ts).
3. **Contract changes are additive only** with 90-day deprecation windows per [event-contracts.md](event-contracts.md).
4. **Compliance CI must be green** at every phase exit.
5. **Builder cannot self-approve.** A Developer (Reviewer) audit pass is required before CEO sign-off.

## The 4-Role Model

Defined in [CLAUDE.md](../CLAUDE.md) and the gate rules in [milestone-summary.md](milestone-summary.md).

- **CEO** — scope, priority, business outcome. Phase-exit sign-off.
- **Orchestrator** — sequencing, dependencies, decision-protocol enforcement. Never writes code.
- **Builder** — implementation + tests for the current phase only.
- **Developer (Reviewer)** — independent triple-check: works / doesn't break anything / no guardrail violation. Has veto.

## Tech Stack

- **Test runner:** Vitest (root + backend + extension).
- **Type system:** TypeScript 5.6.
- **Package manager:** npm 10+ with workspaces.
- **Persistence:** None yet — in-memory stores only. Phase 1 introduces Postgres.
- **LLM provider:** Not selected yet. Phase 3 selects + integrates.

## External Resources

- **Obsidian:** Local-only on user's Windows machine. Not reachable from codespaces. Decision on whether to mirror the reference vault structure into this repo is **deferred until the vault contents have been reviewed**.
- **GitHub:** Repo is `csalamida07-cyber/rentalOS`, default branch `main`.

## Pointers

- Status board: [milestone-summary.md](milestone-summary.md)
- Why-the-order: [prioritization-summary.md](prioritization-summary.md)
- What-is-being-built: [mvp-line1-execution-plan.md](mvp-line1-execution-plan.md)
- Decision rules: [decision-protocol.md](decision-protocol.md)
- Compliance rules: [compliance-guardrails.md](compliance-guardrails.md)
- Event schemas: [event-contracts.md](event-contracts.md)
- KPIs: [kpi-framework.md](kpi-framework.md)
- Domain entities: [domain-model.md](domain-model.md)
- Brand: [brand-guidelines.md](brand-guidelines.md)

## Maintenance

- Edit this file when a fact changes (e.g., LLM provider selected, persistence layer chosen, new role added).
- Do not put session-specific work here — that belongs in [session.md](session.md).
- Do not duplicate content from CLAUDE.md — link to it instead.
