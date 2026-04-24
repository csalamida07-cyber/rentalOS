# KPI Framework

This document defines a three-layer KPI framework for measuring product performance and trust outcomes, including target thresholds and dashboard ownership.

## 1) Acquisition

| Metric | Definition | Target Threshold | Dashboard Owner |
|---|---|---|---|
| Extension install conversion rate | Percentage of landing page visitors who install the extension. | **>= 18%** monthly conversion rate | Growth / Marketing Ops |
| Onboarding completion rate | Percentage of new installers who complete onboarding flow. | **>= 75%** within 7 days of install | Product (Onboarding PM) |

## 2) Activation / Usage

| Metric | Definition | Target Threshold | Dashboard Owner |
|---|---|---|---|
| % users analyzing first review within 24h | Share of newly onboarded users who analyze their first review in the first 24 hours. | **>= 65%** | Product Analytics |
| Weekly active hosts generating at least one actionable insight | Number (and share) of weekly active hosts who produce at least one actionable insight. | **>= 55%** of WAH weekly | Product + Data Science |
| Reply generation-to-copy/use rate | Percentage of generated replies that are copied, exported, or sent. | **>= 45%** weekly | Core Product Team |

## 3) Retention / Outcome

| Metric | Definition | Target Threshold | Dashboard Owner |
|---|---|---|---|
| 4-week retention | Percentage of activated users still active in week 4. | **>= 40%** cohort retention | Product Analytics |
| Reduction in repeated complaint categories | Relative reduction in repeat complaint categories per host over rolling 8 weeks. | **>= 20%** reduction vs. baseline | Customer Success + Data Science |
| Rating trend stabilization for active users | Percentage of active hosts with stable or improving ratings over rolling 12 weeks. | **>= 70%** stable/improving | Customer Success |

## Quality / Trust Metrics

| Metric | Definition | Target Threshold | Dashboard Owner |
|---|---|---|---|
| Model confidence distribution | Distribution of model confidence scores across classifications, monitored for drift and excessive low-confidence output. | **>= 80%** of classifications in medium/high confidence bands; low-confidence band **<= 10%** | ML Engineering |
| Host correction/override rate on classifications | Percentage of model classifications manually corrected or overridden by hosts. | **<= 12%** monthly | ML Engineering + Product |
| False-positive complaint tagging rate from QA review | Share of complaint tags marked as false positives in sampled QA audits. | **<= 5%** per QA cycle | QA / Trust & Safety |

## Governance and Reporting Cadence

- **Cadence:** Weekly operational review and monthly KPI deep dive.
- **Alerting:** Any metric outside threshold for 2 consecutive periods triggers an owner-led action plan.
- **Source of truth:** Central KPI dashboard with drill-downs by cohort, host segment, and market.
