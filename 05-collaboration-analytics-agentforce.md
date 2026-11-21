# 05. Collaboration, Analytics, and Agentforce

## 1. Swarming and Slack

### First concepts
**Swarming** = pulling the right internal experts together *immediately* around a case, instead of escalating linearly. Salesforce supports it with **Slack** integration ("Service Swarming" / "Swarm").

- **Swarm record**: Salesforce record linking a Case (or other record) to a **Slack channel** (the **swarm channel**).
- **Swarm Request**: agent asks for help; experts accept/decline.
- **Slack channel** is created with the case context; experts join, discuss, share, and resolve; outcomes can be posted back to the case.

### Why use it
- Complex or high-severity issues needing multiple specialists
- Reduces handoffs and escalations; faster resolution
- Keeps the discussion tied to the case record (audit trail)

### How swarming flows
```
Rep opens Case → "Swarm" action → Selects experts/reason
 → Swarm record created + Slack channel (#case-12345) created
 → Experts notified in Slack → join, collaborate
 → Resolution posted → Case updated/closed → Channel archived
```

### Hands-on (Lab 5.1: Setup, high level)
1. Have a Slack workspace (free is enough to learn; some features require paid Slack).
2. In Salesforce: Setup → **Slack** settings → connect the workspace; install the **Salesforce app for Slack**.
3. Enable **Service Swarming**; assign permission sets to agents/experts.
4. Add the **Swarm** component/action to the Case Lightning page.
5. Optionally create **Swarm Skills**/expert routing: experts defined by **skills** so the swarm can suggest the right ones.
6. Test by swarming a test case and confirm the channel is created and Slack notifications arrive.

**Exam trap:** Swarming improves *internal collaboration and resolution speed*. It does **not** fix customer-facing queue abandonment (Question 15).

## 2. Reports, Dashboards, and the "which report" question

| Need | Report/feature |
|------|----------------|
| How long each case is owned by each team | **Case Lifecycle** (ownership/lifecycle history; built on case history/owner history) |
| Compare a case's field values **over time** (snapshots) | **Historical Trending** (requires enabling, up to a few fields) |
| SLA compliance by milestone | **Cases with Milestones** |
| Agent throughput | Cases by Owner, Closed cases by owner |
| Knowledge effectiveness | Articles with cases / Article views and ratings |
| Wait times, capacity | Omni-Channel **Supervisor**, **Omni-Channel Usage** reports |

**Question 12 reasoning:** "track how long each case is owned by each team before it gets resolved" = time per owner/team across the case life ⇒ **Case Lifecycle**. *Historical Trending* shows how field values changed between *snapshots* (not duration by owner). *Cases with Milestones* addresses SLA clocks.

## 3. CRM Analytics (Tableau CRM)

**CRM Analytics** is the advanced analytics layer on Salesforce data.

| | Reports & Dashboards | CRM Analytics |
|---|---|---|
| Data | Live Salesforce objects | Datasets (Salesforce + external), refreshed via sync/recipes |
| Volume | Moderate | Very large |
| Joins/Transformations | Limited | Recipes, dataflows, SAQL |
| Interactivity | Filters | Faceting, lenses, predictive/Einstein Discovery |
| Use | Operational reporting | Strategic analysis, trends, predictions |

**Core objects:** *Connected data (Data Manager) → Dataset → Lens (exploration) → Dashboard → App.* **Service Analytics** is a prebuilt app template (Service KPIs: backlog, CSAT, FCR, SLA, agent productivity) you create from templates.

### Hands-on (Lab 5.2)
1. Enable CRM Analytics (licence/permission sets: *CRM Analytics Platform Admin/User*).
2. Analytics Studio → Create → App → choose **Service Analytics** template → follow wizard.
3. Open the generated dashboards; apply a filter by queue; create a lens on Cases by Product.
4. Embed a dashboard on the Service Console home page.

**When to recommend CRM Analytics:** cross-object joins, large data, trend/prediction, executive dashboards. **When not:** a simple list or summary report suffices.

## 4. Agentforce Service Agent: securing customer data (Question 9)

**Agentforce Service Agent** is an AI agent that handles customer service conversations. It is built from **Topics** (jobs-to-be-done), each with **Instructions** and **Actions** (flows, Apex, prompts).

- **Case Management** topic: view/modify cases.
- **Service Customer Verification** topic: authenticates the customer (e.g., confirm email/code) before sensitive actions.
- **Topic filters/conditions**: make a topic available only when a variable (e.g., `Verified = true`) is satisfied.

**Recommended pattern:** implement **Service Customer Verification** topic and **filter Case Management** so it is available only after verification.

Why that over others:
- *"Exact instructions + custom actions"* in Case Management relies on the LLM following text; instructions alone are not a security control.
- *Custom verification action inside Case Management* embeds auth in the same topic; weaker separation, harder to enforce that sensitive actions can't run unverified. A dedicated topic plus filter gives **deterministic gating**.

### Hands-on (Lab 5.3, Agentforce Builder)
1. Enable Agentforce and Einstein generative AI; create a **Service Agent**.
2. Add topic **Service Customer Verification** (with its verification action/flow).
3. Add topic **Case Management** (actions: Get Case, Update Case).
4. Add a **filter** on Case Management: available when `VerifiedCustomerId` is not null.
5. Test in the Builder (preview): try "update my case" unverified (should be blocked/prompt verify), then verify and retry.

## 5. Exam traps

- **Swarming ≠ queue callback.**
- **Historical Trending ≠ ownership duration.**
- **Instructions are not security.** Use topic filters/verification.
- **Reports first, CRM Analytics when scale/complexity demands it.**
