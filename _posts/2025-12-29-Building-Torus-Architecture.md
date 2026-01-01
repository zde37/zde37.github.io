---
layout: post
title: "Building Torus: Architecture Decisions and Trade-offs"
description: "Learn the engineering decisions behind building a production DHT in Go. Explore trade-offs between gRPC vs REST, consistency vs availability, and scalability patterns."
tags: [Go, DistributedSystems, DHT, Architecture, gRPC]
series: torus-dht
series_part: 3
---

# Building Torus: Architecture Decisions and Trade-offs

*Part 3 of the Torus DHT Blog Series*

---

Understanding Chord on paper is one thing. Building a working implementation is something else entirely.

I've spent the last few posts walking you through the theory — consistent hashing, finger tables, O(log N) routing. Now comes the hard part: turning that theory into running code.

This post is about the architecture decisions I made while building Torus, and more importantly, *why* I made them. Every choice in software engineering involves trade-offs, and distributed systems amplify those trade-offs by 10x.

Why Go instead of Rust or Java? Why gRPC instead of REST or raw TCP? Why make the frontend read-only? These aren't arbitrary decisions, each one shaped how Torus works and what it can (and can't) do.

Let's dive in.

## The Technology Stack: What I Chose and Why

Here's what Torus is built with:

**Backend:**
- Language: **Golang**
- RPC Framework: **gRPC** with Protocol Buffers
- Hashing: **SHA-256** (truncated to 160 bits)
- Logging: **zerolog**

**Frontend:**
- **Next.js**, **React**, **D3.js**, **Tailwind CSS**, **TypeScript**

Each choice was deliberate. Let me explain.

## Why Go? (Spoiler: Goroutines)

### Concurrency is First-Class

Chord nodes do a *lot* of concurrent work:
- Periodic stabilization (every 3 seconds)
- Periodic finger fixing (every 3 seconds)
- Handling incoming RPC calls
- Making outgoing RPC calls to other nodes
- Background key replication
- TTL cleanup for expired keys

In most languages, you'd manage this with threads, thread pools, mutexes, and a whole lot of careful synchronization. In Go, you write:

```go
go node.stabilize()
```

That `go` keyword launches a goroutine, a lightweight concurrent function. Goroutines have tiny stack sizes (a few kilobytes) and are multiplexed onto OS threads by the Go runtime. You can run **millions** of goroutines on a single machine without breaking a sweat.

For comparison: Traditional java threads are heavyweight OS threads. Spinning up thousands of threads will kill your application. Rust requires you to carefully manage async/await and futures, which is powerful but complex.

Go's model is simple: "just run it concurrently." The runtime handles the rest.

### Channels for Communication

Go's channels make inter-goroutine communication safe and straightforward:

```go
type ChordNode struct {
    shutdownChan chan struct{}
    // ...
}

// Signal shutdown
close(node.shutdownChan)

// Background goroutine listens
select {
case <-node.shutdownChan:
    // Clean up and exit
}
```

No shared memory, fewer mutexes, no race conditions. Channels embody the philosophy: *"Don't communicate by sharing memory; share memory by communicating."*

This made building Torus's stabilization loops and background workers dramatically simpler.

### Fast Compilation and Simplicity

Go is also deliberately simple. There's usually one obvious way to do something. It also compiles **fast**. The entire Torus backend builds in ~3 seconds. During development, this tight feedback loop kept me productive.

**Trade-off**: Go's garbage collector means you lose some performance compared to Rust's zero-cost abstractions. But for a DHT where network latency dominates, GC pauses aren't the bottleneck.

## Why gRPC Over REST or Raw TCP?

For inter-node communication, I had three main options:

1. **Raw TCP sockets**: Maximum control, minimum overhead
2. **REST over HTTP**: Universal compatibility, simple debugging
3. **gRPC over HTTP/2**: Structured, efficient, with code generation

I chose gRPC. Let me break down why.

### Performance: It's Genuinely Faster

Why? Two reasons:

