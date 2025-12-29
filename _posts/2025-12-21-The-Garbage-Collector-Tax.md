---
layout: post
title: "Part 5: The Garbage Collector Tax (Pointers vs. Values)"
description: "Understand how pointers impact Go's garbage collector performance. Learn when to use values vs pointers to minimize GC latency in high-performance applications."
tags: [Go, Memory, Performance, GarbageCollector]
series: memory-alignment
series_part: 5
---

# Part 5: The Garbage Collector Tax (Pointers vs. Values)

We have spent the last four articles obsessing over bytes. We aligned our structs, we padded our cache lines, and we dissected interface headers.

But there is one final, invisible cost to your memory layout decisions. It’s a cost you don’t pay in RAM—you pay it in **CPU cycles** and **Latency**.

It’s the **Garbage Collector (GC) Tax**.

In Go, the GC is a highly optimized piece of engineering. It runs concurrently, it’s low latency, and it usually "just works." But it is not magic. It has to follow the laws of physics (and computer science).

The rule is simple: **The more pointers you have, the harder the GC has to work.**

## The Scanner's Job (Simplified Version)

Whenever the heap grows enough (by default, when it doubles) or periodically every ~2 minutes, the Go GC wakes up. Its job is to figure out which memory is "live" (still in use) and which is "dead" (can be deleted).

To do this, it performs **a tri-color mark and sweep**. It starts at the "roots" (global variables, stack variables) and follows every single pointer it finds to discover the rest of the object graph.

* If it finds an `int64`, it ignores it. An integer can't point to other memory.
* If it finds a `*int64` (pointer), it **must** follow it. That pointer might lead to another struct, which leads to another, and another.

This traversal takes time. And if you design your data structures poorly, you can accidentally turn the GC's job into a nightmare.

## The classic showdown: `map[int]*Struct` vs `map[int]Struct`

Let’s say you are building a cache for 10 million user sessions. You have two options for your map.

**Option A: Map of Pointers**

```go
type User struct {
    ID   int64
    Age  int64
}

// Storing pointers to users
myCache := make(map[int]*User, 10_000_000) 

```

**Option B: Map of Values**

```go
// Storing the struct directly (by value)
myCache := make(map[int]User, 10_000_000)

```

**Which one is faster?**

In **Option A**, the map buckets contain pointers.
When the GC runs, it looks at the map. It sees 10 million pointers. It must pause and check **every single one of them** to mark the `User` objects they point to as "live." That is 10 million checks.

In **Option B**, the map buckets contain the `User` structs *inline*.
The GC looks at the map. It checks the type of the map's value (`User`). It notices that `User` contains **no pointers** (just two `int64`s).
The GC realizes: *"Wait, this entire map is just one giant block of integers. There are no pointers escaping from here to anywhere else."*

It marks the **entire map** as "Scan Not Needed."
It skips scanning the 10 million entries entirely.

**The Difference?**
In benchmarks, scanning the map of pointers can take **hundreds of milliseconds** (causing visible lag spikes). Scanning the map of values takes **microseconds**.

## The "No-Pointer" Optimization

This is the secret weapon of high-performance Go libraries like **BigCache** or **FastCache**.

To be totally invisible to the Garbage Collector, you need to ensure your data structures contain **zero pointers**.

* Use `int64` IDs instead of `*string` references.
* Use timestamps (`int64`) instead of `time.Time` (which contains a pointer internally).
* Avoid strings if possible (remember, a `string` header contains a pointer!).

If you embed a `string` in your struct, the map optimization breaks.

```go
type User struct {
    ID   int64
    Name string // <--- This has a pointer!
}
// map[int]User <-- GC MUST scan this now.

```

Because `Name` contains a pointer to the backing array, the GC has to scan every user again to ensure the string data isn't deleted.

### So, how do we store strings without pointers?

The extreme optimization (used by database engines) is to replace `string` with a fixed-size array or an offset into a giant byte slice.

```go
type User struct {
    ID       int64
    NameBuf  [64]byte // A flat array of bytes. No pointers here!
}

```

Now, `map[int]User` is once again invisible to the GC.

## Code Proof

You can verify this behavior by looking at the GC trace logs.

Run a program that allocates a massive map of pointers, and run it with `GODEBUG=gctrace=1`. You will see the "GC CPU fraction" spike.
Change it to a map of pointer-free values, and watch the CPU usage drop to near zero.

## Conclusion

Memory layout isn't just about saving RAM bytes; it's about saving **CPU cycles**.

* **Pointers = Graph Traversal.** The GC has to chase them.
* **Values = Flat Memory.** The GC can often ignore them.

By flattening your data structures (using values instead of pointers, and indices instead of references), you don't just reduce cache misses, you give the Garbage Collector a vacation.

We have covered sizes, padding, cache lines, complex headers, and now the GC. You are essentially a Go memory expert now(sort of).

But... are you really going to calculate struct padding manually for every single struct you write? That sounds like a terrible job.

In **Part 6**, the finale, I’m going to show you the **Tooling**. We will look at how to automate everything we've learned so you can get perfectly aligned structs without ever doing math yourself.