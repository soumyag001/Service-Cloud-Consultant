# 11. Additional Consultant Scenarios

Extra scenario questions beyond your original set. Try each one before reading the analysis. The same questions are in the interactive quiz (`quiz.html`), which also shuffles the options.

---

## E01. Entitlements / Milestones

**Scenario:** Premium customers must receive a first response within 1 hour during business hours. Managers want a warning at 45 minutes and an automatic escalation if the SLA is missed. What should the consultant recommend?

- **A.** An escalation rule on the case with a 1-hour age criterion.
- **B.** Entitlement Management with an entitlement process whose milestone has warning and violation actions.
- **C.** A validation rule that blocks saving cases older than 1 hour.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Escalation rules are coarse, age-based rules. They have no per-customer SLA, warning stage or tracker. |
| B | ✅ | Entitlements define the customer's support level, milestones define the clock, and time-trigger actions give warning and violation steps. |
| C | ❌ | A validation rule only fires on save and cannot react to elapsed time. |

---

## E02. Email-to-Case

**Scenario:** A bank's security policy forbids customer emails from being processed outside its own network before reaching Salesforce. Which email option fits?

- **A.** Email-to-Case with the agent installed behind the firewall
- **B.** Web-to-Case with a contact form
- **C.** On-Demand Email-to-Case

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | The agent runs inside the company's network and forwards the processed email to Salesforce. |
| B | ❌ | Web forms are a different channel and do not handle inbound email. |
| C | ❌ | Processes mail in Salesforce, so it does not satisfy the in-network handling rule. |

---

## E03. Knowledge / Channels

**Scenario:** Some Knowledge articles are for agents only, while others are approved for customers on the Experience Cloud site. How should visibility be controlled by audience?

- **A.** Put internal articles in a data category named Internal and hope customers do not browse it.
- **B.** Publish each article to the appropriate channels (Internal App, Customer, Partner, Public Knowledge Base).
- **C.** Create a separate Salesforce org for customers.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Security by naming is not security. Visibility must be configured. |
| B | ✅ | Channels determine who can see a published article, and data categories refine access further. |
| C | ❌ | Massive overkill and breaks the single source of truth. |

---

## E04. Data skew / Ownership

**Scenario:** An integration user owns 2 million cases. Changing the integration user's role now takes hours and parallel loads fail with lock errors. What is the issue and the best fix?

- **A.** Lookup skew. Replace the lookup with a text field.
- **B.** Ownership skew. Distribute ownership across multiple users, and keep a required integration owner at the top of the role hierarchy outside public groups used in sharing rules.
- **C.** Parent-child skew. Delete the child records.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Lookup skew concerns many records pointing to one lookup target, not record ownership. |
| B | ✅ | One owner with more than 10,000 records causes slow sharing recalculation and locks. Spread owners, and isolate unavoidable ones at the top of the hierarchy. |
| C | ❌ | Deleting data is not a design fix, and the problem is owner concentration. |

---

## E05. Data skew / Lookup

**Scenario:** During a Bulk API load, 50,000 cases all reference one placeholder 'Unknown Product' record and the job fails with UNABLE_TO_LOCK_ROW. What should the consultant do?

- **A.** Spread the cases across multiple placeholder records and load in serial mode.
- **B.** Disable the Case object's sharing settings.
- **C.** Increase concurrency so more batches finish before locks time out.

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | This is lookup skew. Reduce concentration on one target and avoid concurrent locks with serial mode. |
| B | ❌ | Not possible in that way, and sharing is not the cause. |
| C | ❌ | More parallelism creates more contention on the same locked record. |

---

## E06. Query performance

**Scenario:** A report on a 30-million-row Case object filtered by Status not equal to Closed times out. What is the best first fix?

- **A.** Ask users to run the report only at night.
- **B.** Rewrite the filter to be selective and indexable (for example a CreatedDate range and equals filters).
- **C.** Add more columns so the report gives more context.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Scheduling hides the symptom and the report may still time out. |
| B | ✅ | Negative operators prevent index use. Selective filters let the optimizer use an index, and skinny tables or custom indexes can follow. |
| C | ❌ | More columns make the query heavier. |

---

## E07. Bulk API / PK chunking

**Scenario:** A data warehouse must extract 40 million Case records and plain queries time out. What should be used?

- **A.** REST API query in a loop with LIMIT 2000.
- **B.** Bulk API query with PK chunking.
- **C.** Data Import Wizard export.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Thousands of calls, slow, and still hits query limits. |
| B | ✅ | PK chunking splits the query by Id ranges into smaller parallel queries and avoids timeouts. |
| C | ❌ | The Import Wizard imports data. It is not an extraction tool. |

