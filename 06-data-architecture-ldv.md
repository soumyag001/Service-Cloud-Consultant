# 06. Data Architecture and Large Data Volumes (LDV)

Service Cloud orgs often hold tens of millions of Cases, Email Messages and Case Comments. A consultant must know how data *shape* causes locking and slowness.

## 1. Data skew

**Data skew** = a disproportionate number of child records tied to a single parent or owner (rule of thumb: **more than 10,000**). It causes **record locking** and slow **sharing recalculation**.

### 1.1 Ownership skew
**One user (or queue-like integration user) owns > 10,000 records of one object.**

Problems:
- Changing that user's **role** or moving them in the hierarchy triggers massive **sharing recalculation** (every record they own must be re-evaluated).
- Parallel loads under the same owner contend for **locks** on the owner's sharing rows.

Mitigations:
- **Distribute ownership** across many users (e.g., round-robin load).
- Make the **record owner** an integration user placed at the **top of the role hierarchy** (or with no role) so role changes don't cascade.
- Do not put a high-volume owner into a **public group** that appears in sharing rules.
- Use **assignment rules** to avoid a "default owner" bucket.

### 1.2 Parent-child (Account) skew
**One Account has > 10,000 child records** (Contacts, Cases, Opportunities).

Problems:
- Updating child records locks the **parent** (e.g., recalculating roll-ups, sharing) → `UNABLE_TO_LOCK_ROW` errors.
- Sharing recalculation on the parent is expensive.

Mitigations:
- Spread children across multiple parent accounts (e.g., "Unassigned Contacts 1..N", regional accounts).
- Avoid roll-up summary fields to heavily skewed parents when possible; schedule heavy jobs off-peak.
- Order Bulk API loads by parent Id; load serially.

### 1.3 Lookup skew
**Many (10,000+) records point to the same record through a lookup field** (e.g., thousands of Cases pointing to one "Default Product" record or one picklist-substitute lookup).

Problems:
- When any child record is inserted/updated, Salesforce **locks the lookup target** record to maintain integrity. Concurrent operations fail with row-lock errors.

Mitigations:
- Use a **picklist** instead of a lookup when the target is a fixed set.
- Duplicate the "dummy" parent into multiple records and distribute.
- Reduce parallelism (use **serial** mode in Bulk API) or **group the load by lookup value**.
- Avoid automations that update the lookup target for every child change.

### Quick comparison

| | Ownership skew | Parent-child (Account) skew | Lookup skew |
|---|---|---|---|
| Trigger | >10k records one owner | >10k children one parent | >10k records pointing to one lookup target |
| Main pain | Sharing recalculation, locks | Locks on parent, sharing | Locks on lookup target |
| Fix | Spread owners, top-of-hierarchy integration user | Spread parents | Picklist or multiple targets, serial/ordered loads |

## 2. Selectivity, indexes, and query timeouts

### 2.1 Selective queries
A filter is **selective** when it returns a small portion of the data so an **index** can be used.

Thresholds (approximate, memorise the idea):
| Index | Selective if returns fewer than |
|-------|----------------------------------|
| Standard index | 30% of first 1M records, 15% beyond; cap ~1M |
| Custom index | 10% of first 1M, 5% beyond; cap ~333,333 |

Indexed by default: Id, Name, OwnerId, CreatedDate, SystemModstamp, RecordType, lookup/master-detail fields, unique & external-ID fields. Others need a **custom index** via Salesforce Support.

Things that break index use: **negative operators** (`!=`, `NOT IN`), **leading wildcards** (`LIKE '%abc'`), **formula fields** (unless deterministic/indexed), **null** comparisons, functions on indexed fields.

### 2.2 What happens when a query doesn't complete in 2 minutes?
Salesforce limits query run time (**about 2 minutes** for many operations, e.g., API/SOQL, list views, reports).
- **API/SOQL:** the query is **cancelled** and returns a timeout error (e.g., `QUERY_TIMEOUT` "Your query request was running for too long").
- **Reports/list views:** show "unable to complete" / time out.
- **Apex triggers/ batch:** **non-selective queries on large objects (> 200,000 records)** in a trigger context throw `System.QueryException: Non-selective query against large object type`.
- Heavy timeouts repeated by integrations can also degrade the org.

**Fix strategy (in order):**
1. Add **selective, indexed filters** (date range, owner, status).
2. Request a **custom index** or **skinny table** from Salesforce Support.
3. Remove non-indexable patterns (negation, leading wildcards).
4. Use the **Query Plan** tool (Developer Console → Query Editor → *Query Plan*) to check cost: an index with **cost < 1** is good.
5. For bulk extraction use **Bulk API query with PK chunking** (below).
6. Archive or delete old data to reduce the dataset.

