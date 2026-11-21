# 02. Salesforce Knowledge and Data Categories

## 1. First concepts

**Salesforce Knowledge** is the repository of articles (how-tos, FAQs, troubleshooting, policies) used by reps, partners and customers.

- **Lightning Knowledge** stores all articles in **one object** (`Knowledge__kav`); article "types" are replaced by **record types**.
- **Knowledge User** = a user with the *Knowledge User* feature license checked on their user record (needed to create/manage articles).
- **Article**: Title, URL Name, Summary, rich-text fields, attachments, data categories, language.
- Each **version** is a separate record in `Knowledge__kav`; the **Knowledge Article** (`KnowledgeArticle`) groups versions.

## 2. Article lifecycle

```
Draft → (optional approval) → Published → Archived / new Draft version
  ↑ Translation (Draft → Published per language)
```
| Status | Meaning |
|--------|---------|
| Draft | Being written |
| In Review / Pending approval | Approval process |
| Published | Visible to channels the article is assigned to |
| Archived | Not visible; kept for history |

**Validation Status** (optional picklist: Not Validated / Validated) shows whether content was reviewed.

### Channels
An article is published to one or more channels:
- **Internal App** (agents)
- **Customer** (Experience Cloud / customer community)
- **Partner**
- **Public Knowledge Base** (public site, no login)

## 3. Data categories (the heart of knowledge organisation)

**Data categories** form hierarchies that classify articles (and optionally Cases, via Case classification). They are used for:
1. **Filtering and navigation** (users browse Products → Hardware → Laptops).
2. **Access control** (*category visibility*): who sees which articles.
3. **Search** (restrict to category).

### Structure
```
Category Group: Products
  └─ Hardware
       ├─ Laptops
       └─ Phones
  └─ Software
Category Group: Region
  └─ EMEA / APAC / Americas
```
Key limits (memorise): **up to 5 active category groups**, **up to 8 levels deep**, **up to 100 categories per group** (roughly).

A parent category visible ⇒ **child categories visible** (visibility rolls **down**: if a user sees *Hardware* they see *Laptops* and *Phones*). If a user only sees child categories, they do not see siblings.

### Category visibility: how access is granted
Set under *Data Category Visibility* (Setup → Data Category Setup → Default Data Category Visibility; then role/profile/permission set assignment):

| Option | Effect |
|--------|--------|
| **All Categories** | See every category in the group |
| **None** | See no articles classified in that group |
| **Custom** | Only chosen categories (and their children) |
| **All Except** | Everything but chosen categories |

Visibility is assigned to **roles** (most common), **permission sets** or **profiles**. Role-based: "users in the Division A role see only the Division A category".

### Designing a good category hierarchy (checklist)
1. **Start from how users search:** by product? topic? region? That becomes your groups.
2. **One classification dimension per group** (products, topics, regions); do not mix.
3. Keep it **shallow** (2 to 4 levels used in practice); you can't exceed 8.
4. **Plan visibility** from the start; changing after thousands of articles is painful.
5. Name categories for users, not for internal org charts.
6. Only 5 active groups: choose dimensions carefully.
7. Test with a real user ("Login As") from each role.

## 4. Scenario: three divisions, each sees only its own articles

**Requirement:** Compliance: each division must see only its own articles in search.

**Recommended design**
1. Create a data category group (e.g., *Division*) with categories **Division A, Division B, Division C** (the supplied answer frames this as a category group per division; the principle is *classify by division and secure by category visibility*).
2. Classify each article in its division category.
3. Assign **category visibility by role** (A role sees A only).
4. Test search as each user type.

**Why not sharing rules?** *Salesforce Knowledge article access is governed by **data category visibility** and channel/profile permissions, not by standard record sharing rules.* A sharing rule "based on category" or "role hierarchy" is not how you restrict article search visibility. That is the trap in Questions 5 and 14.

## 5. Hands-on (Lab 2.1: Build a small Knowledge base)

1. Setup → *Knowledge Settings* → **Enable Lightning Knowledge**; check *Allow users to create and edit articles*; tick *Use Article Record Types*.
2. On your own user: tick **Knowledge User**. Give yourself *Knowledge* permissions (Read/Create/Edit/Publish/Archive/Delete on Knowledge object) via a permission set.
3. Setup → *Data Category Setup* → create group **Products** (Hardware > Laptops, Phones; Software). Activate.
4. Create a second group **Region** (EMEA, APAC) and activate.
5. Set **Default Data Category Visibility**: All Categories for System Admin role; Custom for Support Agent role.
6. Create 3 articles; classify each with categories; publish them to *Internal App*.
7. Add the **Knowledge** component on the Case Lightning page; as an agent, search and **attach** an article to a case; *Send via email* the article.
8. Test: log in as a restricted user and confirm articles outside their category are not found.

## 6. Knowledge in the case flow

- **Attach article to case** → tracks usage ("Articles attached per case" reports).
- **Article suggestions** (Einstein Article Recommendations) learn from past case-article attachments.
- **Create article from case** (Quick Action "Create Article" in the console) turns solved cases into content.
- **Knowledge reports**: article views, ratings, usage, search terms; use **Knowledge Home** metrics.

## 7. Governance model (what a consultant recommends)

| Role | Responsibility |
|------|---------------|
| Author | Drafts content |
| Reviewer / Approver | Quality, compliance |
| Publisher | Publishes/Archives |
| Knowledge Manager | Taxonomy and metrics |

Add: review dates (expiry), validation status, a feedback loop (thumbs-up/down), regular pruning of low-use articles.

## 8. Exam traps

- Article visibility is **data categories + channels + permissions**, not sharing rules.
- Category visibility **cascades downward**.
- Max **5 active** category groups.
- Knowledge needs the **Knowledge User** license flag; do not forget that for authors.
- If a question says "organise several hundred articles across many topics and products": **logical hierarchy aligned to how users search, groups for distinct criteria, visibility for access** (Question 4).
