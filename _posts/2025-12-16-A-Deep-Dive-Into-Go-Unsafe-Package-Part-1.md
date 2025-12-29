---
layout: post
title: "Breaking the Glass: A Deep Dive into Go's Unsafe Package (Part 1)"
description: "Learn when and how to use Go's unsafe package. Understand the difference between *T, unsafe.Pointer, and uintptr, plus GC visibility rules."
tags: [Go, Unsafe, Memory, Performance]
series: unsafe-package
series_part: 1
---

# Breaking the Glass: A Deep Dive into Go's Unsafe Package (Part 1)

Go is famous for being a "nanny" language. It has a Garbage Collector (GC) that cleans up your mess, a strict type system that prevents you from adding apples to oranges, and boundary checks that stop you from reading memory you don't own.

But sometimes, the nanny is too slow. Or maybe you need to talk to the kernel, or parse a massive binary file without copying data.

In those moments, you have to break the glass. You have to import `unsafe`.

This is **Part 1** of a deep dive into Go’s most dangerous package. Today, we aren't doing any math. We are just going to meet the characters and understand the single most important rule that separates a working program from a random segfault: **Garbage Collector Visibility.**

## The Three Musketeers (of Memory)

To understand `unsafe`, you need to understand the three distinct ways Go lets you talk about memory.

### 1. The Good Citizen: `*T`

This is your standard pointer (`*int`, `*string`, `*MyStruct`).

* **Safety:** High. You cannot do arithmetic on it (no `ptr++`).
* **GC Visibility:** **Yes.** The Garbage Collector sees this pointer. If you have a `*MyStruct` pointing to an object, the GC promises not to delete that object.

### 2. The Shapeshifter: `unsafe.Pointer`

This is Go’s version of `void*` in C.

* **Safety:** Low. You can cast *any* pointer into an `unsafe.Pointer`, and cast an `unsafe.Pointer` into *any* other pointer. You can turn a `*int` into a `*float64`.
* **GC Visibility:** **Yes.** Crucially, the GC *still* sees this as a pointer. Even though it doesn't know *what* it points to, it knows it points to *something*. It will keep that object alive.

### 3. The Mask: `uintptr`

This is where people get hurt. `uintptr` is an integer type (like `uint` or `int`), but it's large enough to hold a memory address (64 bits on a 64-bit machine).

* **Safety:** None. It’s just a number.
* **GC Visibility:** **NO.** This is the big twist.

## The "Invisible" Object Problem

Here is the mental model you must adopt: **The Garbage Collector is a graph walker.**

When the GC wakes up, it starts at your "roots" (global variables, stack frames) and walks down every pointer it finds, marking objects as "Alive."

* If the GC finds a `*int`, it follows the line and marks the integer as Alive.
* If the GC finds an `unsafe.Pointer`, it follows the line and marks the object as Alive.
* If the GC finds a `uintptr`, **it stops.** It sees a number. It does not care that the number happens to be the memory address `0x123456`. It does not follow the line.

### The Code That Crashes

Imagine you have a struct called `User`. You want to get the memory address of that user to do some cool math later.

```go
// ❌ THIS IS A BUG
func main() {
    u := &User{Name: "Alice"}

    // 1. Convert to unsafe.Pointer, then to uintptr (just a number)
    addr := uintptr(unsafe.Pointer(u))

    // ... lots of other code happens here ...
    // The GC runs here. It sees 'u' is no longer used.
    // It looks at 'addr', but 'addr' is just a number, not a pointer.
    // The GC deletes the User object at 0x123456 to free up memory.

    // 2. Convert back to pointer
    ptr := (*User)(unsafe.Pointer(addr))
    
    // BOOM. 'ptr' now points to garbage memory.
    fmt.Println(ptr.Name) 
}

```

In the example above, between step 1 and step 2, the variable `u` is no longer needed by the program. The only thing "holding onto" that memory address is `addr`. But `addr` is a `uintptr`. The GC ignores it. The object gets deleted. When you cast it back in step 2, you are pointing at dead memory.

## The Golden Rule of Conversion

Because of this GC behavior, there is a strict set of rules for converting between these types.

1. **`*T`  `unsafe.Pointer**`: Safe(ish). You are just changing the type, but the GC still tracks the object.
2. **`unsafe.Pointer`  `uintptr**`: **DANGEROUS.**

You are allowed to convert `unsafe.Pointer` to `uintptr`, do math, and convert back to `unsafe.Pointer`, **but it must happen in a single step.**

Go recognizes this specific pattern and treats it as an atomic operation, ensuring the GC doesn't sweep the object away in the middle of your math.

```go
// ✅ THIS IS SAFE
// The compiler knows not to run GC between the conversion and the addition(this is a simplified statement)
ptr := unsafe.Pointer(uintptr(unsafe.Pointer(u)) + offset)

```

## Summary

* `unsafe.Pointer` is a bridge between types. The GC **sees** it.
* `uintptr` is an integer that holds an address. The GC **ignores** it.
* Never store a `uintptr` in a variable if you expect the object it points to to remain valid.

Now that we know the characters and the danger of the "Invisible Object," we are ready to do what we actually came here for: **Pointer Arithmetic.**

In **Part 2**, we will learn how to use `uintptr` to iterate over arrays, access struct fields without field names, and modify private memory.
