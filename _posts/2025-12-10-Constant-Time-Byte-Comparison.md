---
layout: post
title: "Cryptographic Security: Constant-Time Byte Comparison"
description: "Learn how timing attacks work and why constant-time byte comparison is critical for cryptographic security in Go. Deep dive into Go's crypto package implementation."
tags: [Go, Security, Cryptography]
---

# Cryptographic Security: Constant-Time Byte Comparison

*Ever wondered what stands between your secret key comparison and a hacker with a stopwatch? Let's dive in.*

---

## **The Story Behind This Article**

Picture this: You're trying to authenticate into an app or service. You type your secret key and hit enter. Behind the scenes, the app compares your secret key to the stored hash. Simple, right?

**Wrong.**

That simple comparison just opened a door for hackers to potentially guess your secret, not by brute force, but by *listening to how long it takes*.

Today, I'm going to show you a piece of code that solves this problem. It's only a few characters long, but every single character is there for a reason. By the end of this article, you'll understand why constant-time comparisons are important.

---

## **The Code That Started It All**

```go
func ConstantTimeByteEq(x, y uint8) int {
    return int((uint32(x^y) - 1) >> 31)
}
```

I took this function from Go's `crypto/internal/fips140/subtle` package, and looking at it for the first time, you'd think: *"This is unnecessarily complex. Why not just use `==`?"*

Well, the key point here is `Timing Attacks`.

---

## **Part 1: The Attack You Didn't Know Existed**

### **Let's Start With The "Obvious" Solution**

Here's what most developers would write:

```go
func CompareSecrets(entered, stored string) bool {
    if entered == stored {
        return true
    }
    return false
}
```

Looks innocent, right? **This code will get you hacked.**

### **The Stopwatch Attack**

Let me show you how an attacker thinks. Imagine they're trying to guess your secret "secret123":

**Attempt 1: Guessing "aaaaaaaaa"**
```
App compares:
's' vs 'a' → Different! Return false immediately
Time taken: 0.001 milliseconds
```

**Attempt 2: Guessing "saaaaaaaa"**
```
App compares:
's' vs 's' → Match! Continue...
'e' vs 'a' → Different! Return false
Time taken: 0.002 milliseconds (slightly longer!)
```

**Attempt 3: Guessing "seaaaaaaa"**
```
App compares:
's' vs 's' → Match!
'e' vs 'e' → Match!
'c' vs 'a' → Different!
Time taken: 0.003 milliseconds (even longer!)
```

**See the pattern?** The more characters that match, the longer the comparison takes. An attacker can:

1. Try all possible first characters
2. Find the one that takes longest → that's the correct first character
3. Repeat for the second character
4. Repeat for the third...

Instead of guessing `62^9` combinations (13 trillion for a 9-character secret), they only need `62 × 9 = 558` attempts!

**Your secret key just got hacked with a stopwatch.** ⏱️

---

## **Part 2: Enter Constant-Time Operations**

This is where our magical one-liner comes in:

```go
func ConstantTimeByteEq(x, y uint8) int {
    return int((uint32(x^y) - 1) >> 31)
}
```

No matter what values you give it, this function takes **exactly the same amount of time** to execute. Equal bytes? Same time. Different bytes? Same time.

But *how*? Let's break it down piece by piece.

---

## **Part 3: The XOR Operation — Our Foundation**

```go
x ^ y  // XOR (exclusive or)
```

### **What's XOR?**

Think of XOR as the "difference detector." It compares two numbers bit-by-bit:

```
  5 in binary: 00000101
  3 in binary: 00000011
  ─────────────────────
  5 ^ 3:       00000110  (= 6)
```

**The Rule:**
- Same bit (0^0 or 1^1) → 0
- Different bits (0^1 or 1^0) → 1

### **The Beautiful Property**

Here's what makes XOR perfect for our use case:

```go
5 ^ 5 = 0   // Equal bytes always give 0
5 ^ 3 = 6   // Different bytes always give non-zero
```

**Question for you:** *Can you think of another operation that always returns 0 for equal values?*

Subtraction, right? `5 - 5 = 0`

