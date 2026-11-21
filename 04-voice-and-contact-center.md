# 04. Service Cloud Voice and Contact Center

## 1. First concepts

**Service Cloud Voice** embeds telephony into Salesforce. Calls become **Voice Call** records linked to Cases/Contacts, are routed by **Omni-Channel**, can be recorded and **transcribed in real time**, and reps work phone, chat and email in one console.

**Salesforce Contact Center with Amazon Connect** is the packaged, cloud contact center: Salesforce pre-integrated with Amazon Connect, quick to provision, scalable by usage.

### Options for connecting telephony

| Option | What it is | When to recommend |
|--------|------------|-------------------|
| **Service Cloud Voice (Amazon Connect)** | Telephony delivered through Amazon Connect, integrated by Salesforce | Modernising, scaling, real-time transcription |
| **Service Cloud Voice with partner telephony** (BYO telephony) | Existing/other carrier integrated through the Voice partner framework | Client keeps its carrier |
| **Open CTI / softphone (legacy)** | Third-party CTI adapter in a softphone utility | Legacy only; fewer integrated features |
| **Lightning Dialer / Sales Dialer** | Outbound calling tool aimed at sales | Not for service phone integration |
| **Softphone Layout** | Page layout that controls *what appears on the softphone screen* (call controls, screen pop) | A UI setting, not a telephony integration |

**Question 11:** "integrate client's phone system with Salesforce" ⇒ **Service Cloud Voice**. *Softphone Layout* only customises a CTI's screen; *Lightning Dialer* is for sales calling.

## 2. What Voice adds

- **Real-time transcription** and **Einstein Conversation Insights**
- **Call recording** and sentiment (via Contact Lens for Amazon Connect)
- **Omni-Channel routing** for calls (queue, skills, flow)
- **Unified Case/Contact view** and automatic **screen pop**
- **Call controls** inside the utility (mute, hold, transfer, conference)
- **Supervisor** listen-in and coaching (via the telephony provider's tools)
- **Voicemail** and **callbacks** (see below)
- **Real-time knowledge suggestions** based on conversation

## 3. Architecture (high level)

```
Customer phone → Carrier → Amazon Connect (contact flows, IVR)
      → Salesforce Voice (Voice Call record, Omni routing)
      → Agent's Omni widget + Phone utility → Case / Contact
      ↳ Transcript, recording → Salesforce
```

## 4. Hands-on (Lab 4.1: Service Cloud Voice with Amazon Connect, trial/sandbox)

> Requires a Voice-enabled org and an AWS account. Use a sandbox. Labels vary by release.

1. Setup → *Service Cloud Voice* → *Contact Centers* → **New** → choose *Amazon Connect (new instance)* or existing; give Amazon account details.
2. Complete the guided setup: provision instance, claim a **phone number** (DID).
3. Create **Omni-Channel** assets: queue for Voice Call; routing configuration; service channel for **Voice Call**; presence status.
4. Assign users to the **Contact Center** (Contact Center Users) and create their **Amazon Connect user** mapping.
5. Add the **Phone** utility to the console app.
6. Configure **contact flows** in Amazon Connect (greeting, queue selection, transfer to Omni-Channel).
7. Call your number; see screen pop and Voice Call record; read the transcript.

## 5. Call-center KPIs and what each reveals

| KPI | Definition | Used to evaluate |
|-----|-----------|------------------|
| **Abandon rate** | % of callers who hang up before reaching an agent | Capacity/wait problems, especially during surges |
| **Average Speed to Answer (ASA)** | Mean time until an agent answers | Responsiveness under load |
| **Service level** | % answered within X seconds (e.g., 80/20) | SLA |
| **Average Handle Time (AHT)** | Talk + hold + wrap-up | Efficiency |
| **After-call work (ACW)** | Wrap-up time | Process friction |
| **First Contact/Call Resolution (FCR)** | Resolved at first contact | Quality |
| **CSAT / Customer Effort Score** | Customer satisfaction/effort | Experience |
| **Cases per hour** | Throughput | Productivity |

**Question 7:** surges in call volume ⇒ queues grow ⇒ callers wait ⇒ some hang up. The KPIs that *directly* respond to volume surge are **abandon rate** and **average speed to answer**. FCR and CSAT are quality outcomes less directly tied to *volume*; ACW time and effort score describe post-call and experience.

## 6. High abandoned-call rate: solutions (Question 15)

| Option | Fit |
|--------|-----|
| **Contact requests / queue callbacks** | Caller keeps their place in line and is called back, so they stop hanging up. **Best fit.** |
| Case assignment rules | Route *cases*; don't affect callers waiting in a phone queue |
| Service Swarming | Internal collaboration to resolve cases faster, not reducing phone abandonment directly |

Other supporting levers: staffing forecasts, IVR self-service, skills routing, overflow queues, extended hours, proactive status messaging.

### Hands-on (Lab 4.2: Callback)
1. In your Amazon Connect flow add a *Callback* option ("Press 1 to keep your place in line").
2. Create Omni-Channel routing for **Contact Request** (callback record routed to the same queue).
3. Test: call, choose callback, hang up; verify an agent receives a callback work item.

## 7. Choosing a modernisation path (Question 13)

Scenario: legacy on-premises contact center, costly, hard to scale, no digital channels; needs lower overhead, seasonal scaling, real-time insights.

| Option | Verdict |
|--------|---------|
| **Salesforce Contact Center with Amazon Connect**: unify voice, chat, case management in cloud | **Best**: pay-as-you-go, auto-scales, real-time insights |
| Extend legacy + Omni + Live Agent + third-party CTI | Keeps cost and scaling issues, adds integration |
| Custom Experience Cloud + external telephony APIs | High custom build, maintenance, slow |

## 8. Exam traps

- A **CTI integration** question ⇒ Service Cloud Voice (or Open CTI), never Lightning Dialer.
- "Scale during spikes, reduce overhead" ⇒ cloud contact center.
- Abandon + ASA relate to *capacity*; FCR/CSAT relate to *quality*.