**1. HTTP/2 multiplexing**: Multiple RPC calls can share a single TCP connection. REST over HTTP/1.1 requires a new connection (or connection pooling, which adds complexity).

**2. Protocol Buffers**: Binary serialization is compact and fast. JSON (the usual REST payload format) is text-based, larger, and slower to parse.

For Chord, where nodes constantly ping each other (stabilization, successor list checks, finger fixing), this performance matters.

### Strongly Typed Contracts

With gRPC, you define your API in a `.proto` file:

```protobuf
service ChordService {
  rpc FindSuccessor(FindSuccessorRequest) returns (FindSuccessorResponse);
  rpc GetPredecessor(GetPredecessorRequest) returns (GetPredecessorResponse);
  rpc Notify(NotifyRequest) returns (NotifyResponse);
  rpc Ping(PingRequest) returns (PingResponse);
  // ... 13 RPC methods total
}
```

The Protocol Buffer compiler generates Go code (and potentially code for other languages) from this single source of truth. No manual serialization, no type mismatches between client and server.

When I changed a message format, the compiler caught every place that needed updating. With REST, you're often debugging JSON shape mismatches at runtime.

### Streaming Support

gRPC supports bidirectional streaming out of the box. While Torus doesn't currently use this (Chord operations are request-response), having streaming available for future features (like real-time ring updates to the frontend) is valuable.

**Trade-off**: gRPC has worse browser support than REST. You can't directly call gRPC from JavaScript in the browser without a proxy (grpc-web). That's why Torus uses gRPC for *internal* node-to-node communication, but exposes an HTTP REST API for the frontend.

### Why Not Raw TCP?

I considered writing a custom protocol over raw TCP sockets. Maximum performance, complete control.

But here's the thing: I'd have to implement:
- Message framing (where does one message end and the next begin?)
- Serialization/deserialization
- Connection pooling and lifecycle management
- Error handling and retries
- Timeouts

gRPC gives me all of that for free, plus TLS/mTLS support, load balancing hooks, and proven reliability. The performance difference compared to a well-implemented custom protocol would be marginal, and the development time would be 10x longer.