---

## E08. Truncation

**Scenario:** A custom staging object holds 5 million obsolete rows that must be removed quickly and permanently, with no need to recover them. What is the most efficient method?

- **A.** Delete rows 200 at a time from the list view.
- **B.** Export, edit and re-import blank rows.
- **C.** Truncate the custom object.

**Answer: C**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Far too slow. |
| B | ❌ | Does not delete records. |
| C | ✅ | Truncate permanently removes all records of a custom object quickly, bypassing the Recycle Bin (check preconditions first). |

---

## E09. Omni-Channel / Routing

**Scenario:** Spanish-speaking customers must reach Spanish-speaking reps, but if none are online the work must not sit forever. What should the consultant design?

- **A.** An escalation rule that reassigns after 24 hours.
- **B.** A flow with Route Work using a Spanish skill requirement and a fallback queue.
- **C.** A single queue shared by all reps.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Too slow and not a routing solution. |
| B | ✅ | Skills match the language, and the fallback queue covers the case where no qualified agent is available. |
| C | ❌ | Ignores the language requirement. |

---

## E10. Omni-Channel / Capacity

**Scenario:** Reps should be able to handle up to 5 chats at once, but while on a phone call they must receive no other work. What configuration achieves this?

- **A.** Give voice a capacity weight equal to the agent's total capacity and give chat a smaller weight.
- **B.** Create five presence statuses.
- **C.** Create a queue for each rep.

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Capacity weights per channel. A voice call that consumes all capacity blocks other work. |
| B | ❌ | Statuses mark availability. They do not set per-work capacity. |
| C | ❌ | Queues hold work. They do not control concurrency. |

---

## E11. Omni Supervisor

**Scenario:** A supervisor wants to see which queues have waiting work and how long the oldest item has waited. Where should they look?

- **A.** Case History related list
- **B.** Knowledge Home
- **C.** Queue Backlog tab and the Wallboard

**Answer: C**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Per-record audit history, not queue-level real time. |
| B | ❌ | Article metrics, not work queues. |
| C | ✅ | Both show queue-level backlog and wait metrics in real time. |

---

## E12. Productivity / Macros

**Scenario:** Reps spend several minutes on each closure: select the email action, insert a template, set status to Closed and add a note. Which is the best-fit improvement?

- **A.** A new case page layout.
- **B.** A macro that performs those steps in one click in the console.
- **C.** A validation rule.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Layouts arrange fields and do not automate actions. |
| B | ✅ | Macros chain several UI-level steps (quick action, text, field update) for a rep to run with one click. |
| C | ❌ | Prevents saving bad data. Does not speed up repetitive steps. |

---

## E13. Voice

**Scenario:** A client wants to keep its existing telephony carrier but get Voice features such as transcripts and Omni routing inside Salesforce. What should the consultant explore?

- **A.** Service Cloud Voice with partner telephony (bring your own telephony)
- **B.** Lightning Dialer
- **C.** Email-to-Case

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Voice supports integration with supported partner telephony providers as well as Amazon Connect. |
| B | ❌ | Sales outbound dialing, not service telephony. |
| C | ❌ | A different channel. |

---

## E14. CRM Analytics

**Scenario:** Executives want dashboards blending Salesforce case data with external billing data, with predictive insight and exploration across millions of rows. What should be recommended?

- **A.** CRM Analytics
- **B.** A spreadsheet maintained by the support team
- **C.** Standard reports and dashboards

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | CRM Analytics handles large datasets, external data, transformation and Einstein Discovery. |
| B | ❌ | Manual, error-prone and unscalable. |
| C | ❌ | Good for operational reporting on live Salesforce data. Limited for external data blending and prediction. |

---

## E15. Reporting

**Scenario:** A director wants to know how many cases were in Escalated status at the end of each of the last six months. Which tool?

- **A.** Cases with Milestones report
- **B.** Historical Trending reports
- **C.** Case Lifecycle report

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Shows SLA performance. |
| B | ✅ | Historical Trending captures snapshots of selected fields so you can compare values over time. |
| C | ❌ | Shows how long cases were with each owner, not status counts at points in time. |

---

## E16. Swarming / Slack

**Scenario:** Major outage cases need network, billing and product experts working together quickly, with the discussion tied to the case record. What should the consultant recommend?

- **A.** Slack swarming with a swarm channel created from the case
- **B.** A weekly email digest
- **C.** More assignment rules

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Swarming pulls experts into a Slack channel linked to the case so they collaborate immediately. |
| B | ❌ | Too slow for urgent work. |
| C | ❌ | Routing does not create collaboration. |

