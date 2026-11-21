# 07. Consulting Practice

## 1. Discovery: always first (Question 17)

When processes are disconnected and poorly documented, **start with discovery**:

1. Stakeholder map and **interviews with department leaders**: current processes, pain points, volume, channels, systems.
2. Shadow frontline reps ("day in the life").
3. Collect artefacts: SOPs, org charts, reports, KPIs, existing tools.
4. Define goals and success measures (e.g., reduce AHT 15%, abandon < 5%).
5. Prioritise (MoSCoW), then design, prototype, validate.

**Why not "review documentation after design"?** It's backwards. **Why not prototype on assumptions?** Rework and no buy-in.

## 2. Implementation methodology

| Phase | Activities |
|-------|------------|
| Discover | Interviews, current-state map, requirements |
| Design | Future-state process, data model, security, routing, KPIs |
| Build | Iterative sprints (config first) |
| Test | UAT with real reps and real scenarios |
| Train and deploy | Enablement, cutover, hypercare |
| Adopt and optimise | Measure KPIs, iterate |

## 3. Change management and enablement (Question 2)

Scenario: Cloud Tech Support moves from email-only to Service Cloud with escalation rules and Knowledge; wants minimal downtime and high adoption.

**Recommendation: hands-on training + Trailhead modules aligned to business processes, delivered *before* deployment.**

| Option | Evaluation |
|--------|------------|
| Power users configure and answer questions post-launch, no formal plan | Creates a dependency on a few people; low adoption |
| **Hands-on training + Trailhead aligned to processes before go-live** | Reps arrive competent; supports minimal downtime and high adoption |
| Just-in-time videos *after* go-live | Learning in production, productivity dip, errors |

Add: champions network, sandbox practice, quick-reference guides, in-app guidance (Prompts/Walkthroughs), floor-walkers at launch, adoption dashboards, feedback loop.

## 4. Deployment best practice (Question 10)

| Method | Use |
|--------|-----|
| **Change sets** | Declarative, UI-based, traceable via deployment history; fine for sandbox→production for connected orgs |
| **DevOps Center / SFDX + source control** | Modern best practice for teams: version control, CI/CD |
| **Metadata API/Workbench** | Technical, ad hoc, less governed |
| **Manual recreation** | Error-prone, no traceability |

**Among the given options → change set.** Include dependencies (fields, objects), validate first, deploy in a low-traffic window, then assign permission sets.

## 5. Security and access reminders

- **Profiles + Permission sets**: least privilege. Prefer permission sets/groups.
- **Org-Wide Defaults** → **Role hierarchy** → **Sharing rules** → **Manual**.
- **Knowledge** uses data category visibility (chapter 02).
- **Field-level security** for sensitive fields.

## 6. Design principles to quote

1. Clicks before code.
2. Simple over clever.
3. Measure before and after.
4. Design for scale (LDV).
5. Secure by design.
6. Adoption is a deliverable.

## 7. Question stems and their usual answer patterns

| Stem pattern | Pattern answer |
|--------------|----------------|
| "What should the consultant do first?" | Discovery/requirements gathering |
| "Ensure adoption / minimal downtime" | Training before go-live, aligned to process |
| "Migrate metadata with traceability" | Change set (or source-driven pipeline) |
| "Qualified by product/skill" | Skills-based routing |
| "Real-time monitoring" | Omni Supervisor Wallboard |
| "Phone system integration" | Service Cloud Voice |
| "Different processes and fields per group" | Record types |
| "Customer security for AI agent" | Verification topic and filtered topics |
