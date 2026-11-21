# 08. Scenario Question Bank (with option-by-option analysis)

Method for each question: **(1) extract the requirement, (2) spot the decisive keyword, (3) test each option, (4) state why the answer wins and why the others lose.**

Note: Questions 5 and 14 are the same question and appear once as **Q5/Q13**.

---

## Q1. Custom field on Messaging Session from the originating URL

**Requirement extraction:** automatic; data is technical context (URL); target is a *Messaging Session* field.
**Answer: Use a Flow.**

| Option | Verdict | Why |
|--------|---------|-----|
| **Flow** | ✅ | Declarative back-end automation; can read the URL context passed in the deployment and update the field, can run during routing or on record creation |
| Macro | ❌ | Needs a rep to click it in the console; not automatic; wrong layer |
| Einstein Bot | ❌ | Designed to converse with customers; not a reliable silent data-capture mechanism, and not every session involves a bot |

Related: chapter 03 §4, chapter 01 §7.

---

## Q2. Preparing email-only reps for Service Cloud

**Keywords:** *minimal downtime*, *high adoption*, *prepare*.
**Answer: Hands-on training + Trailhead aligned to business processes, before deployment.**

| Option | Verdict | Why |
|--------|---------|-----|
| Power users configure and answer questions, no formal plan | ❌ | Key-person dependency; adoption left to chance |
| **Hands-on + Trailhead before go-live** | ✅ | Competence on day one; process-aligned learning |
| JIT videos after go-live | ❌ | Reps learn in production; productivity dip and errors; "prepare" means before |

Related: chapter 07 §3.

---

## Q3. Real-time manager dashboard: Agent Capacity Status, Avg/Longest Wait, Flags

**Answer: The Wallboard tab.**

| Option | Verdict | Why |
|--------|---------|-----|
| **Wallboard** | ✅ | Real-time summary metrics incl. capacity status, wait times, flags |
| Assigned Work tab / Work Summary | ❌ | Lists current work items and per-agent assignments, not the summary dashboard |
| Service Reps tab / All Agents | ❌ | Shows individual agents' presence/capacity, not queue wait metrics or flags |

Related: chapter 03 §6.

---

## Q4. Organising hundreds of Knowledge articles into data categories

**Answer:** Create a **logical hierarchy based on how users search/access articles**, use **category groups for distinct classification criteria** (product, topic, region), and use **category visibility** to control access.

Points to extract and why:
1. **Hierarchy follows user search behaviour** → findability and adoption.
2. **One group per dimension** → clean filtering, only 5 active groups so plan them.
3. **Visibility** → the security control for articles.
4. Keep depth modest (limit 8 levels).
5. Visibility cascades down.

Related: chapter 02 §3.

---

## Q5/Q14. Three divisions; each sees only its own Knowledge articles in search

**Requirement:** compliance; segregated *search access* by division.
**Answer: Create a data category group (division categories) and give access through the role hierarchy (category visibility by role).**

| Option | Verdict | Why |
|--------|---------|-----|
| **Data category group(s) with access by role hierarchy** | ✅ | Data category visibility is *the* mechanism that restricts which articles a user can find; assigned by role |
| Sharing rule for each division based on article category | ❌ | Sharing rules grant record access; they do not drive Knowledge article visibility by category |
| Sharing rule for each division using the role hierarchy | ❌ | Same reason; and roles alone don't classify articles |

Related: chapter 02 §4.

---

## Q6. Multi-channel expansion, product-certified reps, consistent experience

**Keywords:** *product line certifications* (skills), *multiple channels*, *consistent experience* (flow-based routing).
**Answer: Omni-Channel with Omni-Flow Routing and Skills.**

| Option | Verdict | Why |
|--------|---------|-----|
| **Omni-Flow + Skills** | ✅ | Matches work to certified agents and reuses one routing logic across channels |
| Capacity-based routing | ❌ | Controls *how much* work an agent holds; doesn't match qualification |
| Queue-based routing | ❌ | Needs a queue per skill/product combination; hard to maintain and scale across channels |

Related: chapter 03 §2.

---

## Q7. Surges in call volume: which KPIs show the impact on internal metrics?

**Answer: Abandon rate and average speed to answer.**

| Option | Verdict | Why |
|--------|---------|-----|
| First call resolution + cases per hour | ❌ | Quality/productivity; not directly moved by volume spikes |
| After-call work time + customer effort score | ❌ | Post-call effort and experience |
| **Abandon rate + ASA** | ✅ | Surges lengthen waits → more hang-ups; both measure queue-level service under load |

Related: chapter 04 §5.

---

## Q8. Hundreds of closed cases still owned by a queue; inaccurate rep performance reports

**Requirement:** fix existing data **and** prevent recurrence.
**Answer: Create a case validation rule so cases must be owned by a user when closed.**