**But here's the catch:**
```go
5 - 5 = 0    ✓ Correct
5 - 3 = 2    ✓ Correct
3 - 5 = ???  // With uint8, this underflows to 254!
```

With subtraction, we'd have to worry about which value is larger. XOR doesn't care — it's **symmetric**:

```go
x ^ y  ==  y ^ x  // Always true!
```

That's why we use XOR as our first step. **Clean. Simple. Symmetric.**

---

## **Part 4: The uint32 Conversion — More Than Meets The Eye**

```go
uint32(x^y)
```

You might be thinking: *"Wait, we're comparing two `uint8` bytes. Why convert to `uint32`?"*

Great question! Let me show you what happens if we *don't* convert:

### **The uint8 Trap**

```go
// Attempting with uint8 (DON'T DO THIS!)
func BrokenVersion(x, y uint8) int {
    return int((x^y - 1) >> 7)
}
```

Let's test this broken version:

```
Test 1: x=5, y=5 (should return 1 for equal)
  5 ^ 5 = 0
  0 - 1 = 255 (underflow in uint8)
  255 in binary: 11111111
  255 >> 7 = 1  ✓ Looks good so far...

Test 2: x=5, y=3 (should return 0 for different)
  5 ^ 3 = 6
  6 - 1 = 5
  5 in binary: 00000101
  5 >> 7 = 0  ✓ Still works...

Test 3: x=255, y=0 (should return 0 for different)
  255 ^ 0 = 255
  255 - 1 = 254
  254 in binary: 11111110
  254 >> 7 = 1  ❌ WRONG! This says they're equal!
```

**The problem?** With 8 bits, many different bytes still have the highest bit (bit 7) set after subtracting 1.

### **Why uint32 Solves This**

With 32 bits, we have much more room:

```
uint8 range:  0 to 255 (8 bits)
uint32 range: 0 to 4,294,967,295 (32 bits)

After XOR, our result is still just 0-255
After converting to uint32: still 0-255
After subtracting 1: -1 to 254

But here's the key:
  uint32(0) - 1 = 4,294,967,295 (ALL 32 BITS SET!)
  uint32(255) - 1 = 254 (only bottom 8 bits affected)
```

When we shift right by 31, only that huge underflow value has a bit left!

### **But Why Not uint16 or uint64?**

**uint16 would actually work!** But:
- uint32 is the natural word size for most modern CPUs
- It matches what the rest of Go's crypto library uses
- It's the sweet spot between "enough bits" and "not wasteful"

**uint64 would work too**, but:
- We'd have to shift by 63 instead of 31
- It's overkill (we only need 32 bits)
- Slightly less efficient on 32-bit systems

**Bottom line:** uint32 is the Goldilocks choice — *just right*.

---

## **Part 5: Subtract 1 — The Most Clever Part**

```go
uint32(x^y) - 1
```

This is where the magic happens. Let me ask you a question:

**Why subtract? Why not add, multiply, or use bitwise operations?**

Let me show you why every other operation fails:

### **Option 1: What If We Added 1?**

```go
uint32(x^y) + 1
```

```
Equal case:     0 + 1 = 1
Different case: 1 + 1 = 2
Different case: 255 + 1 = 256

All positive numbers! Bit 31 is 0 in all cases!
Can't distinguish equal from different ❌
```

### **Option 2: What If We Multiplied?**

```go
uint32(x^y) * 2
```

```
Equal case:     0 * 2 = 0
Different case: 1 * 2 = 2

Zero stays zero! Can't transform it ❌
```

### **Option 3: What If We Used Bitwise NOT?**

```go
^uint32(x^y)  // Flip all bits
```

```
Equal case:     ^0 = 4,294,967,295
                Binary: 11111111111111111111111111111111
                Bit 31: 1

Different case: ^1 = 4,294,967,294
                Binary: 11111111111111111111111111111110
                Bit 31: 1 (still set!)

Both cases have bit 31 set! ❌
```

### **Why Subtract 1 Is Perfect**

Here's the genius insight:

**In unsigned arithmetic, `0 - 1` underflows to the maximum value!**

