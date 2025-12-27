---
layout: post
title: "Breaking the Glass: A Deep Dive into Go's Unsafe Package (Part 2)"
description: "Master pointer arithmetic in Go using unsafe. Learn the pointer arithmetic dance and understand the risks of uintptr conversions."
tags: [Go, Unsafe, Memory, Performance]
---

# Breaking the Glass: A Deep Dive into Go's Unsafe Package (Part 2)

In Part 1, we established the hierarchy of danger: `*T` is safe, `unsafe.Pointer` is the shapeshifter, and `uintptr` is the invisible mask that hides objects from the Garbage Collector.

Now, we move from theory to mechanics. We are going to do the one thing Go explicitly tries to stop you from doing: **Pointer Arithmetic.**

## The Arithmetic of Chaos

In C or C++, iterating over an array via pointers is trivial: `ptr++`.
In Go, if you try `ptr++`, the compiler will yell at you. Go wants you to use slices and indices (`arr[i]`) because they are bounds-checked and safe.

But sometimes, you need raw speed, or you are interacting with a C library that expects a pointer offset, or you need to read data that doesn't strictly align with a standard Go type.

To do this, we have to perform the **Pointer Arithmetic Dance**.

### The Dance Steps

Since you cannot do math on a `*T` or an `unsafe.Pointer`, you must convert to an integer (`uintptr`), do the math there, and then immediately convert back.

The formula is always:


In Go code, that looks like this:

```go
// The standard pattern
p := unsafe.Pointer(uintptr(basePtr) + offset)

```

**Note:** As mentioned in Part 1, this *entire expression* must happen in one line so the Garbage Collector doesn't collect the object while it's momentarily just a number.

### Use Case 1: The "Manual" Slice Iteration

Let’s look at how an array is laid out in memory. It is a contiguous block. If you have an array of `int64` (which is 8 bytes wide), the second element is exactly 8 bytes away from the first.

```go
func main() {
	arr := []int64{10, 20, 30, 40}

	// 1. Get the pointer to the first element (the base)
	basePtr := unsafe.Pointer(&arr[0])

	// 2. The size of one item
	itemSize := unsafe.Sizeof(arr[0]) // returns 8

	// 3. Let's access the 3rd element (index 2) manually
	// Math: base + (2 * 8 bytes)
	ptrToIndex2 := unsafe.Pointer(uintptr(basePtr) + (2 * itemSize))

	// 4. Cast back to a typed pointer to read it
	val := *(*int64)(ptrToIndex2)
	
	fmt.Printf("Value at index 2: %d\n", val) // Output: 30
}

```

**Why would you do this?**
In pure Go, you wouldn't. `arr[2]` is cleaner. But this becomes critical when you are parsing binary data streams where you don't have a pre-defined struct, or when implementing low-level serialization libraries where you are writing bytes directly to a buffer.

---

## Deep Dive: Structs, Offsets, and Alignment

This is where `unsafe` gets tricky. You might think that if you have a struct, the fields are just lined up one after another.

**They are not.**

Computers are picky eaters. A 64-bit CPU prefers to read 8 bytes (64 bits) at a time, starting at addresses divisible by 8. If you try to read a 64-bit integer starting at address `0x03`, the CPU has to do two reads and stitch them together (or on some architectures like ARM, it might just crash).

To prevent this, the Go compiler inserts **Padding bytes**.

Consider this struct:

```go
type Human struct {
	IsAlive bool    // 1 byte
	Age     int64   // 8 bytes
}

```

You might expect `Sizeof(Human)` to be 9 bytes (1 + 8).
But if you run `unsafe.Sizeof(Human{})`, it will report **16 bytes**.

Why?
The `IsAlive` bool takes 1 byte. The next field, `Age`, is an `int64`. It *must* start on an 8-byte boundary. So the compiler inserts **7 bytes of garbage padding** after `IsAlive`.

### The `Offsetof` Tool

If you want to use pointer arithmetic to access the `Age` field manually, you cannot just guess "add 1 byte." You must ask the compiler for the offset.

```go
func main() {
	h := Human{IsAlive: true, Age: 33}

	// Get base pointer
	base := unsafe.Pointer(&h)

	// Calculate address of Age
	// unsafe.Offsetof(h.Age) handles the padding logic for you
	agePtr := unsafe.Pointer(uintptr(base) + unsafe.Offsetof(h.Age))

	fmt.Println(*(*int64)(agePtr)) // Output: 33
}

```

### The "Forbidden Fruit": Accessing Unexported Fields

This is arguably the most common (and controversial) use of `unsafe`. Go's visibility rules (capitalized vs. lowercase) are enforced by the compiler. But memory is memory. If you know the offset, you can read—and write—private fields.

Imagine a library you imported has this struct:

```go
package secret

type Vault struct {
	password string // unexported! You can't access this normally.
}

```

If you try `v.password`, the compiler stops you. But with `unsafe`, we can bypass the compiler's visibility checks.

```go
package main

import (
	"fmt"
	"unsafe"
	"yourproject/secret" // assuming the package above
)

func main() {
	v := secret.NewVault("OpenSesame")

	// We know 'password' is the first field, so offset is 0.
	// We cast the *Vault to a *string directly.
	
	// DANGER: This relies on implementation details of 'Vault'.
	// If the library author adds a field before 'password', this breaks!
	pwPtr := (*string)(unsafe.Pointer(v))

	fmt.Println("Hacked password:", *pwPtr)
	
	// We can even change it
	*pwPtr = "Hacked!"
}

```

**Warning:** This is extremely brittle. If the `secret` package author updates their code and moves the `password` field, or adds a mutex at the top of the struct, your offset calculation is wrong, and you will be overwriting random memory. This is why it is called "unsafe."

---

## Modern Go: `unsafe.Add` and `unsafe.Slice`

Because the `uintptr` math dance is so error-prone (remember the GC rule from Part 1?), Go 1.17 introduced helper functions to make this cleaner.

Instead of casting to `uintptr`, adding, and casting back, you can now use:

```go
// The modern, slightly safer way (Go 1.17+)
// It handles the pointer arithmetic without exposing the raw uintptr
ptr := unsafe.Add(basePtr, offset)

```

There is also `unsafe.Slice`, which is a superpower. It lets you turn any memory address into a standard Go slice.

```go
// Turn a random pointer into a []byte of length 10
data := unsafe.Slice((*byte)(ptr), 10)

```

This effectively lets you "view" raw memory as a Go slice without allocating new memory or copying data.

## Summary of Part 2

We have learned that memory is just a grid of bytes.

* **Structs have holes:** Always use `unsafe.Offsetof` rather than guessing, because of alignment padding.
* **Math requires casting:** You must convert to `uintptr` to add offsets, but you must convert back immediately.
* **Privacy is a compile-time concept:** At runtime, `unsafe` allows you to read and write unexported fields, provided you know where they live.

We now have the power to read anything and walk anywhere in memory. But with great power comes great segfaults.

In the final **Part 3**, we will look at the "Dragons." We will discuss **Endianness** (why your code might fail on different CPUs), **Zero-Copy Optimization** (the legitimate reason to use unsafe), and the **Go Compatibility Guarantee** (or lack thereof for unsafe code).
