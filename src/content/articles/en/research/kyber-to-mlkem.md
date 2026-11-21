---
title: "From Kyber to ML-KEM: What Standardization Actually Changed"
description: "ML-KEM is not Kyber renamed: ciphertext-bound key derivation, domain separation and input validation — a point-by-point account of the FIPS 203 differences, and why the two do not interoperate."
pubDate: 2026-11-21
lang: en
section: research
tags: ["Kyber", "ML-KEM", "FIPS 203", "standardization"]
draft: false
featured: false
heroImage: "/images/research/research.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "kyber-to-mlkem"
keyPoints:
  - "ML-KEM shares Kyber's mathematical core (Module-LWE, CBD noise, NTT), but FIPS 203 changes the KDF inputs, domain separation and validation rules — ciphertexts are not interoperable."
  - "The key change: the shared secret is derived bound to the ciphertext hash, tying each session key to one exact ciphertext and closing re-encapsulation attack surface."
  - "Engineering impact: implementations labelled 'Kyber' cannot be treated as ML-KEM; TLS's X25519MLKEM768 uses the final FIPS 203, while the early Kyber768Draft00 should only appear in historical traffic."
---

"We already run Kyber — isn't ML-KEM just a rename?" It is one of the most common misconceptions in migration consulting, and the answer is no: during standardization, FIPS 203 made several small-looking changes to Kyber that are decisive for compatibility. A system built to the Kyber specification cannot complete a single key exchange with an ML-KEM system.

## What did not change

The mathematical core is untouched: the Module-LWE assumption, the ring $R_q = \mathbb{Z}_q[X]/(X^{256}+1)$ with $q = 3329$, centred binomial noise, NTT acceleration, and the three parameter sets ($k = 2/3/4$ for 512/768/1024) all match Kyber's round-3 specification. Security analysis, performance character and side-channel guidance carry over. Every change lives in the "wrapping layer."

## What did change

**1. Shared-secret derivation.** In Kyber's KEM, the shared secret is derived along the lines of $\bar{K} = \mathrm{KDF}(r, H(pk))$, with implicit rejection falling back to a secret value $z$. FIPS 203 binds the **ciphertext hash** into the derivation: $K = \mathrm{KDF}(K', H(c))$, where $K'$ is the decapsulated candidate. Each shared secret is now tied to one exact ciphertext — tampering with the ciphertext changes the session key, the re-encapsulation attack surface closes, and the security proof gets cleaner.

**2. Domain separation and labelling.** FIPS 203 adds explicit domain separation to hash invocations and restates randomness and key-generation inputs in FIPS style. At the byte level the consequence is immediate: same key, same seed, and the two specifications diverge from the first intermediate value.

**3. Input validation, the FIPS way.** FIPS 203 mandates ciphertext format checks before decapsulation, key-generation consistency self-checks, and approved-DRBG randomness requirements. The mathematics is unchanged, but the boundary of what counts as a conforming implementation moved — deliberately, so that FIPS 140-3 validation has something to hook into.

**4. Names and interfaces.** Kyber512/768/1024 become ML-KEM-512/768/1024, with API semantics aligned to FIPS conventions (key representations, randomness supply).

## Engineering consequences

- **Inventories must record the version** — an asset labelled "Kyber" needs a follow-up question: round-3 spec, FIPS 203 draft, or final? They are mutually incompatible (CBOM algorithm fields should capture this granularity);
- **Historical baggage in TLS** — early deployments used `X25519Kyber768Draft00`, superseded by `X25519MLKEM768` (final FIPS 203); seeing the former in a capture means a very old peer;
- **Library choice** — liboqs, OpenSSL 3.5, BoringSSL and RustCrypto's ml-kem all target final FIPS 203; anything still implementing the Kyber spec is an upgrade item;
- **Interop must be tested, not assumed** — cross-vendor ML-KEM interop is established through NIST ACVP test vectors; "both are lattice KEMs" is not evidence of interoperability.

Standardization is not a rename; it is the forging of an academic scheme into an engineering object that can be validated, procured and interoperated. The Kyber → ML-KEM deltas are the cleanest case study of that forging in the whole PQC programme.

## Sources and further reading

- NIST, *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
- Avanzi et al., *CRYSTALS-Kyber Algorithm Specifications and Supporting Documentation* (v3.02), 2021. https://pq-crystals.org/kyber/
- IETF, *Hybrid key exchange in TLS 1.3* (draft-ietf-tls-ecdhe-mlkem) — the X25519MLKEM768 definition and the Draft00 succession.
