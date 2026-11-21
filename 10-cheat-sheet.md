# 10. Cheat Sheet

## Pick-the-feature table

| Requirement | Use | Not |
|-------------|-----|-----|
| Different processes/picklists per group | Record Types + Support Process | Dynamic Forms, Omni |
| Show/hide fields conditionally | Dynamic Forms | Record types |
| Enforce data state on save | Validation rule | Assignment rule |
| Route case on create | Assignment rule / Omni | Escalation rule |
| Time-based reassignment | Escalation rule | |
| SLA clocks | Entitlements + Milestones | |
| Automatic field capture | Flow | Macro, Bot |
| One-click multi-step agent action | Macro (console) | |
| Real-time manager metrics | Omni Supervisor Wallboard | Assigned Work tab |
| Qualified agents (product/language) | Skills-based routing | Capacity/queue only |
| Complex multichannel routing | Omni-Flow | |
| Phone integration | Service Cloud Voice | Lightning Dialer, Softphone Layout |
| Reduce abandoned calls | Callbacks / contact requests | Swarming, assignment rules |
| Surge impact KPIs | Abandon rate, ASA | FCR, CSAT |
| Time per owner/team | Case Lifecycle | Historical Trending, Milestones |
| Segregate article access | Data category visibility | Sharing rules |
| Secure AI agent actions | Verification topic + filter | Instructions alone |
| Deploy permission sets | Change set (or DevOps Center) | Manual recreate |
| First step in a project | Discovery interviews | Prototype, build |
| Large extraction timing out | Bulk API + PK chunking | Plain SOQL |
| Lock errors on massive loads | Serial Bulk, fix skew | More parallelism |
| Slow query on huge object | Selective filter, custom index, skinny table | Negative filters |

## Numbers to remember

| Item | Value |
|------|-------|
| Skew threshold | >10,000 records on one owner/parent/lookup |
| Data category groups | 5 active, 8 levels, ~100 categories per group |
| Standard index selectivity | 30% of first 1M, then 15% (cap ~1M) |
| Custom index selectivity | 10% of first 1M, then 5% (cap ~333k) |
| Trigger non-selective query error | >200,000 records |
| PK chunk size | default 100,000, max 250,000 |
| Skinny table | ~100 columns, one object, via Support |
| Query timeout | ~2 minutes |

## Omni quick map

`Work item → Service Channel → Routing (queue / skills / flow) → Presence + Capacity → Agent → Supervisor monitors (Wallboard)`

## Knowledge quick map

`Draft → Publish (channels) → Classified by Data Categories → Visibility by Role → Attached to Case → Metrics → Improve`

## Voice quick map

`Phone → Amazon Connect/Partner → Voice Call record → Omni routing → Agent (transcript, Case) → Callback if busy`

## LDV quick map

`Skew (owner/parent/lookup) → locks + recalcs → distribute · serial load · picklist`
`Slow query → selective + index + skinny table → Bulk + PK chunk`
`Cleanup → Truncate (custom, irreversible) / archive`

## Pre-exam checklist

- [ ] I can explain every wrong option in Chapter 08.
- [ ] I can sketch each quick map from memory.
- [ ] I built the capstone.
- [ ] I can state three trade-offs for each recommendation I make.
