---
title: "SLH-DSA: The Conservative, Hash-Only Signature (FIPS 205)"
description: "How SPHINCS+ turns hash trees into a stateless signature scheme: twelve parameter sets, signatures of tens of kilobytes, and the use cases it is built for — offline roots and firmware."
pubDate: 2026-11-21
lang: en
section: pqc
tags: ["SLH-DSA", "FIPS 205", "hash-based signatures", "SPHINCS+"]
draft: false
featured: false
heroImage: "/images/pqc/ml-kem.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "slh-dsa-fips-205"
keyPoints:
  - "SLH-DSA (FIPS 205) relies only on the security of hash functions — the most conservative assumption among NIST's three signature standards."
  - "The price is size and speed: signatures of 7.8–49.9 KB and slower signing than ML-DSA, but public keys of just 32–64 bytes."
  - "It is stateless — no one-time-key counters to protect, unlike XMSS/LMS — making it ideal for offline root CAs and firmware signing."
---

Among NIST's three post-quantum signature standards, SLH-DSA is the insurance policy: if the mathematical assumptions behind lattice cryptography are ever weakened, a scheme that trusts only hash functions still stands. That conservatism is not free — it trades signature size and speed for purity of assumptions.

## From hash trees to stateless signatures

Hash-based signatures have an old problem: the original Lamport one-time signature can sign exactly once per key. XMSS and LMS organize many one-time keys into a Merkle tree, but demand that the signer **maintain state rigorously** — roll back a counter, reuse one one-time key, and security collapses. Backups, VM snapshots and hot standbys all threaten state, which makes stateful schemes an operational minefield.

SLH-DSA, derived from SPHINCS+, removes the counter: a deep, wide hypertree plus a few-time signature scheme (FORS) at the leaves makes the key space so large that picking a fresh leaf at random is safe. The result is **stateless** — back it up, clone it, restore it; nothing breaks. FIPS 205 was published on 13 August 2024 together with FIPS 203 and 204.

## Choosing among twelve parameter sets

Parameters combine three axes: the hash function (SHA2 or SHAKE), the security level (128/192/256 bits), and the size/speed trade-off (s = small signatures, slower; f = fast, larger signatures).

| Representative set | Public key | Signature | Character |
|---|---|---|---|
| SLH-DSA-SHA2-128s | 32 B | 7,856 B | Smallest signatures, slowest signing |
| SLH-DSA-SHA2-128f | 32 B | 17,088 B | Speed-first at 128 bits |
| SLH-DSA-SHA2-256s | 64 B | 29,792 B | High security, compact |
| SLH-DSA-SHA2-256f | 64 B | 49,856 B | Signatures near 50 KB |

The tiny public key is an underrated virtue: keys burned into ROM, printed on paper, or embedded in minimal boot code have exactly one realistic post-quantum option. Verification is acceptably fast (milliseconds); it is signing that is slow — and in SLH-DSA's home territory, signing is rare by design.

## Where it fits

- **Offline root CAs and code-signing roots** — sign a handful of times a year; statelessness makes cold backups and disaster recovery safe instead of dangerous;
- **Firmware and boot chains** — minimal public keys, verification needs only a hash function, the smallest possible attack surface;
- **Long-lived archival signatures** — legal records and evidence that must verify in thirty years without betting on lattice assumptions.

Where it does not fit: high-frequency online signing (TLS handshakes, per-request signatures), where size and latency rule it out — that is ML-DSA's ground. The working rule: **ML-DSA for online signing, SLH-DSA as the hedge for offline roots and long-lived signatures** — exactly why CNSA 2.0 names both for firmware.

## Sources and further reading

- NIST, *FIPS 205: Stateless Hash-Based Digital Signature Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.205
- Bernstein et al., *SPHINCS+ Specification* (submission to NIST PQC). https://sphincs.org/
- On this site: "ML-DSA Explained: NIST's Post-Quantum Digital Signature Standard (FIPS 204)"
