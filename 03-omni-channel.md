# 03. Omni-Channel

## 1. First concepts

**Omni-Channel** routes any kind of **work item** (case, chat, messaging session, voice call, lead, custom object, flow work) to the *right available agent*, respecting agent **presence** and **capacity**.

Building blocks:

| Block | Meaning |
|-------|---------|
| **Service Channel** | The object type being routed (Case, Messaging Session, Voice Call...) |
| **Routing Configuration** | How work is pushed: priority, size, model |
| **Queue** | Holds waiting work; linked to a routing configuration |
| **Presence Status** | Agent's state (Available-Chat, Busy, Lunch) tied to service channels |
| **Presence Configuration** | Rules/capacity for the agent's session; assigned to users |
| **Capacity** | Number of "points" an agent can hold at once |
| **Skills** | Qualifications (Product A certified, Spanish) |
| **Omni-Channel Flow** | A flow that decides how to route (Route Work action) |
| **Omni Supervisor** | Real-time monitoring |

## 2. Routing models: pick one deliberately

| Model | How it works | Best for | Limitations |
|-------|--------------|----------|-------------|
| **Queue-based** | Work waits in a queue, pushed to a member | Small teams, one skill set | No skills awareness, one-queue-fits-all |
| **Skills-based** | Work requires skills; matched to agents with those skills | Product-specific certifications, languages, tiers | Needs skill maintenance |
| **Omni-Flow routing** | A **flow** decides: queue? skill? agent? bot? based on any data (customer tier, language, product) | Complex, multichannel, "consistent experience", evolving logic | Needs flow design |
| **External routing** | Outside system decides | Special integrations | Complexity |

Routing model options inside a routing configuration (for queue/skills): **Least Active** (agent with fewest open items) and **Most Available** (agent with most remaining capacity).

**Capacity models**
- **Status-based** (new): an agent has one of several *statuses* and capacity depends on channel.
- **Tab-based / Capacity-based**: each work item has *units* and an agent has total capacity (e.g., 10 units; chat = 2, case = 5, voice = 10).

**Why "Omni-Flow + Skills" for SL (Question 6)?** SL's reps are *certified by product line* (⇒ skills) and SL is *expanding channels* with a requirement for *consistent customer experience* (⇒ one flow-based routing design reused across channels). **Capacity-based routing** only answers *how much* an agent can hold, not *who is qualified*. **Queue-based** alone cannot match product certification without a queue per skill combination.

## 3. Omni-Channel flow (Route Work)

An **Omni-Channel flow** is a flow of type *Omni-Channel Flow*, invoked when work arrives (from a Messaging, Voice, Case routing config set to "flow"). Typical logic:

```
Start (work item: MessagingSession / VoiceCall / Case)
 → Get Records: Contact, Account (tier)
 → Decision: VIP? 
     ├─ Yes → Route Work (Skill = "Premium", Priority 1)
     └─ No → Route Work (Queue = "General", Skill = Product from case)
 → Fallback: Queue if no skilled agent available
```

### Route Work action options
- **Route To**: Queue, Agent, Bot
- **Skills requirements** (and skill levels / minimum proficiency)
- **Service Channel**
- **Capacity weight, priority, "Agent Capacity overrides"**
- **Fallback queue** when no one is available

### Hands-on (Lab 3.1: Skills-based routing with a flow)
1. Setup → *Omni-Channel Settings* → Enable Omni-Channel; (Skills-Based Routing; Enable Presence Status if prompted).
2. Create **Skills**: *Product_Router*, *Product_Switch*; assign to service resource users (Setup → Skills; then *Service Resources* via Service Resource object; add skills).
3. Create **Queues** (supported object: Case; plus Messaging Session for chat).
4. Create **Routing Configuration** (Name, Priority 1, Routing Model, Capacity units).
5. Create **Presence Status** (Available-Cases; assign Case channel) and **Presence Configuration** (capacity 10) and assign to profiles/permission sets.
6. Add **Omni-Channel** utility to console app; Login as agent; set Available.
7. Build an **Omni-Channel Flow** with *Route Work* using a Skill requirement derived from `Case.Product__c` (or a mapped record).
8. Create a record-triggered flow or routing config that calls the flow on new cases.
9. Create a case; confirm it is assigned to a skilled agent, see the Omni widget Accept/Decline.

## 4. Messaging session and setting a field from the URL (Question 1)

**Messaging session**: the record behind each conversation in *Enhanced Messaging channels* (web chat/Embedded Service Messaging, SMS, WhatsApp, Facebook, etc.).

**Requirement:** Store the originating web page URL on a custom field of the messaging session.

**Design**
1. In the **Embedded Service deployment**, use **pre-chat/hidden fields** or context variables to pass the **Page URL** into the conversation.
2. Make a **custom field** on *Messaging Session* (e.g., `Origin_URL__c`).
3. Use a **Flow** (the routing/Omni flow or record-triggered flow on *Messaging Session*) to read the context value and write it to the field.

**Why Flow:** back-end, no agent involvement, can run inside routing, is declarative, and updates any field on the record.
**Why not Macro:** macros run only when a **rep clicks them** in the console; not automatic and not appropriate for system data capture.
**Why not Einstein Bot:** bots guide the conversation with the customer; they can collect fields but are not the right tool to *silently capture technical context* and can't be relied on if a conversation never hits a bot.

## 5. Presence, Capacity, and agent experience

- Agents choose a **Presence Status**; Omni routes only to *online* statuses that are linked to the channel.
- **Capacity example:** Agent capacity 10. Chat = 2, Case = 5, Voice = 10 (blocks all else). So an agent can hold 5 chats or 1 case + 2 chats, but when on a call, no other work arrives.
- **Overtime/Auto-accept** options: Auto-Accept Work; Decline reasons; "Away" after timeouts (Set via presence configuration).

## 6. Omni Supervisor (real-time monitoring)

Omni Supervisor is a console app/page for **supervisors** (permission: *Omni Supervisor*; also need access to the tab).

| Tab | Purpose |
|-----|---------|
| **Queue Backlog** | Work waiting in each queue |
| **Assigned Work** | Work currently assigned to agents (subtabs: *Work Items*, *Work Summary*) |
| **Service Reps** (Agents) | Each agent's presence, capacity use; subtabs *All Agents*, *Skills*... |
| **Wallboard** | Real-time dashboard of key metrics, e.g., **Agent Capacity Status, Average and Longest Wait Times, Raised Flags** |

**Flags:** thresholds supervisors define (e.g., "wait time > 5 min") that light up when exceeded.

**Supervisor actions:** reassign work, monitor capacity, view agent status, add skills.

**Question 3 answer: Wallboard.** The keywords *real-time dashboard*, *summary metrics*, *agent capacity status*, *wait times*, *flags* all describe the Wallboard. *Assigned Work → Work Summary* shows detail of items per agent; *Service Reps → All Agents* shows individual agents, not summary.

### Hands-on (Lab 3.2)
1. Assign yourself **Omni Supervisor** via permission set (Omni Supervisor App Access).
2. Add the Omni Supervisor tab/app; create 3 test cases and 2 queues.
3. Open **Wallboard**; define a Flag (e.g., wait > 2 min); watch it trigger.

## 7. Exam traps

- "Qualified by product / language / certification" ⇒ **Skills-based**.
- "Complex logic, multiple channels, consistency, evolution" ⇒ **Omni-Flow**.
- "Real-time summary for managers" ⇒ **Wallboard**.
- "Measure agent workload" ⇒ **Capacity**, not skills.
- Queue-based alone does not meet multi-skill requirements.