## 3. Skinny tables

A **skinny table** is a special database table maintained by Salesforce that **duplicates a subset of an object's frequently used fields** (standard and custom) in a single table.

Benefits: avoids **joins** between the standard and custom field tables, avoids soft-deleted-row overhead, speeds up reports/list views/SOQL on huge objects. Kept **automatically in sync** with the source.

Constraints:
- **Created by Salesforce Support** (you request it; not self-service).
- Contain **up to roughly 100 columns**; fields **from one object only** (no cross-object formulas).
- Not copied to sandboxes by default (ask Support to create them in sandbox for testing).
- Some field types not supported; used automatically by the optimizer when the query's fields are all inside the table.

**When to recommend:** a very large object (millions of rows), slow reports, you already have selective filters, and need extra speed.

## 4. Bulk API: advantages for large loads

| Feature | Why it matters |
|---------|---------------|
| **Asynchronous** processing | Submit and poll; no long-running UI/SOAP request |
| **Batches / automatic chunking** (Bulk API 2.0 splits for you) | Efficient for millions of rows |
| **Parallel processing** | Faster throughput |
| **Serial mode** | Avoids lock contention (skew) |
| **Fewer API calls** | One job ≈ thousands of records, preserving limits |
| **CSV-based** | Simple, works with Data Loader |
| **Fault tolerance** | Per-batch results, partial success |

Use **SOAP/REST** for small interactive loads; **Bulk API** for tens of thousands to millions of rows (Data Loader: *Use Bulk API* setting).

Tips: disable unnecessary triggers/flows/duplicate rules during the load (if business allows); sort by parent/owner; set **batch size** smaller if triggers are heavy; lower concurrency when skew exists.

## 5. PK Chunking

**Primary Key Chunking** splits a **Bulk API query** into many smaller queries by **Id ranges** (`WHERE Id >= x AND Id < y`), run in parallel, then combines results. It avoids timeouts when extracting very large tables.

- Enabled with a header: `Sforce-Enable-PKChunking: chunkSize=100000` (default chunk **100,000**, max **250,000**).
- Supported on most standard objects (Account, Case, Contact, etc.) and custom objects.
- Optional `parent=` and `startRow=` to chunk a child by its parent or resume.
- Best for **extracting** an entire object (initial migrations, backups, data-lake feeds).

**Exam link:** "Query times out extracting millions of Cases" ⇒ **Bulk API with PK chunking**.

## 6. Truncation

**Truncate** (Object Manager → Custom Object → *Truncate*) **permanently deletes all records** of a custom object quickly, bypassing the Recycle Bin, and frees storage. Useful for **cleaning staging/test objects** or resetting data before a reload.

Caveats:
- **Custom objects only**; the action is **irreversible** (no undelete).
- Preconditions: object must not be referenced in certain ways (e.g., as a target of lookup/master-detail from other objects, in a report type used in reports, or by workflow/flow in some cases, no roll-up summaries, etc.); resolve them first.
- Truncation recreates the object internally; confirm autonumber and other side effects in a sandbox first.
- A **hard delete** via Bulk API (`hardDelete`) is the alternative for partial deletes.

## 7. Other LDV tools to mention

| Tool | Purpose |
|------|---------|
| **Archiving** (Big Objects, external storage, Salesforce Archive/Data Archive) | Move old closed cases out of live tables |
| **Big Objects** | Billions of rows; limited query (indexed) |
| **External Objects (Salesforce Connect)** | Keep data outside, display inside |
| **Divisions** | Partition data logically for queries |
| **Defer sharing calculations** | During big loads to a defer then recalc |
| **Data retention policy** | Define what's kept online |

## 8. Hands-on (Lab 6.1)

1. Use Data Loader or `sf data` CLI to import 20,000 Cases owned by one user → observe slow sharing/locks; repeat with owners spread.
2. In Developer Console → Query Editor, run:
   `SELECT Id FROM Case WHERE Status != 'Closed'` and click **Query Plan**; compare with `WHERE CreatedDate = LAST_N_DAYS:30` and see cost.
3. Run a Bulk API 2.0 query job for Case through Postman/Workbench; try PK chunking with the REST/ Bulk 1.0 header via Workbench (Utilities → REST Explorer/Bulk).
4. Create a custom object *Staging__c*, load 1,000 rows, then **Truncate**; confirm.

## 9. Exam traps

- Skew is about **concentration** (10k+) at one parent/owner/lookup.
- Fix lookup skew with picklists/distribution; ownership skew with **distribution + role-top integration user**.
- Skinny tables are **requested via Salesforce Support**, not created in Setup.
- PK chunking is for **querying/extracting** huge data; Bulk API *serial* mode addresses **lock contention**.
- Truncate is **irreversible**, custom objects only.
