---
layout: post
title: "Why Transaction Logs Matter: The Problem Stream Solves"
description: "Your database knows exactly what changed and when. So why are you still running nightly batch jobs? An introduction to Stream, a high-performance transaction log processing system."
tags: [Go, CDC, DatabaseReplication, DataEngineering, TransactionLogs]
series: stream
series_part: 1
---

# Why Transaction Logs Matter: The Problem Stream Solves

*Part 1 of the Stream Blog Series*

---

I've spent more time than I'd like to admit staring at dashboards showing "data last synced: 8 hours ago." Eight hours. In a world where I can get a pizza delivered in 30 minutes, my analytics dashboard is showing me yesterday's numbers because someone decided that a nightly batch job was "good enough."

Here's the thing: your database already knows exactly what changed and when. Every INSERT, UPDATE, DELETE, it's all there, written to a transaction log in real-time. PostgreSQL calls it WAL (Write-Ahead Log). MySQL has binlogs. MongoDB has the oplog. These logs exist primarily for crash recovery, but they're also a goldmine of information about exactly how your data evolved.

So why are most data pipelines still doing full table scans at 2 AM?

That question led us to build Stream, a high-performance transaction log processing system. But before I show you the code, let's talk about why this matters.

## The Data Synchronization Problem

Let's say you're running an e-commerce platform. You've got:

- A PostgreSQL database for orders
- An Elasticsearch cluster for product search
- A Redis cache for session data
- A data warehouse for analytics
- A recommendation engine that needs user behavior data

Every time a customer places an order, that information needs to propagate to at least three of these systems. When inventory changes, the search index needs updating. When a product price changes, the cache needs invalidating.