```
uint32(0) - 1 = 4,294,967,295
Binary: 11111111111111111111111111111111
        ↑ Bit 31 is 1!

uint32(1) - 1 = 0
Binary: 00000000000000000000000000000000
        ↑ Bit 31 is 0!

uint32(255) - 1 = 254
Binary: 00000000000000000000000011111110
        ↑ Bit 31 is 0!
```

**The pattern:**
- **Only** when we start from exactly 0 does the subtraction set all 32 bits
- **Any other value** (1-255) stays in the range 0-254, keeping bit 31 clear

### **Why Not Subtract 2, 10, or 100?**

```go
// What if we subtracted 2?
uint32(0) - 2 = 4,294,967,294  // Bit 31: 1 ✓
uint32(1) - 2 = 4,294,967,295  // Bit 31: 1 ❌ (underflow!)
uint32(2) - 2 = 0              // Bit 31: 0 ✓
```

Subtracting any value larger than 1 causes underflow for small non-zero results!

**Only `-1` creates a clean boundary:** underflow happens exclusively at 0, nowhere else.

---

## **Part 6: Right Shift by 31 — The Final Extraction**

```go
>> 31
```

We're on the home stretch! We now have:
- `0xFFFFFFFF` (all bits set) when bytes are equal
- `0x00000000` to `0x000000FE` when bytes are different

We need to extract just bit 31.

### **The Shift Operation Visualized**

```
Original (equal case):
Bit: 31 30 29 28 ... 3  2  1  0
Val:  1  1  1  1 ...  1  1  1  1  = 4,294,967,295

After >> 31:
Bit: 31 30 29 28 ... 3  2  1  0
Val:  0  0  0  0 ...  0  0  0  1  = 1
```

The shift "pushes" bit 31 all the way to position 0, discarding everything else.

### **Why Right Shift and Not Left Shift?**

```go
// Left shift (<<)
0xFFFFFFFF << 31 = 0x80000000  // Bit 31 is set, but value is huge!
```

Left shift would move bit 0 *toward* bit 31, giving us a giant number instead of clean 0/1.

### **Why Not Use Bitwise AND?**

```go
(uint32(x^y) - 1) & 0x80000000  // Mask bit 31
```

This *would* work, but:

```
Equal case:     0xFFFFFFFF & 0x80000000 = 0x80000000 (2,147,483,648)
Different case: 0x000000FE & 0x80000000 = 0x00000000 (0)
```

We'd still need to shift: `>> 31` to get 1 or 0. So why do two operations when one suffices?

### **Why Exactly 31?**

A uint32 has 32 bits, numbered 0 to 31:

```
Bits:   31 30 29 ... 2  1  0
        ↑               ↑
        MSB            LSB
```

Shifting right by 31 moves the **most significant bit** to the **least significant position**:

```
>> 30  → Keeps 2 bits (result: 0, 1, 2, or 3)
>> 31  → Keeps 1 bit (result: 0 or 1) ✓
>> 32  → Undefined! (shifting by full width is dangerous)
```

**Perfect.** We get exactly what we need: 0 or 1.

---

## **Part 7: Why Return `int` Instead of `bool`?**

```go
func ConstantTimeByteEq(x, y uint8) int  // Why int?
```

This seems counterintuitive! A comparison should return `bool`, right?

**Here's why returning `int` is actually safer:**

### **Problem 1: Bool Conversion Might Not Be Constant-Time**

```go
// What the compiler MIGHT generate for bool:
func ConstantTimeByteEq(x, y uint8) bool {
    result := (uint32(x^y) - 1) >> 31
    if result == 1 {  // 🚨 BRANCH! 🚨
        return true
    }
    return false
}
```

That `if` statement reintroduces the timing vulnerability we're trying to avoid!

### **Problem 2: Cryptographic Code Needs Arithmetic**

In real cryptographic code, we often do math with comparison results:

```go
// ConstantTimeSelect: returns x if v == 1 and y if v == 0.
func ConstantTimeSelect(v, x, y int) int { 
  return ^(v-1)&x | (v-1)&y 
}

// Example: Select secret based on comparison
equalResult := ConstantTimeByteEq(userByte, storedByte)
value := ConstantTimeSelect(equalResult, secretA, secretB)
```

