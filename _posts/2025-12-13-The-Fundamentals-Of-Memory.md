# Part 1: The Fundamentals of Memory

## The Hidden Cost of Your Variables
You declare a variable, you pay for the memory, right? If you type `var b bool`, you expect to use 1 bit of RAM. If you type `var i int64`, you expect 64 bits. Simple math.

Well, not exactly.

If you’ve ever tried to optimize a Go program for high performance, or if you’ve ever wondered why your struct is taking up 30% more RAM than your napkin math predicted, you have likely collided with the invisible wall of **Memory Alignment**.

In this series, we are going to tear apart Go’s memory model. We aren't just going to look at _what_ happens; we are going to look at _why_ the hardware forces Go to behave this way.

Today, we start with the basics: **Sizes and the CPU's appetite.**

## The "Word" and the "Bite"

#### _IMPORTANT NOTE: This analogy helps in understanding the general idea, but the reality of how CPUs access memory is more complex and nuanced than simply "gulping" fixed "Words". While accessing a full "word" is often the most efficient operation, modern CPUs are perfectly capable of reading or writing single bytes._

To understand Go memory, you have to sympathize with your CPU.

We tend to think of memory like a long, continuous tape of single bytes. We imagine the CPU reading byte #1, then byte #2, then byte #3.

But CPUs are picky eaters. They don't like nibbling on single bytes. They prefer to gulp down data in chunks called **Words**.

- On a **32-bit system**, a "word" is 4 bytes.
- On a **64-bit system** (which you are likely using right now), a "word" is 8 bytes.

Why does this matter? Because fetching memory is expensive. If you ask the CPU for an `int64` (8 bytes), it wants to grab that entire 8-byte chunk in **one single cycle**.

If you mistakenly place that `int64` at an odd memory address (say, splitting it across two different "words"), the CPU has to fetch the first word, fetch the second word, stitch them together, and then give you the result. That is two cycles for the price of one.

To prevent this performance penalty, the Go compiler (and the hardware) enforces **Natural Alignment**. This leads to our first golden rule:

> **The Golden Rule:** A data type of size $N$ usually demands to start at a memory address divisible by $N$.

## The Cast of Characters (Go Types)

Before we get into the complexities of structs, let's verify the "atomic" sizes of Go's primitive types. Most of these are fixed regardless of your machine, but there is one massive imposter among them.

### Fixed-Size Types

These are reliable. No matter if you are running on a Raspberry Pi or a massive AWS server, their sizes are constant:

- `bool`: **1 byte**. (Yes, it’s 1 byte, not 1 bit. We can't address single bits in RAM).
- `int8` / `uint8` / `byte`: **1 byte**.
- `int16` / `uint16`: **2 bytes**.
- `int32` / `uint32` / `rune` / `float32`: **4 bytes**.
- `int64` / `uint64` / `float64` / `complex64`: **8 bytes**.

### The Architecture Dependent Imposter: `int`

Here is where bugs often hide.
When you type `var x int`, how big is `x`?

- On a 32-bit architecture: **4 bytes**.
- On a 64-bit architecture: **8 bytes**.

This applies to `uint` and `uintptr` as well. This is why you should never assume `int` is 32 bits, and it's why casting pointers to integers requires special care.

## Verifying Reality with `unsafe`

Don't just take my word for it. Go gives us a backdoor to inspect exactly how the runtime sees these variables. It's called the `unsafe` package (aptly named, but safe enough for inspection).

We are interested in two functions:

1. **`unsafe.Sizeof(x)`**: How many bytes does `x` consume?
2. **`unsafe.Alignof(x)`**: What multiple of memory address does `x` need to start at? (e.g., if this returns 8, the address must be divisible by 8).

Here is a script you can run on your machine right now. I encourage you to try this on different architectures (like the Go Playground vs. your local machine) to see if anything changes.

```go
package main

import (
	"fmt"
	"unsafe"
)

func main() {
	var (
		a bool    // The tiny one
		b int64   // The big integer
		c string  // Strings are actually structs under the hood (Pointer + Length)
		d []int   // Slices are 24 bytes on 64-bit archs (Pointer + Len + Cap)
		e int16   // The short one
		f float32 // The standard float
		g int     // Arch dependent
	)

	fmt.Printf("Bool:    %d byte,  Align: %d\n", unsafe.Sizeof(a), unsafe.Alignof(a))
	fmt.Printf("Int64:   %d bytes, Align: %d\n", unsafe.Sizeof(b), unsafe.Alignof(b))
	fmt.Printf("String:  %d bytes, Align: %d\n", unsafe.Sizeof(c), unsafe.Alignof(c))
	fmt.Printf("Slice:   %d bytes, Align: %d\n", unsafe.Sizeof(d), unsafe.Alignof(d))
	fmt.Printf("Int16:   %d bytes, Align: %d\n", unsafe.Sizeof(e), unsafe.Alignof(e))
	fmt.Printf("Float32: %d bytes, Align: %d\n", unsafe.Sizeof(f), unsafe.Alignof(f))
	fmt.Printf("Int:     %d bytes, Align: %d\n", unsafe.Sizeof(g), unsafe.Alignof(g))
}

```

### What did you notice?

If you ran that on a standard laptop, you probably saw something interesting about **Strings** and **Slices**.

- **Strings are 16 bytes.** Wait, even for an empty string `""`? Yes. Because a string in Go is effectively a "header" struct containing a **Pointer** (8 bytes) to the backing array and a **Length** (8 bytes).
- **Slices are 24 bytes.** They contain a **Pointer** (8 bytes), **Length** (8 bytes), and **Capacity** (8 bytes).

Understanding these "Headers" is crucial. When you pass a slice to a function, you are copying those 24 bytes. When you pass a string, you are copying 16 bytes.

## Up Next: The Padding Problem

So, we know a `bool` is 1 byte and an `int64` is 8 bytes.

Here is a riddle to end this section. If I create a struct with just those two things:

```go
type MyStruct struct {
    myBool  bool   // 1 byte
    myInt   int64  // 8 bytes
}

```

Mathematically, $1 + 8 = 9$. But if you run `unsafe.Sizeof(MyStruct{})`, Go will tell you it occupies **16 bytes**.

Where did the other 7 bytes go? They didn't disappear, they are "padding," a.k.a wasted memory. And in the next section, we are going to learn how to play "Struct Tetris" to reclaim that wasted space.
