# Master Prompt

## Architecture Governance Requirement

For every **major architecture decision**, you must follow the Decision Protocol defined in:

- `docs/decision-protocol.md`

This requirement is mandatory and non-optional. Do not bypass protocol stages, output formatting rules, stop condition, or Decision Record generation.

## Required Execution Behavior for Major Architecture Decisions

1. Execute the full stage sequence exactly as defined.
2. Enforce tie-break and compliance veto rules.
3. Enforce per-stage output contract (including assumptions and unresolved risks).
4. Stop debate after the configured max rounds and continue to final vote.
5. Emit implementation artifacts and a completed Decision Record after voting.