For this project, gRPC was a good choice. For a production system at massive scale (think Google's internal infrastructure), maybe you'd justify the custom protocol. But that's not Torus.

## The Frontend: Next.js, React, and D3.js

The frontend had one job: **make Chord visible**.

Distributed systems are abstract. You can't *see* a hash ring, you can't *watch* keys migrate, you can't *observe* finger table routing in action. The visualization turns the invisible into the tangible.

## The Most Important Decision: Read-Only Frontend

Here's the decision that shaped everything else: **The frontend is read-only. Visitors cannot modify the actual DHT.**

When you open Torus's dashboard, you can:
- ✅ View the ring topology in real-time
- ✅ See finger tables and node statistics
- ✅ Simulate key lookups (with animated routing visualization)
- ✅ Experiment with demo operations

What you *cannot* do:
- ❌ Insert keys into the actual DHT
- ❌ Join your browser as a node in the ring
- ❌ Delete keys from the backend
- ❌ Modify any persistent state

### Why This Matters

Initially, I considered making Torus fully interactive, let visitors insert keys, spin up browser-based nodes, create a true peer-to-peer experience.

Then reality hit:

**1. Security nightmare**: Untrusted users inserting arbitrary data? That's how you end up storing illegal content you're now legally responsible for. No thanks.

**2. DDoS attack vector**: Thousands of browser "nodes" could overwhelm the backend ring. Malicious users could join and leave rapidly, destabilizing the network.

**3. Browser limitations**: JavaScript in browsers has no persistent storage (IndexedDB is not suitable for DHT storage), can't open listening sockets for incoming connections, and would require WebRTC or WebSocket proxying for peer communication.

**4. Complexity explosion**: Supporting browser nodes means handling NAT traversal, managing unreliable connections, dealing with users closing tabs mid-operation, and a thousand other edge cases.

The read-only decision eliminated all of these problems. Instead:

- **Backend**: I run a stable cluster of several Chord nodes (actual Go processes)
- **Frontend**: A Next.js visualization dashboard connecting via WebSocket
- **Demo mode**: Key lookups are simulated, they query the ring topology but don't modify state

This is **secure** (no untrusted writes), **stable** (no browser nodes destabilizing the ring), and **educational** (visitors see real Chord behavior without the complexity of contributing to it).

### The Trade-off

I sacrificed true peer-to-peer interactivity for security and stability. 

The goal was to demonstrate how Chord works. And for that, a read-only visualization of a controlled backend cluster is perfect.

If you want to test out true peer-to-peer interactivity, you'd have to clone [the repo](https://github.com/zde37/Torus) and run it

## Architecture Overview: How It All Fits Together

Here's the complete picture:

```
┌──────────────────────────────────────────┐
│         FRONTEND (Browser)               │
│  Next.js + React + D3.js                 │
│  - Ring Visualization                    │
│  - Node Details Panel                    │
│  - Demo Operations                       │
└─────────────┬────────────────────────────┘
              │ HTTP REST + WebSocket
              │ (Read-only)
┌─────────────▼────────────────────────────┐
│         API GATEWAY (Go)                 │
│  HTTP Server + WebSocket Hub             │
│  - Rate limiting                         │
│  - Request validation                    │
└─────────────┬────────────────────────────┘
              │ gRPC (Internal)
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│ Node1 │ │ Node2│ │ Node3│ │ Node4│
│ :8440 │ │ :8441│ │ :8442│ │ :8443│
└───────┘ └──────┘ └──────┘ └──────┘
    Chord Ring (gRPC Communication)
```

**Frontend to API Gateway**: HTTP/WebSocket for compatibility and ease of use

**API Gateway to Nodes**: gRPC for performance and type safety

**Node to Node**: gRPC for efficient Chord protocol operations

This hybrid approach gives me the best of both worlds: browser compatibility where needed, performance where it matters.

## Real Implementation Challenges

Theory is clean. Implementation is messy. Here are some challenges I faced:

### Challenge 1: Concurrent Finger Table Updates

Multiple goroutines were reading and writing the finger table simultaneously:
- Stabilization goroutine updating fingers
- RPC handlers serving lookup requests
- Background fix_fingers updating individual entries

**Solution**: Read-write mutexes (`sync.RWMutex`). Multiple readers can proceed concurrently, but writers get exclusive access. This required careful lock ordering to avoid deadlocks.

### Challenge 2: Graceful Shutdown

When a node shuts down, it should:
1. Transfer keys to its successor
2. Notify predecessor and successor
3. Stop accepting new requests
4. Wait for in-flight RPCs to complete
5. Close connections

But what if shutdown takes longer than the timeout? What if the successor is also shutting down?

**Solution**: Best-effort transfer with timeouts. If transfer fails, rely on replication keys exist at successor nodes anyway. Use context cancellation to signal shutdown to all goroutines.

### Challenge 3: Wraparound Arithmetic
The identifier space wraps at 2^m. In a 3-bit space (0-7), is key 2 between node 6 and node 4?

Yes, because we go from 6: 6 → 7 → 0 → 1 → 2 → 3 → 4 (when wrapping through 0)

Getting this wrong caused keys to route to incorrect nodes, which I caught during integration tests with randomized node positions.

**Solution**: A helper function `between(id, start, end)` that properly handles wraparound. Every range check uses this function.

## What's Next

We've covered the architecture, the *what* and *why* of Torus's technology choices. In the next post, we'll go deeper: **actual code**.

I'll walk you through:
- The `ChordNode` struct and how state is managed
- Implementing finger table lookups in Go
- The stabilization goroutine and how it maintains correctness
- gRPC service definitions and how they map to Chord operations
- Real code snippets with line-by-line explanations

No more theory. Just code, bugs, and the messy reality of building distributed systems.

---

**Further Reading:**

- [gRPC vs REST: Performance Comparison](https://aws.amazon.com/compare/the-difference-between-grpc-and-rest/) - AWS deep dive
- [D3.js Gallery](https://observablehq.com/@d3/gallery) - Examples of D3 visualizations