**With bool, you'd need conversion:**

```go
var condInt int
if boolResult {  // 🚨 Another branch! 🚨
    condInt = 1
} else {
    condInt = 0
}
```

Each conversion is a potential timing leak!

### **The Real Reason**

Returning `int` directly:
1. Avoids extra conversions
2. Prevents accidental branches
3. Matches the `crypto/internal/fips140/subtle` API
4. Enables constant-time conditional operations

---

## **Part 8: Let's Watch It Work (With Real Numbers!)**

Now that we understand every piece, let's trace through actual examples:

### **Example 1: Comparing Equal Bytes (42 and 42)**

```
Input: x = 42, y = 42

Step 1: XOR
  42 ^ 42 = 0
  Binary: 00000000

Step 2: Convert to uint32
  uint32(0) = 0
  Binary: 00000000000000000000000000000000

Step 3: Subtract 1 (UNDERFLOW!)
  0 - 1 = 4,294,967,295
  Binary: 11111111111111111111111111111111
          ↑ All 32 bits are set!

Step 4: Right shift by 31
  4,294,967,295 >> 31 = 1
  Binary: 00000000000000000000000000000001

Step 5: Convert to int
  int(1) = 1


Result: 1 (bytes are EQUAL)
```

### **Example 2: Comparing Different Bytes (42 and 17)**

```
Input: x = 42, y = 17

Step 1: XOR
  42:  00101010
  17:  00010001
  ─────────────
  XOR: 00111011 = 59

Step 2: Convert to uint32
  uint32(59) = 59
  Binary: 00000000000000000000000000111011

Step 3: Subtract 1 (no underflow)
  59 - 1 = 58
  Binary: 00000000000000000000000000111010
          ↑ Bit 31 is still 0

Step 4: Right shift by 31
  58 >> 31 = 0
  Binary: 00000000000000000000000000000000

Step 5: Convert to int
  int(0) = 0


Result: 0 (bytes are DIFFERENT)
```

### **Example 3: Maximum Difference (255 and 0)**

```
Input: x = 255, y = 0

Step 1: XOR
  255 ^ 0 = 255
  Binary: 11111111

Step 2: Convert to uint32
  uint32(255) = 255
  Binary: 00000000000000000000000011111111

Step 3: Subtract 1
  255 - 1 = 254
  Binary: 00000000000000000000000011111110
          ↑ Bit 31 is 0 (only bottom bits affected)

Step 4: Right shift by 31
  254 >> 31 = 0


Result: 0 (bytes are DIFFERENT)
```

---

### **Attacks This Prevents**

1. **Secret cracking** — Can't guess secrets character-by-character
2. **JWT token forgery** — Can't verify valid tokens through timing
3. **API key enumeration** — Can't probe for valid keys
4. **Session hijacking** — Can't steal session identifiers
5. **Cryptographic key extraction** — Can't leak key material

**Real-world example:** In 2013, researchers used timing attacks to extract private keys from SSL/TLS servers. Constant-time comparisons are now mandatory in all major crypto libraries.

---

## **Conclusion: Security Through Mathematics**

When I started writing this article, the goal was to help readers understand why such a "simple" comparison needed such "complex" code.

Now I hope you see it differently.

This isn't complex — it's **elegant**. It's the minimal solution to a hard problem: comparing values without leaking information through time.

Most security vulnerabilities come from what we *don't think about*. We don't think about timing. We don't think about CPU branch prediction. We don't think about cache attacks.

But the cryptographers who wrote this code thought about all of it. And they distilled that thinking into one beautiful line of math.

### **Your Challenge**

Next time you write `if secret == storedHash`, ask yourself:

*"Am I opening a timing side-channel?"*

If the answer is *"maybe,"* reach for `crypto/internal/fips140/subtle`.

### **Final Thought**

Security isn't about making things complicated. It's about understanding the attack surface and closing every possible door — even the ones you didn't know existed.

---

**Questions? Thoughts?** Drop them in the comments below. I'd love to hear them!
