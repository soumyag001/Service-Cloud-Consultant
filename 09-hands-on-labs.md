# 09. Hands-on Labs Index

Do these in a **Developer Edition** or sandbox. Tick as you go.

| Order | Lab | Chapter | Done |
|-------|-----|---------|------|
| 1 | Create case record types, support processes, page layouts | 01 §4 | ☐ |
| 2 | Validation rule: closed case must have user owner | 01 §3 | ☐ |
| 3 | On-Demand Email-to-Case routing address | 01 §5 (Lab 1.1) | ☐ |
| 4 | Entitlement + Milestones + Milestone Tracker | 01 §6 (Lab 1.2) | ☐ |
| 5 | Macro: resolve and send closure email | 01 §7 (Lab 1.3) | ☐ |
| 6 | Knowledge + Data categories + role visibility | 02 §5 (Lab 2.1) | ☐ |
| 7 | Omni-Channel skills + Omni flow routing | 03 §3 (Lab 3.1) | ☐ |
| 8 | Omni Supervisor Wallboard with flags | 03 §6 (Lab 3.2) | ☐ |
| 9 | Service Cloud Voice (sandbox/trial) and callbacks | 04 (Labs 4.1, 4.2) | ☐ |
| 10 | Swarming with Slack | 05 (Lab 5.1) | ☐ |
| 11 | CRM Analytics Service Analytics template | 05 (Lab 5.2) | ☐ |
| 12 | Agentforce verification topic + filter | 05 (Lab 5.3) | ☐ |
| 13 | LDV: skew, Query Plan, Bulk API, PK chunking, truncate | 06 (Lab 6.1) | ☐ |
| 14 | Deploy a permission set by change set | 07 §4 | ☐ |

## Capstone project: "Sunrays Limited"

Build an end-to-end org that meets these requirements:

1. Two business groups (Retail, Enterprise) with different case record types/processes.
2. Email-to-Case + web-to-case feeding a skills-based Omni flow (skill = product).
3. Premium customers get a 1-hour First Response milestone with warning/violation actions.
4. Knowledge with a `Division` category group; reps in each division see only their articles.
5. A macro for the 5 most common replies.
6. Closed cases must have a user owner.
7. Supervisor Wallboard with a flag at 5-minute wait.
8. A Service Analytics dashboard on the home page.
9. Deploy the permission sets to a second org via change set.

Write a 1-page design doc for each decision explaining *why this over alternatives*. That is the real exam and interview skill.
