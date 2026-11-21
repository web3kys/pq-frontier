---
title: "ML-KEM Explained: Reading NIST's Post-Quantum Key-Encapsulation Standard (FIPS 203)"
description: "Starting from why we need key encapsulation at all, a systematic reading of FIPS 203: the Module-LWE foundation, the three parameter sets, the three core algorithms, and how ML-KEM relates to CRYSTALS-Kyber."
pubDate: 2026-11-20
lang: en
section: pqc
tags: ["ML-KEM", "FIPS 203", "NIST", "Key Encapsulation"]
heroImage: "/images/pqc/ml-kem.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
draft: false
featured: true
translationKey: "ml-kem-fips-203"
keyPoints:
  - "ML-KEM is the lattice-based key-encapsulation mechanism of FIPS 203, derived from CRYSTALS-Kyber — the default choice for post-quantum key exchange."
  - "The three parameter sets (512/768/1024) target roughly categories 1/3/5; public keys run 800–1568 bytes, ciphertexts 768–1568 bytes."
  - "Decapsulation uses implicit rejection against chosen-ciphertext attacks; in practice it is deployed first as hybrid key exchange with X25519."
---

## Why key encapsulation comes first

Almost every secure connection on today's internet begins by agreeing on a shared session key. RSA key transport is long gone; the mainstream mechanism is elliptic-curve Diffie–Hellman (ECDH) — and like RSA, it falls to Shor's algorithm on a sufficiently large quantum computer.

The first building block of the post-quantum migration is therefore a primitive called a **Key Encapsulation Mechanism** (KEM): one party uses the other's public key to "encapsulate" a random shared secret, and the other party "decapsulates" it with the private key. On 13 August 2024, NIST published FIPS 203, making ML-KEM the first standardized post-quantum KEM and the default choice for migration work today.

## The foundation: Module-LWE

ML-KEM's security rests on the **Module Learning With Errors** problem (Module-LWE). Intuitively: given a matrix $\mathbf{A}$ and a product perturbed by small noise, $\mathbf{b} = \mathbf{A}\mathbf{s} + \mathbf{e}$, recovering the secret vector $\mathbf{s}$ is believed to be hard — for classical and quantum computers alike.

It works in the polynomial ring $R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$ with modulus $q = 3329$. All operations can be carried out efficiently with the Number Theoretic Transform (NTT), a major reason ML-KEM is fast and implementation-friendly.

## Three parameter sets

FIPS 203 defines three parameter sets, aligned with three NIST security categories. The shared secret is always 32 bytes:

| Parameter set | Category | Encapsulation key (bytes) | Decapsulation key (bytes) | Ciphertext (bytes) |
| --- | --- | --- | --- | --- |
| ML-KEM-512 | 1 (≈ AES-128) | 800 | 1632 | 768 |
| ML-KEM-768 | 3 (≈ AES-192) | 1184 | 2400 | 1088 |
| ML-KEM-1024 | 5 (≈ AES-256) | 1568 | 3168 | 1568 |

ML-KEM-768 is the deployment default today: a comfortable security margin, with a public key and ciphertext of about 1.1 KB each — acceptable inside a TLS handshake. For contrast, an X25519 public key is 32 bytes. A real cost of post-quantum migration is larger handshakes, and any serious assessment has to budget for it.

## The three core algorithms

- **KeyGen**: expands a random seed into the matrix $\mathbf{A}$, samples secret and noise, and produces the encapsulation and decapsulation keys.
- **Encaps**: encrypts a random message under the public key and hashes it, producing a ciphertext and the 32-byte shared secret.
- **Decaps**: recovers the message with the private key, re-encrypts and compares the ciphertext (the Fujisaki–Okamoto transform); the shared secret is accepted only on a match, and on mismatch a pseudorandom "implicit rejection" value derived from the private key is returned instead — failure leaks nothing.

This construction gives ML-KEM IND-CCA2 security: even an attacker who can ask the system to decapsulate chosen ciphertexts gains no advantage.

## Relation to CRYSTALS-Kyber

ML-KEM descends from the academic scheme CRYSTALS-Kyber, one of the first algorithms NIST selected in July 2022. During standardization NIST made a handful of changes — for instance in how key generation consumes randomness, and in encoding and hashing details — so **a FIPS 203 implementation is not byte-for-byte compatible with the final-round Kyber specification**. When testing interoperability, look for "ML-KEM / FIPS 203" explicitly; do not assume a "Kyber" implementation can be mixed in.

## Deployment status (as of November 2026)

Mainstream browsers and large CDNs have enabled **hybrid key exchange** — X25519 together with ML-KEM-768 — in TLS 1.3: both algorithms run at once, and the connection stays secure as long as either one holds. This is the most prudent migration posture available today: post-quantum protection now, classical assurance retained, with a switch to pure post-quantum once the ecosystem matures.

## Summary

ML-KEM answers the question "how do we agree on keys in the quantum era": based on Module-LWE, three parameter sets spanning AES-128 to AES-256 security levels, with 768 as the current deployment sweet spot. Next, we get hands-on: the [tutorials](../tutorials/) run a real ML-KEM key generation, encapsulation and decapsulation with liboqs.

## References

1. NIST, *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
2. NIST, Post-Quantum Cryptography Standardization (project page). https://csrc.nist.gov/projects/post-quantum-cryptography
3. Bos, J. et al., *CRYSTALS – Kyber: a CCA-secure module-lattice-based KEM*, IEEE EuroS&P 2018. https://eprint.iacr.org/2017/634
