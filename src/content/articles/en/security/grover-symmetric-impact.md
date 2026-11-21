---
title: "Grover's Algorithm and Symmetric Cryptography: Is AES-128 Still Safe?"
description: "Quantum search gives only a quadratic speedup: why doubling key length is enough for symmetric ciphers, how to choose hashes, and how NIST's security categories are calibrated."
pubDate: 2026-11-21
lang: en
section: security
tags: ["Grover", "AES", "symmetric cryptography", "hashing"]
draft: false
featured: false
heroImage: "/images/security/grover.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "grover-symmetric-impact"
keyPoints:
  - "Grover gives a quadratic speedup for unstructured search: a 2^n key space costs about 2^(n/2) quantum queries — AES-128 drops to ~2^64, AES-256 still holds ~2^128."
  - "Each Grover iteration is a full quantum AES circuit with heavy error-correction overhead; under realistic depth limits, AES-128's practical margin is larger than the raw 2^64 figure suggests."
  - "The engineering answer is simple: AES-256 and SHA-384/512 for long-term secrets. Symmetric cryptography needs no redesign — unlike public-key cryptography."
---

A common misconception in post-quantum discussions is that quantum computers "break all cryptography." The reality is split: Shor's algorithm is an exponential blow against RSA and ECC, but against symmetric cryptography quantum computing has only one card to play — Grover's algorithm, a quadratic speedup. Quadratic sounds alarming; in practice it is answered by doubling key lengths.

## What Grover actually does

Grover's algorithm (1996) finds a marked item among $N$ unstructured candidates in $O(\sqrt{N})$ quantum queries instead of $O(N)$ classical trials. Against AES-128, classical brute force costs $2^{128}$; the quantum attack needs about $2^{64}$ iterations.

The devil is in what an "iteration" is. **A Grover iteration is not a cheap trial**: it runs the entire AES circuit as a reversible quantum circuit, under error correction. Estimates put a single iteration at thousands of logical qubits and circuits tens of thousands of gates deep; $2^{64}$ such iterations in sequence run to timescales of years and far beyond. NIST's PQC process therefore evaluates attacks under MAXDEPTH limits (plausible maximum circuit depths of $2^{40}$–$2^{96}$), and parallelizing Grover under a depth cap yields rapidly diminishing returns.

That is exactly how NIST's security categories are defined: category 1 equals the cost of breaking AES-128, category 3 AES-192, category 5 AES-256 — a yardstick built on realistic costs including Grover and depth constraints, not on the bare square root.

## Hash functions

- **Preimage** (invert a given hash): Grover halves the exponent — SHA-256 goes from $2^{256}$ to $2^{128}$, still ample;
- **Collisions** (find any two inputs with the same hash): classically $2^{128}$ by the birthday bound; the quantum BHT algorithm nominally reaches about $2^{85}$ but demands enormous quantum memory, and once memory is priced in the advantage largely evaporates — SHA-256 collision resistance is generally considered to survive;
- What actually must go are the already-dead short-output algorithms: SHA-1 and MD5 died in the classical era, unrelated to quantum.

## Engineering conclusions

1. **Default to AES-256 in new systems** — four extra rounds buy complete Grover headroom at negligible cost;
2. **Long-term secrets and root keys** — SHA-384/512, generous KDF output lengths;
3. **Existing AES-128 needs no panic migration** — prioritize by data shelf life; it sits far behind public-key migration in the queue;
4. **Symmetric ciphertext has no harvest-now-decrypt-later problem** — stored AES ciphertext stays expensive to attack even for a mature quantum computer, the opposite of stored RSA key exchanges.

In one line: quantum computing is a revolution against public-key cryptography, but only inflation against symmetric cryptography — print the denomination (key length) twice as large, and the books balance.

## Sources and further reading

- Grover, *A fast quantum mechanical algorithm for database search*, STOC 1996. arXiv:quant-ph/9605043
- NIST, *Call for Proposals: PQC Standardization* (security category and MAXDEPTH definitions), 2016. https://csrc.nist.gov/projects/post-quantum-cryptography
- Grassl et al., *Applying Grover's algorithm to AES: quantum resource estimates*, PQCrypto 2016.
