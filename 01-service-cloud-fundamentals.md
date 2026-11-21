# 01. Service Cloud Fundamentals

## 1. First concepts

**Service Cloud** is Salesforce's customer-service platform. Its spine is the **Case**: a record of one customer issue. Around the case sit: channels (email, web, phone, chat, messaging), routing, knowledge, SLAs (entitlements/milestones), productivity tools (console, macros, quick text) and analytics.

### The case lifecycle

```
Customer contacts you → Case created (email, web, phone, chat, manual)
  → Assigned (assignment rule / Omni-Channel / flow) → Worked by a rep
  → Escalated if needed (escalation rule / milestone / swarm)
  → Resolved with Knowledge → Closed → Reported on
```

### Core objects

| Object | Purpose |
|--------|---------|
| Account / Contact | Who the customer is |
| Case | The issue |
| Case Comment / Email Message / Case Feed | Communication history |
| Queue | A shared owner (group of reps) for cases |
| Entitlement / Service Contract / Milestone | Which support the customer is owed and the SLA clocks |
| Knowledge article | Reusable answer |
| Messaging Session / Voice Call / Live Chat Transcript | Channel records |

## 2. Case ownership: users and queues

A case owner is **either a user or a queue**. Queues are lists of reps who can *pull* a case ("Accept") or have it pushed by Omni-Channel.

**Rule of thumb:** a *closed* case should be owned by a *person*. Reports on "cases closed per rep" break if closed cases remain queue-owned (see Question 8).

## 3. Assignment rules vs. escalation rules vs. validation rules

