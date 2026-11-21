---
title: "Falcon and FN-DSA: The Smallest Post-Quantum Signature Is the Hardest to Build"
description: "How Gaussian sampling over NTRU lattices squeezes a signature into about 666 bytes — Falcon's design, its floating-point trap, and the road to FIPS 206."
pubDate: 2026-11-21
lang: en
section: research
tags: ["Falcon", "FN-DSA", "FIPS 206", "NTRU"]
draft: false
featured: false
heroImage: "/images/research/falcon.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "falcon-fndsa"
keyPoints:
  - "Falcon is NIST's fourth selected signature scheme (to be standardized as FN-DSA, FIPS 206); at ~666 bytes for Falcon-512 it has the smallest signatures in post-quantum cryptography."
  - "The compactness comes from Gaussian sampling over NTRU lattices — which forces double-precision floating point in signing, making implementation and side-channel resistance much harder than ML-DSA."
  - "Its role is complementary, not a replacement: bandwidth- and storage-starved, verify-heavy settings such as DNSSEC, certificate chains and embedded systems."
---

Falcon is the outlier among post-quantum signatures: where ML-DSA counts signatures in kilobytes and SLH-DSA in tens of kilobytes, Falcon-512 signs in about 666 bytes with an 897-byte public key — the same size class as the RSA era. NIST announced in 2022 that Falcon will be standardized as FN-DSA (FIPS 206, still in drafting). This article explains where the compactness comes from, and what it costs.

## Where the small size comes from

Falcon is built on **NTRU lattices**. Signing works like this: hash the message to a target point, then use the private key — a "good basis" of the lattice — to sample a short lattice vector close to that target. The sampling must follow a **discrete Gaussian distribution** precisely; any statistical skew in the samples leaks information about the secret basis.

Gaussian sampling is Falcon's soul and its entire difficulty. Variance and centre must be controlled exactly, and the sampler is a recursive algorithm working in the FFT domain — the signature "Falcon tree" that samples top-down in Fourier space. Get it right and signatures are short and safe; get it slightly wrong and you are publishing your key.

## The floating-point trap

Falcon signing **requires double-precision floating point** (IEEE 754 binary64). Routine on a server; a minefield elsewhere:

- **Microcontrollers without FPUs** — emulated floating point is slow and not constant-time;
- **Constant-time behaviour** — floating-point timing is operand-dependent on some platforms, and the sampler's rejection counts can leak; constant-time implementations are genuinely hard, and auditing them is harder than for the integer-only ML-DSA;
- **Rounding and faults** — the sampler is sensitive to numerical error, so behaviour must be validated per platform.

Falcon was therefore never positioned as the general-purpose signature. NIST's framing is complementary: ML-DSA is the default; Falcon serves the places where **size is the whole game**.

## Whose gaps it fills

- **DNSSEC** — response sizes are traditionally tight; kilobyte signatures invite fragmentation and amplification concerns, and Falcon stays closest to today's sizes;
- **Certificate chains** — our PKI article does the size arithmetic; Falcon at every layer slims the handshake back down;
- **Verify-heavy distribution** — Falcon verification is very fast (integer-only), ideal for sign-once-verify-a-million-times flows like software updates and broadcast authentication.

FIPS 206 timing: NIST is expected to complete the draft-and-comment process around 2026 by most public estimates. Until then, pilot Falcon where size demands it, but do not rest a production compliance story on an unfinished standard — which is why this site files it under Research rather than Standards.

## Sources and further reading

- Fouque et al., *Falcon: Fast-Fourier Lattice-based Compact Signatures over NTRU* (NIST PQC submission). https://falcon-sign.info/
- NIST, *Status Report on the Third Round of the NIST PQC Standardization Process* (NISTIR 8413) — announcing Falcon's selection for standardization as FN-DSA.
- Prest, *High-Precision Arithmetic in Falcon* (implementation challenges), 2021.