---

## E17. Agentforce

**Scenario:** An AI service agent may issue refunds, but never above 50 dollars without a human. How should the limit be enforced?

- **A.** Implement the refund as a flow action that enforces the limit and hands off to a human above it.
- **B.** Tell customers about the limit in the greeting.
- **C.** Write 'never refund more than 50 dollars' in the topic instructions only.

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Deterministic logic in the action is enforceable and auditable, with instructions as reinforcement. |
| B | ❌ | Does not enforce anything. |
| C | ❌ | Instructions guide the model but are not a hard guardrail. |

---

## E18. Data migration

**Scenario:** Migrating 10 million historical cases must preserve original CreatedDate and CreatedBy values. What is required?

- **A.** Create records normally and edit the dates later.
- **B.** Use Bulk API or Data Loader with the Set Audit Fields upon Record Creation permission.
- **C.** Use the Data Import Wizard.

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Audit fields cannot be edited afterwards through the UI. |
| B | ✅ | That permission lets an integration set audit fields on insert. |
| C | ❌ | Not suited to this volume and cannot set audit fields. |

---

## E19. Environments / Testing

**Scenario:** The team must performance-test routing and reports with production-like data volume before go-live. Which sandbox?

- **A.** Developer sandbox
- **B.** Full sandbox
- **C.** Developer Edition org

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Small data storage and no production data. |
| B | ✅ | A Full sandbox copies production data and metadata, so volume and performance can be tested realistically. |
| C | ❌ | A free org with sample data, not representative. |

---

## E20. Web-to-Case

**Scenario:** The public Web-to-Case form is flooded by spam, filling the queue. What should the consultant do?

- **A.** Remove the form and force phone-only support.
- **B.** Increase queue capacity.
- **C.** Add reCAPTCHA to the form and filter or review suspicious cases.

**Answer: C**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Overreaction that hurts customers. |
| B | ❌ | Treats the symptom and lets spam consume real capacity. |
| C | ✅ | Bot protection at the entry point keeps real customers able to submit. |

---

## E21. Escalation rules

**Scenario:** High-priority cases still open after 4 business hours must be reassigned to a senior queue and the manager notified. Which feature?

- **A.** Page layout
- **B.** Case escalation rule using business hours
- **C.** Case validation rule

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Layouts do not automate. |
| B | ✅ | Escalation rules evaluate age against business hours and can reassign and notify. |
| C | ❌ | Fires on save, not on elapsed time. |

---

## E22. Console / Productivity

**Scenario:** Reps constantly switch between a case, the customer's account, knowledge articles and notes in separate browser tabs. What improves their efficiency?

- **A.** Lightning Service Console with workspace tabs, split view and a utility bar
- **B.** Printing the case
- **C.** Adding more fields to the case layout

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Console navigation keeps related records and tools in one workspace. |
| B | ❌ | Not a systems answer. |
| C | ❌ | More fields increase clutter and do not fix navigation. |

---

## E23. Surveys / CSAT

**Scenario:** The company wants to send a satisfaction survey automatically when a case is closed and report the results. What is the best approach?

- **A.** Ask reps to email a Word document.
- **B.** Add a text field for reps to type scores.
- **C.** Use Salesforce Surveys (Feedback Management) triggered by a flow on case closure.

**Answer: C**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Manual and unreliable. |
| B | ❌ | Reps entering scores is not customer feedback. |
| C | ✅ | Automated, standard, and reportable. |

---

## E24. Knowledge / Data categories

**Scenario:** A new Support Agent role must see only articles in Products > Hardware, including its sub-categories, and nothing else in the Products group. What visibility setting?

- **A.** None
- **B.** Custom visibility with Hardware selected
- **C.** All Categories

**Answer: B**

| Option | Verdict | Why |
|---|---|---|
| A | ❌ | Shows nothing in the group. |
| B | ✅ | Selecting the parent category gives access to its children, and other categories stay hidden. |
| C | ❌ | Shows everything in the group. |

---

## E25. Project scoping

**Scenario:** Stakeholders request 40 features for go-live but the budget and timeline support about 15. What should the consultant do?

- **A.** Prioritise with the stakeholders (for example MoSCoW), deliver a minimum viable release and phase the rest.
- **B.** Agree to everything and ask the team to work faster.
- **C.** Pick the 15 features without consulting anyone.

**Answer: A**

| Option | Verdict | Why |
|---|---|---|
| A | ✅ | Aligns delivery to business value and keeps expectations realistic. |
| B | ❌ | Creates quality, timeline and adoption risk. |
| C | ❌ | Skips stakeholder buy-in. |

