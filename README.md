# Salesforce Service Cloud Consultant: Study Guide

A self-contained study path for someone who knows only the basics of Salesforce (and a little Knowledge) and wants to think and answer like an experienced **Service Cloud Consultant**.

> Verify UI labels in your own org: Salesforce renames menu items every release. Concepts stay stable; click paths drift.

## Interactive version (HTML/CSS/JS)

`index.html` is a chapter reader and `quiz.html` is a scenario quiz with instant feedback and a missed-questions list. They need a web server (fetching Markdown does not work from `file://`): run `python3 -m http.server` in this folder and open http://localhost:8000, or publish with GitHub Pages (Settings, Pages, deploy from `main` / root).

## How to use this guide

1. Read the chapters in order. Each one has: **First concepts → How it works → Scenarios → Hands-on lab → Exam traps**.
2. After each chapter, jump to the matching questions in [08-scenario-question-bank.md](08-scenario-question-bank.md).
3. Do the labs in a free **Developer Edition** org (Service Cloud features are included; some, like Voice, need a trial or sandbox).
4. Finish with the [cheat sheet](10-cheat-sheet.md) and re-answer every question without looking.

## Contents

| # | File | What it covers |
|---|------|----------------|
| 01 | [Service Cloud Fundamentals](01-service-cloud-fundamentals.md) | Case lifecycle, queues, assignment and escalation rules, record types, validation rules, email-to-case (incl. On-Demand), web-to-case, entitlements and milestones, macros |
| 02 | [Knowledge and Data Categories](02-knowledge-and-data-categories.md) | Knowledge articles, lifecycle, channels, data categories, visibility and security |
| 03 | [Omni-Channel](03-omni-channel.md) | Routing models, Omni-Channel flow, skills, capacity, presence, Omni Supervisor and Wallboard, messaging sessions |
| 04 | [Voice and Contact Center](04-voice-and-contact-center.md) | Service Cloud Voice, Contact Center with Amazon Connect, softphone/CTI, KPIs, callbacks |
| 05 | [Collaboration, Analytics and Agentforce](05-collaboration-analytics-agentforce.md) | Swarming and Slack, reports, CRM Analytics, Agentforce Service Agent security |
| 06 | [Data Architecture and Large Data Volumes](06-data-architecture-ldv.md) | Ownership/account/lookup skew, skinny tables, selectivity, 2-minute query timeouts, Bulk API, PK chunking, truncation |
| 07 | [Consulting Practice](07-consulting-practice.md) | Discovery, change management and enablement, deployment (change sets), design principles |
| 08 | [Scenario Question Bank](08-scenario-question-bank.md) | 17 scenario questions, every option analysed |
| 11 | [Additional Scenarios](11-additional-scenarios.md) | 25 more consultant scenarios with option-by-option analysis |
| 09 | [Hands-on Labs Index](09-hands-on-labs.md) | One checklist of every lab with an order of execution |
| 10 | [Cheat Sheet](10-cheat-sheet.md) | One-page decision tables and numbers to memorise |

## Suggested 3-week plan

| Week | Focus | Output |
|------|-------|--------|
| 1 | Chapters 01, 02, 07 | Working case process + Knowledge base with data categories in your dev org |
| 2 | Chapters 03, 04, 05 | Omni-Channel routing (queue and skills), macro, entitlement process, a dashboard |
| 3 | Chapter 06, 08, 10 | LDV vocabulary fluent; all question-bank answers explained aloud |

## The consultant mindset (applies to every question)

1. **Requirement first, feature second.** Restate what the business actually needs.
2. **Prefer declarative and standard** over custom code and third-party tools.
3. **Least privilege and compliance** win over convenience.
4. **Scale and maintainability:** what happens at 10x volume, or with 10,000 children under one parent?
5. **Adoption is a requirement.** Training, change management and discovery are first-class deliverables.
6. Read for the **keyword that decides**: "real-time" (Wallboard), "track time in each team" (Case Lifecycle), "abandoned calls" (callbacks), "different processes and fields" (Record Types), "first" (discovery interviews).

## Publishing to GitHub

```bash
cd service-cloud-consultant-study-guide
git init
git add .
git commit -m "Service Cloud consultant study guide"
git branch -M main
git remote add origin https://github.com/<your-user>/service-cloud-consultant-study-guide.git
git push -u origin main
```

Create the empty repository on github.com first (no README, since this one already exists).