| Feature | Fires when | Does what | Cannot do |
|---------|-----------|-----------|-----------|
| **Case Assignment Rule** | Case is created (or edited with "assign using active rule" checked) | Sets the owner (user/queue) by criteria | Guarantee a field state at closing; it routes, it does not validate |
| **Escalation Rule** | A case meets time-based criteria (e.g., open > 4 hours, not closed) | Reassigns, notifies, changes owner | Run in real time; evaluates on a schedule, based on business hours |
| **Validation Rule** | Every save | Blocks the save with an error if the formula is true | Route or notify |
| **Flow** | Record-triggered, scheduled, screen, or from Omni | Anything declarative | (Use it when rules aren't enough) |

### Validation rule: "closed case must have a user owner"

```
AND(
  IsClosed,
  LEFT(OwnerId, 3) = "00G"   /* 00G = Group/Queue key prefix */
)
```
Error message: *"Reassign this case to a person before closing."*

**Caveat:** existing closed cases already owned by queues will fail on their next edit. Clean them up first (Data Loader or Mass Transfer) and then deploy the rule.

## 4. Record Types, Page Layouts, Dynamic Forms, Support Processes

Use this when two business groups need **different processes and fields**.

| Need | Feature |
|------|---------|
| Different picklist values (Status, Priority, Reason) per group | **Record Type** + **Support Process** (case status values) |
| Different fields/sections shown | Page Layout per record type, **or** Dynamic Forms (field visibility rules on the Lightning page) |
| Different routing | Assignment rule or flow entry criteria on record type |
| Different SLAs | Entitlement process chosen by record type or entitlement |

**Why not Dynamic Forms alone?** Dynamic Forms controls *which fields appear*; it cannot give a different status picklist or support process. **Why not Omni-Channel?** It routes work; it doesn't define the data model.

## 5. Case creation channels

### Email-to-Case (two flavours)
| | **Email-to-Case (agent)** | **On-Demand Email-to-Case** |
|---|---|---|
| Runs | Software on your own server behind your firewall | Entirely in Salesforce |
| Use when | Strict rule that mail never leaves your network | Almost everyone else |
| Setup | Install agent, configure `sfdcEmailAgent.cfg` | Routing address + verify; no install |
| Limits | Large attachments possible via agent | Size limit around 25 MB total attachments/message |

**On-Demand Email-to-Case flow**
1. Customer mails `support@company.com`, which forwards to a Salesforce-generated address.
2. Salesforce (Email Services/Apex handler) creates a **Case** and an **Email Message**, matches/creates **Contact** by sender, and applies **Thread ID** (`ref:_00D...:ref`) so replies attach to the same case.
3. Auto-response rules and assignment rules fire.

**Hands-on (Lab 1.1):** Setup → *Email-to-Case* → enable → create a **Routing Address** (name, email, case priority/origin, record type, "Save Email Headers") → verify via the link emailed to the address → send a test email → confirm Case and Email Message.

**Trap:** forgetting to verify the routing address (nothing happens), or ignoring that bounced messages from "no-reply" senders can loop. Enable "Accept emails from unknown senders" cautiously.

### Web-to-Case
HTML form posts to Salesforce (up to 5,000 cases/day by default, then queued). Add CAPTCHA/reCAPTCHA for spam control.

### Others
Phone (Service Cloud Voice), Chat/Messaging (Enhanced messaging channels), Experience Cloud, Social, Manual.

## 6. Entitlements and Milestones (SLAs)

### Concepts
- **Entitlement**: *what support* a customer is owed (e.g., "Premium: 24x7, 1h first response"), usually attached to an Account (or Contact/Asset/Service Contract).
- **Service Contract / Contract Line Item**: commercial agreement that can sit above the entitlement.
- **Business Hours**: when the clock runs.
- **Entitlement Process**: the SLA template containing **Milestones**.
- **Milestone**: a required step with a time limit (e.g., "First Response in 60 minutes", "Resolution in 8 hours").
- **Milestone actions** (time-based): *Success* (completed in time), *Warning* (nearing violation, e.g., 15 minutes before), *Violation* (missed).
- **Milestone Tracker** (component on the case record) shows the countdown to the rep.

### Flow of a milestone
```
Case created → Entitlement found (default or via flow/auto) → Entitlement Process starts
  → Milestone 1 timer starts (First Response, 60 min, business hours)
     ├─ at 45 min: Warning action (email manager)
     ├─ rep sends email (criteria met) → Success action, milestone complete
     └─ at 60 min: Violation action (field update: Escalated = true, reassign)
  → Milestone 2 starts ...
```

### Hands-on (Lab 1.2)
1. Setup → *Entitlement Settings* → enable Entitlement Management.
2. Add **Entitlement Name**, **Milestones** related list and **Milestone Status/Tracker** to case layouts/Lightning page.
3. Create **Milestone** records (e.g., First Response; recurrence = none).
4. Create an **Entitlement Process** (type Case, set Business Hours, add milestones, set "time trigger" actions: warning at 45 min, violation at 60 min).
5. Create an **Entitlement** on an Account referencing the process; create a Case on a Contact of that Account.
6. Watch the tracker; complete the milestone via "Complete" button or a criteria such as *Email sent*.

**Trap:** Milestones report (*Cases with Milestones*) tells you *SLA compliance*, **not** how long each team owned a case. That need is **Case Lifecycle / ownership history** (see Question 12).

## 7. Macros (productivity)

**What:** a macro is a saved set of instructions executed by one click in the **Lightning Console** (e.g., "Send Welcome Email": select Email quick action → insert template → set Status → insert quick text → submit).

**Rules:**
- Available in **Lightning console apps**.
- Macro instructions can: select a quick action, set field values, insert text into rich text, use quick text, **run a Flow** (flows can be used for logic that macros can't do), clear/update.
- Permissions: *Run Macros* (users), *Manage Macros* (builders).
- Add the **Macros** utility to the utility bar.
- Can be shared via folders and run on a **record** (case). Macros can run also on multiple records in some contexts (bulk macros for list views in console).

### Hands-on (Lab 1.3)
1. Setup → *Macro Settings* → enable.
2. Add the *Macros* utility to your console app utility bar (App Manager → edit app → Utility Items).
3. App Launcher → Macros → New → Name "Resolve and Send Closure Email".
4. Instructions: Select Quick Action *Email*, set Status = Closed through *Update Field*, insert quick text/template, submit.
5. Open a case in the console, open Macros utility, click the macro, review, run.

**Exam trap:** Macro vs Flow. Macro = *agent-initiated, UI-level, console-only, interactive*. Flow = *server-side automation*, can run without a UI. In **Question 1**, "set a custom field on a messaging session based on URL" is a back-end automation and the answer is a **Flow**, not a macro.

## 8. Service Console and Productivity quick list

| Tool | Value |
|------|-------|
| Lightning Service Console | Multi-tab workspace, split view |
| Utility bar | Persistent tools: Omni-Channel, History, Notes, Macros, Softphone |
| Quick Actions / Quick Text | Fast logging and email snippets |
| Next Best Action / Einstein | Recommendations |
| Case Feed | Chronological case communication |
| Knowledge component | Search/attach articles from the case |

## 9. Exam traps

- Assignment rule ≠ validation rule: only validation *enforces* data state.
- Escalation rule ≠ milestone: escalation rules are coarse and rule-based on case age; milestones are SLA-grade and per-entitlement.
- Record Types are for **processes and picklists**; Dynamic Forms only for **field visibility**.
- On-Demand Email-to-Case is the default recommendation unless the client demands in-house mail handling.