The traditional approach? Batch jobs. Every hour (or every night, if you're unlucky), a script runs that:

1. Queries the source database for "recent" changes
2. Transforms the data
3. Pushes it to the destination systems

This approach has problems. Big ones.

**Problem 1: You're always behind.** If your batch runs hourly, you're showing customers stale data for up to 59 minutes. In e-commerce, that means selling products you don't have in stock. In financial services, that means showing incorrect balances. In healthcare, that means potentially dangerous outdated patient information.

**Problem 2: "What changed?" is expensive to answer.** Unless every table has a reliable `updated_at` column (and let's be honest, they don't), figuring out what changed since the last sync requires comparing the entire dataset. That's expensive on the source database, expensive on the network, and expensive on your cloud bill.

**Problem 3: Deletes are invisible.** If you're querying for records that exist, you won't see the ones that were deleted. Many batch pipelines simply miss deletions entirely, leading to ghost data that accumulates over time.

**Problem 4: Transaction boundaries get lost.** A single business operation might touch multiple tables. Batch processing treats each table independently, destroying the transactional guarantees your database worked so hard to provide.

### The Outbox Pattern: Better, But Still Not Enough

Some teams try to solve this with the transactional outbox pattern. The idea is clever: instead of publishing events directly to a message broker (which can't participate in your database transaction), you write events to an "outbox" table as part of the same transaction that modifies your data. A separate process then polls the outbox table and publishes events to Kafka, RabbitMQ, or wherever.

This solves the atomicity problem. If your transaction commits, the event is guaranteed to be in the outbox. If it rolls back, the event disappears too. No more "order created but event never published" scenarios.

But the outbox pattern has its own baggage:

**You have to build it into every service.** Every application that writes data now needs outbox logic. That's additional code to write, test, and maintain. In a microservices architecture with dozens of services, this adds up fast.

**Schema coupling.** Your outbox table schema becomes a contract. Change the event format, and you're potentially breaking downstream consumers. Now you're managing schema evolution for your outbox alongside your actual data.

**Polling overhead.** Something has to read that outbox table and publish events. If you poll too slowly, you're back to stale data. Poll too aggressively, and you're hammering your database. And you need to handle delivery guarantees, retries, and exactly-once semantics yourself.

**It only captures what you explicitly write.** Miss an INSERT statement somewhere? That change never makes it to the outbox. The database itself has no idea you're trying to do CDC, so it can't help you.

The outbox pattern is a reasonable workaround when you can't read transaction logs directly. But it's fundamentally a workaround, adding application-level complexity to compensate for not using the infrastructure the database already provides.

## Change Data Capture: A Better Approach

This is where Change Data Capture (CDC) comes in. Instead of asking "what does the data look like now?", CDC asks "what happened since last time?"

The idea isn't new. [According to research](https://www.integrate.io/blog/cdc-change-data-capture-adoption-stats/), 74% of surveyed organizations now implement microservices architectures that require data synchronization between services. CDC has transitioned from optional to essential infrastructure.

The most reliable way to implement CDC is to read directly from the database's transaction log. This is the same log the database uses for crash recovery, which means:

- **Every change is captured** (no missed deletes, no reliance on timestamps)
- **Minimal performance impact** (you're reading a sequential file, not querying tables)
- **Transaction boundaries are preserved** (you see BEGIN, the changes, then COMMIT)
- **It's real-time** (changes appear in the log immediately)

This approach, reading the transaction log directly, is what Stream does for PostgreSQL's WAL. And it's why the results are dramatically different from traditional batch processing.

## Beyond CDC: Six Capabilities in One System

When we started building Stream, we thought we were building a CDC tool. But transaction logs can do so much more than just track changes. They're the source of truth for *everything* that happened to your data.

This realization shaped Stream's architecture around six core capabilities:

### 1. Change Data Capture (CDC)

The most obvious use case. Stream connects to PostgreSQL's logical replication protocol and receives change events in real-time. Every INSERT, UPDATE, DELETE, TRUNCATE hits your application within milliseconds of being committed.

```go
events, errors, err := reader.StartStreaming(ctx, lastPosition)
for event := range events {
    // ...
}
```

We also have provisions in place that let you see exactly what changed, not just the final state. This matters for audit trails, debugging, and systems that need to know the delta rather than the absolute value.

### 2. Logical Replication

CDC captures changes. Logical replication *applies* them somewhere else. Stream can route changes to multiple destinations simultaneously: Kafka for event streaming, files for archival, RabbitMQ for task queues, same database or even other databases for cross-system synchronization.

The pipeline handles batching, retries, and backpressure automatically:

```go
pipeline := cdc.NewPipeline("orders-sync", reader, []core.Sink{
    kafkaSink,
    PostgresSink,
    fileSink,
    MySQLSink,
    webhookSink,
}, cdc.DefaultPipelineConfig())
```

You configure it once, and Stream ensures your changes reach all destinations reliably.

### 3. Transaction Logging

Sometimes you don't want to react to changes, you want to record them. Stream can export transaction logs to external services for compliance, auditing, or analysis.

Every event includes the transaction ID, so you can correlate changes that happened atomically. If a single database transaction updated three tables, Stream preserves that grouping. Your audit trail shows "these five changes happened together as one business operation," not just "here are five unrelated changes that happened around the same time."

### 4. Point-in-Time Recovery (PITR)

Transaction logs don't just tell you what changed, they tell you when. Combined with continuous archiving, this enables Point-in-Time Recovery: the ability to restore your database to any specific moment.

Accidentally dropped a table at 3:47 PM? Restore to 3:46 PM. A bug corrupted data over the last hour? Restore to before the bug was deployed. PITR turns your transaction log into a time machine for your data.

### 5. REDO Operations

Physical replication involves sequentially replaying WAL data. Stream supports this through its physical replication adapter, enabling scenarios like:

- Setting up streaming replicas
- Disaster recovery with standby servers
- Geographic distribution of read replicas

The same Position abstraction that tracks LSN (Log Sequence Number) for logical replication works for physical replication too. Start from a specific point, replay forward.

### 6. Heterogeneous Replication

This is where it gets interesting. What if your source is PostgreSQL but your destination is MySQL? Or MongoDB? Or a data lake on S3?

Stream's architecture separates the "reading changes" concern from the "writing changes" concern. The LogReader interface handles database-specific log parsing. The Sink interface handles destination-specific writing. In between, everything flows through a normalized ChangeEvent format:

```go
type ChangeEvent struct {
    Position      Position
    Timestamp     time.Time
    Operation     OperationType  // INSERT, UPDATE, DELETE, etc.
    TransactionID string
    Database      string
    // ... 
}
```

PostgreSQL changes become ChangeEvents. Those events can flow to any sink. The sink doesn't need to know where the data came from. This design enables PostgreSQL to Kafka, but also PostgreSQL to MySQL, or eventually MongoDB to PostgreSQL, or any other combination.

## Why Build Another Tool?

Fair question. Debezium exists. So does Maxwell, Airbyte, AWS DMS, and a dozen commercial options.

We built Stream because the existing options have fundamental problems that are difficult to work around. A few examples:

**Complexity that doesn't pay for itself.** Debezium is powerful, but it requires Kafka, Kafka Connect, and ZooKeeper just to get started. [As noted by practitioners](https://estuary.dev/blog/debezium-alternatives/), standing up Debezium pipelines typically requires "weeks to months including cluster design, tuning, and ongoing ops." That's not complexity in service of capability, it's complexity as a tax on getting anything done. Stream achieves the same results with a single binary. No external dependencies beyond your database.

**Locked into one deployment model.** Most CDC tools force a choice: either you run their managed platform and pay their prices, or you self-host their complex infrastructure. Stream is designed for flexibility from the start. Use it as a library embedded in your application. Deploy it as a standalone service. Or use the managed cloud offering when it launches. Same core, different deployment models, your choice based on what actually fits your architecture.

**Incomplete feature sets.** Most CDC tools do one thing: logical replication for change streaming. That's useful, but transaction logs enable so much more. Stream provides CDC, logical replication, transaction logging, Point-in-Time Recovery, physical replication, and heterogeneous replication in a single, coherent system. You shouldn't need five different tools to fully leverage what your database already provides.

**Performance left on the table.** Many existing tools were built as Java applications with abstractions on top of abstractions. Stream is written in Go with performance as a first-class concern. Minimal allocations, efficient binary parsing, and careful attention to the hot paths. When you're processing millions of events per hour, these details matter.

## Real-World Use Cases

Let's get concrete. Where does transaction log processing actually help?

### E-commerce: Real-Time Inventory

An e-commerce platform processes thousands of orders per hour. Each order decrements inventory. The traditional approach: inventory counts in the search index lag behind reality, leading to overselling.

With Stream: inventory changes propagate to Elasticsearch within milliseconds. When a product sells out, it disappears from search results almost instantly. No more apologetic "sorry, that item is actually out of stock" emails.

### Financial Services: Fraud Detection

A bank processes credit card transactions. Fraud detection models need to see transactions as they happen, not in next-morning batch reports.

With Stream: every transaction hits the fraud detection pipeline in real-time. Patterns that would have been detected "too late" in batch processing (like a card being used in two countries simultaneously) trigger immediate alerts.

### Healthcare: Patient Record Sync

A hospital system needs to synchronize patient records across multiple facilities. HIPAA requires complete audit trails of who accessed and modified what.

With Stream: every modification to patient records is captured with full transaction context. The audit trail isn't reconstructed from snapshots, it's the actual log of what happened. Cross-facility sync happens in real-time while maintaining transaction boundaries.

### Analytics: Real-Time Dashboards

A SaaS company wants executives to see today's metrics, not yesterday's.

With Stream: operational data flows to the analytics warehouse continuously. Dashboards show metrics from minutes ago, not hours. The "data last synced: 8 hours ago" problem disappears.

### Microservices: Event-Driven Architecture

A team is breaking apart a monolith. Different services need to react to changes in the core database.

With Stream: the database becomes an event source. Services subscribe to the changes they care about. No need to retrofit the monolith with event publishing, the transaction log already has everything.

## What's Next

This post established the "why." The next posts will dig into the "how".

Each post will include code, diagrams, and the reasoning behind design decisions. We'll show what worked, what didn't, and why certain trade-offs made sense.

Transaction logs are one of those things that sit at the foundation of data systems but rarely get the attention they deserve. If you've ever wondered how existing platforms like this works, how PostgreSQL replication actually functions, or how to build reliable data pipelines, this series is for you.

Your database already knows what changed. It's time to start listening.

---

*Stream is under active development, with the public release coming soon. If you're interested in early access or have questions about the approach, We'd love to hear from you.*

---

**Further Reading:**

- [The Log: What every software engineer should know about real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying) – Jay Kreps' foundational post on logs in distributed systems
- [PostgreSQL Logical Replication Documentation](https://www.postgresql.org/docs/current/logical-replication.html) – Official docs on how PostgreSQL implements logical replication
- [CDC Adoption Statistics](https://www.integrate.io/blog/cdc-change-data-capture-adoption-stats/) – Market trends and enterprise adoption of CDC
- [Debezium Alternatives Comparison](https://estuary.dev/blog/debezium-alternatives/) – Overview of the CDC tool landscape
