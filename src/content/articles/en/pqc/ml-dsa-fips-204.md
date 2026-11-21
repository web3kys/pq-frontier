---
title: "ML-DSA Explained: NIST's Post-Quantum Digital Signature Standard (FIPS 204)"
description: "From Dilithium to FIPS 204: how ML-DSA's lattice signatures work, the three parameter sets, why the signatures are large, and where the scheme fits in certificates and code signing."
pubDate: 2026-11-21
lang: en
section: pqc
tags: ["ML-DSA", "FIPS 204", "digital signatures", "lattice cryptography"]
draft: false
featured: true
heroImage: "/images/pqc/ml-dsa.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "ml-dsa-fips-204"
keyPoints:
  - "ML-DSA is the lattice-based signature scheme standardized in FIPS 204, derived from CRYSTALS-Dilithium — NIST's primary post-quantum signature."
  - "Three parameter sets (ML-DSA-44/65/87) target roughly security categories 2/3/5; signatures run 2.4–4.6 KB and public keys 1.3–2.6 KB."
  - "Signing uses Fiat–Shamir with aborts and rejection sampling; implementations must defend against timing and fault attacks."
---

If ML-KEM answers "how does a key arrive safely," ML-DSA answers "how do you know this message really came from me" — digital signatures. Signatures are the harder half of the migration: firmware signatures, code signing and issued certificates live for a decade or more, and anything signed today must still be trustworthy after a cryptographically relevant quantum computer exists.

## From Dilithium to ML-DSA

ML-DSA (Module-Lattice Digital Signature Algorithm) derives from CRYSTALS-Dilithium and was published as FIPS 204 on 13 August 2024, alongside FIPS 203 (ML-KEM) and FIPS 205 (SLH-DSA). Its security rests on two lattice problems — Module-LWE and Module-SIS — the same family as ML-KEM, which is deliberate: implementations, analysis and hardware acceleration share much of their groundwork.

The construction follows **Fiat–Shamir with aborts**. The signer builds a commitment from the private key and a random mask, hashes the message to obtain a challenge, and computes a response. If that response's distribution would leak information about the key, the signer simply aborts and retries — this rejection sampling continues until the response is statistically independent of the secret. The verifier only checks that the challenge is self-consistent with the public key, message and signature.

## The three parameter sets

| Set | Public key (bytes) | Private key (bytes) | Signature (bytes) | Target category |
|---|---|---|---|---|
| ML-DSA-44 | 1,312 | 2,560 | 2,420 | ≈ 2 (≈ SHA-256 collision) |
| ML-DSA-65 | 1,952 | 4,032 | 3,309 | ≈ 3 (≈ AES-192) |
| ML-DSA-87 | 2,592 | 4,896 | 4,627 | ≈ 5 (≈ AES-256) |

Against RSA-2048's 256-byte signatures or ECDSA P-256's 64 bytes, ML-DSA signatures are 10–70× larger. That is the most concrete migration cost: certificate chains, TLS handshakes and signed packages all grow measurably (our article on post-quantum PKI does the arithmetic in detail).

## Three implementation pitfalls

**Randomness and determinism.** FIPS 204 allows randomized, deterministic and — recommended — *hedged* signing, where the per-signature randomness is derived from the message and key together with fresh entropy. Do not invent your own nonce scheme.

**Rejection-sampling timing.** The number of retries depends on the key and message; if an implementation lets retry counts leak through timing, it opens a side channel. Serious implementations (liboqs, OpenSSL 3.5, BoringSSL) are written or audited with this in mind — prefer them.

**Fault attacks.** Glitching a signing device can make a single faulty signature leak the key. For offline signers (root CAs, firmware signing machines), verify-after-sign is cheap insurance: verify every signature with the public key before releasing it.

## Where it will be used

- **TLS and certificates** — server certificates and intermediates moving to ML-DSA, often via composite certificates during transition;
- **Code and firmware signing** — CNSA 2.0 makes firmware signing the earliest, hardest deadline in the whole migration;
- **Documents and identity** — contracts, package signing, and identity credentials.

ML-DSA is not the only answer: SLH-DSA (next article) offers hash-only assumptions for conservative use cases, and FN-DSA (Falcon, covered in Research) targets size-sensitive signing. But as the general-purpose default for the next decade of signature migration, ML-DSA is where every migration inventory starts.

## Sources and further reading

- NIST, *FIPS 204: Module-Lattice-Based Digital Signature Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.204
- Ducas et al., *CRYSTALS-Dilithium Algorithm Specifications and Supporting Documentation*, 2021. https://pq-crystals.org/dilithium/
- NIST PQC Standardization Project. https://csrc.nist.gov/projects/post-quantum-cryptography
