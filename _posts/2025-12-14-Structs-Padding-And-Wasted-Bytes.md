---
layout: post
title: "Part 2: Structs, Padding, and Wasted Bytes"
description: "Master struct padding in Go and learn how to optimize memory layout. Save RAM by reordering fields and understanding alignment requirements."
tags: [Go, Memory, Performance, Optimization]
---

# Part 2: Structs, Padding, and "Wasted" Bytes

## Playing Tetris with Your RAM (Struct Padding)

In Part 1, we established that CPUs are "picky eaters." They want data served in clean, aligned chunks (words). We also left you with a cliffhanger:

```go
type MyStruct struct {
    myBool  bool   // 1 byte
    myInt   int64  // 8 bytes
}

```

We expected this struct to weigh in at **9 bytes** (1 + 8). But when we asked Go (`unsafe.Sizeof`), it reported **16 bytes**.

Where did those extra 7 bytes come from? Why is Go wasting nearly 50% of the memory for this struct?

Welcome to the world of **Struct Padding**.

## The "Align or Die" Mentality

Let's visualize memory as a grid of 8-byte slots (since we are likely on a 64-bit machine).

Your CPU wants to read `myInt` (the `int64`) in a single gulp. To do that, `myInt` **must** start at an address divisible by 8 (address 0, 8, 16, etc.).

Now, let's look at how Go lays out `MyStruct`:

1. **Address 0:** Go places `myBool`. It takes 1 byte.
2. **Address 1:** Go *wants* to place `myInt`. But wait! Address 1 is **not** divisible by 8.

If Go placed the `int64` at address 1, it would span from address 1 to 9. The CPU would have to perform **two** reads (one for the word 0-7, one for the word 8-15) just to get that single integer.

So, the compiler intervenes. It says, "Hold on, `myInt` needs to start at address 8."

To make this happen, the compiler inserts **7 bytes of padding** (garbage data) after `myBool` just to push `myInt` over to the next clean 8-byte boundary.

The memory map looks like this:

| Byte Offset | Content | Note |
| --- | --- | --- |
| 0 | `myBool` | Actual Data |
| 1-7 | **PADDING** | Wasted Space! |
| 8-15 | `myInt` | Actual Data |

**Total Size:** 16 bytes.
**Effective Data:** 9 bytes.
**Waste:** 7 bytes (43%!).

## The "Bad" Struct vs. The "Good" Struct

This might seem trivial for one struct. But imagine you have a slice of 100 million of these structs in a high-frequency trading app. That 7-byte waste becomes **700 Megabytes** of dead RAM. That's real money on a cloud bill.

The solution? **Reordering.**

Let's look at a "Bad" struct with three fields:

```go
type BadStruct struct {
    myBool   bool   // 1 byte
    myInt    int64  // 8 bytes
    myBool2  bool   // 1 byte
}

```

**The Layout:**

1. `myBool` (1 byte)
2. *Padding* (7 bytes) -> To align the `int64`
3. `myInt` (8 bytes)
4. `myBool2` (1 byte)
5. *Padding* (7 bytes) -> **Wait, why more padding?**

**The Tail Padding Rule:**
Structs are often used in arrays/slices. To ensure that the *next* struct in the array starts at a proper alignment, the total size of the struct **must** be a multiple of its largest field's alignment.
Since `myInt` is 8 bytes, the total struct size must be a multiple of 8.
So, `1 + 7 + 8 + 1` = 17 bytes. The next multiple of 8 is **24**.
Go adds 7 *more* bytes at the end.

**Total Size:** 24 bytes.

Now, let's play Tetris. Let's group the small things together.

```go
type GoodStruct struct {
    myInt    int64  // 8 bytes
    myBool   bool   // 1 byte
    myBool2  bool   // 1 byte
}

```

**The Layout:**

1. `myInt` (8 bytes) -> Naturally aligned at 0.
2. `myBool` (1 byte) -> Address 8.
3. `myBool2` (1 byte) -> Address 9.
4. *Padding* (6 bytes) -> To round up to multiple of 8.

**Total Size:** 16 bytes.

By simply moving lines of code around, we reduced memory usage by **33%** (from 24 bytes down to 16 bytes). We didn't change the logic; we just organized the furniture.

## The Strategy: "Sort by Size"

You don't need to manually calculate offsets every time. A generally safe heuristic (rule of thumb) is to order your struct fields from **Largest to Smallest**.

1. Pointers / `int64` / `float64` (8 bytes)
2. `int32` / `float32` (4 bytes)
3. `int16` (2 bytes)
4. `bool` / `int8` (1 byte)

By placing the large, alignment-hungry types first, you guarantee they start on clean boundaries. Then, you can pack the smaller types into the remaining space at the tail end.

## The Corner Case: The Empty Struct `struct{}`

There is one weird exception to memory rules in Go: the `struct{}`. It consumes **0 bytes**.

You often see it in sets (implemented as `map[string]struct{}`). Since it has size zero, you can create a billion of them, and they theoretically take up no extra space.

*However*, there is a catch regarding alignment.

If a `struct{}` is the **last field** in a struct, Go might treat it differently.

```go
type Demo struct {
    number int64      // 8 bytes
    flag   struct{}   // 0 bytes
}

```

If you take the address of `flag` (`&d.flag`), it technically points to the byte *after* `number`.
If `struct{}` is the very last thing in a memory allocation, pointing to it might mean pointing to "invalid" memory (outside the object). This complicates the Garbage Collector's job.

To prevent this, if a zero-sized field is the last field, Go might add **1 byte of padding** just to ensure the pointer remains "inside" the allocation.

**Size of Demo:**

* Often returns **8 bytes**.
* But be careful if you embed it or use it in specific pointer scenarios; the compiler ensures safe addressing.

## Checking Your Work

You shouldn't have to guess. In Part 1, we used `unsafe.Sizeof`. Let's verify our "Bad" vs "Good" struct optimization.

```go
package main

import (
    "fmt"
    "unsafe"
)

type BadStruct struct {
    a bool
    b int64
    c bool
}

type GoodStruct struct {
    b int64
    a bool
    c bool
}

func main() {
    fmt.Printf("BadStruct size:  %d bytes\n", unsafe.Sizeof(BadStruct{}))
    fmt.Printf("GoodStruct size: %d bytes\n", unsafe.Sizeof(GoodStruct{}))
}

```

**Run this.** You will likely see:

```text
BadStruct size:  24 bytes
GoodStruct size: 16 bytes

```

## Conclusion

We just saved 33% of our memory without deleting a single piece of data. We simply respected the hardware's desire for order.

But memory layout isn't just about size. Sometimes, packing things too tightly can actually **crash** your program or destroy performance due to CPU caching issues.

In Part 3, we’re going to look at the invisible hardware lines that dictate speed: **False Sharing** and the **`sync/atomic` alignment requirements**.