| Option | Verdict | Why |
|--------|---------|-----|
| Data Loader periodically to assign to a default owner | ❌ | Manual, recurring, puts performance credit on a fake owner (and creates ownership skew) |
| **Validation rule** | ✅ | Enforces the rule at every save; prevents the problem permanently |
| Case assignment rule | ❌ | Fires on creation/edit with the flag; routes cases but doesn't block closing |

Implementation note: clean up the existing hundreds of cases first (one-time mass update), then activate the rule. Formula in chapter 01 §3.

---

## Q9. Agentforce Service Agent: secure customer access to their cases

**Answer: Service Customer Verification topic with a filter on the Case Management topic.**

| Option | Verdict | Why |
|--------|---------|-----|
| Case Management with exact instructions + custom actions | ❌ | Instructions guide the LLM, not enforce security |
| **Verification topic + filter on Case Management** | ✅ | Deterministic gating: Case Management is unavailable until verification succeeds |
| Case Management with a custom verification action | ❌ | Mixes authentication into the same topic; no hard gate on other actions |

Related: chapter 05 §4.

---

## Q10. Migrating tested permission sets sandbox → production with traceability

**Answer: Outbound change set.**

| Option | Verdict | Why |
|--------|---------|-----|
| Metadata API via Workbench | ❌ | Ad hoc, less governed, harder to trace |
| **Change set** | ✅ | Standard, supported, logged in deployment history; validates before deploy |
| Manual recreation | ❌ | Error-prone, untraceable |

Remember: with source-driven teams, DevOps Center/CI is the modern equivalent. Related: chapter 07 §4.

---

## Q11. Integrating a client's phone system with Salesforce

**Answer: Service Cloud Voice.**

| Option | Verdict | Why |
|--------|---------|-----|
| Softphone Layout | ❌ | Page layout for a CTI softphone UI; not an integration |
| Lightning Dialer | ❌ | Sales-oriented outbound dialing |
| **Service Cloud Voice** | ✅ | Telephony integration with Omni routing, transcription, Case linking |

Related: chapter 04 §1.

---

## Q12. Track how long each case is owned by each team before resolution

**Answer: Case Lifecycle report.**

| Option | Verdict | Why |
|--------|---------|-----|
| Cases with Historical Trending | ❌ | Snapshot comparison of field values over time, not duration by owner/team |
| **Case Lifecycle** | ✅ | Duration across the case's life by owner/team |
| Cases with Milestones | ❌ | SLA clock compliance, not ownership time |

Related: chapter 05 §2.

---

## Q13. Retail company: modernise legacy on-premises contact center

**Keywords:** costly, hard to scale, new digital channels, reduce overhead, seasonal scale, real-time insights.
**Answer: Salesforce Contact Center with Amazon Connect.**

| Option | Verdict | Why |
|--------|---------|-----|
| Extend legacy with Omni, Live Agent, third-party CTI | ❌ | Keeps costs and scaling limits |
| Custom Experience Cloud + external telephony APIs | ❌ | Heavy custom build, long timeline, maintenance burden |
| **Contact Center with Amazon Connect** | ✅ | Cloud, elastic, unified voice/chat/case with real-time insights |

---

## Q15. High abandoned-call rate on phone support

**Answer: Enable contact requests and queue callbacks.**

| Option | Verdict | Why |
|--------|---------|-----|
| Case assignment rules for routing | ❌ | Routes cases, doesn't address callers hanging up |
| Service Swarming in Slack | ❌ | Internal collaboration, not caller wait experience |
| **Callbacks** | ✅ | Caller keeps position and gets called back; reduces abandonment |

Related: chapter 04 §6.

---

## Q16. Two business groups with different support processes and fields on cases

**Answer: Record Types.**

| Option | Verdict | Why |
|--------|---------|-----|
| **Record Types** | ✅ | Different processes (support process/picklists) and layouts per group |
| Dynamic Forms | ❌ | Changes field visibility only; not the process or picklists |
| Omni-Channel | ❌ | Routing, not data model |

Related: chapter 01 §4.

---

## Q17. First action at kickoff with disconnected, poorly documented processes

**Answer: Schedule interviews with department leaders to gather current processes and pain points.**

| Option | Verdict | Why |
|--------|---------|-----|
| Review documentation after design | ❌ | Sequence is backwards |
| Build a prototype on assumed best practices | ❌ | Assumptions, rework, no buy-in |
| **Interviews with leaders** | ✅ | Discovery informs every later decision; documentation is limited so people are the source |

Related: chapter 07 §1.

---

## Self-test (answer before reading the chapter)

1. Why can't a sharing rule hide Knowledge articles by category?
2. Which feature enforces "closed case must have a person owner"?
3. What two things does skills-based routing add over capacity-based routing?
4. Name the Wallboard's key metrics.
5. Why is a Macro the wrong answer for automatic field capture?
6. What changes if you use Omni-Flow instead of queue routing?
7. How would you fix lookup skew? Ownership skew?
8. When do you use PK chunking?
