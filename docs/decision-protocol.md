# Decision Protocol

This protocol is mandatory for every **major architecture decision**.

## 1) Decision Stages

Run each major architecture decision through the following stages in order:

1. **Proposal**
2. **Devil's Advocate Critique**
3. **Revision**
4. **Final Vote**

## 2) Tie-Break and Veto Rules

If voting does not produce a clear majority:

- **CTO** has final say on technical trade-offs and implementation feasibility.
- **CEO** has final say on market strategy, customer impact, and business timing.
- **Compliance** has veto power on policy, legal, or regulatory risks. A compliance veto blocks approval until addressed.

## 3) Required Output Format Per Stage

For every stage, all participating agents must use this format.

### Stage Output Contract

- **Max length per agent per stage:** 200 words
- **Mandatory fields (in order):**
  1. `Position:` (1-2 sentence stance)
  2. `Assumptions:` (bullet list, at least 2 items)
  3. `Unresolved Risks:` (bullet list, at least 1 item; use `None` only if justified)
  4. `Recommendation:` (single action sentence)

### Stage-Specific Emphasis

- **Proposal:** primary architecture option + expected outcomes.
- **Devil's Advocate Critique:** strongest objections, failure modes, hidden costs.
- **Revision:** updated proposal addressing critique with explicit changes.
- **Final Vote:** `Approve` / `Reject` / `Approve with Conditions` plus rationale.

## 4) Stop Condition

To prevent infinite debate loops:

- Maximum of **2 rounds** of Proposal → Critique → Revision.
- After round 2, the system must proceed directly to **Final Vote**.
- After Final Vote, immediately emit implementation artifacts (plan, task breakdown, and ownership), regardless of remaining disagreement, unless Compliance veto is active.

## 5) Decision Record Template

After Final Vote, create and store a Decision Record using the template below.

---

## Decision Record

- **Decision ID:**
- **Date:**
- **Decision Owner:**
- **Participants:**
- **Context / Problem Statement:**
- **Options Considered:**
  - Option A:
  - Option B:
  - Option C:
- **Decision Outcome:**
- **Rationale:**
- **Rejected Alternatives and Why:**
  - Alternative:
  - Reason Rejected:
- **Assumptions at Time of Decision:**
- **Known Risks at Decision Time:**
- **Compliance Notes / Veto Status:**
- **Implementation Artifacts Produced:**
- **Rollback Trigger:** (clear, measurable condition that invalidates this decision)
- **Follow-up Review Date:**

