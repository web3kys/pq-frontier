---
title: "Hands-On: Your First ML-KEM Key Encapsulation with liboqs"
description: "Use the Open Quantum Safe Python bindings locally to run ML-KEM-768 key generation, encapsulation and decapsulation — and verify that both sides arrive at exactly the same shared secret."
pubDate: 2026-11-20
lang: en
section: tutorials
tags: ["liboqs", "ML-KEM", "Python", "Lab"]
heroImage: "/images/tutorials/liboqs.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
draft: false
translationKey: "liboqs-ml-kem-lab"
keyPoints:
  - "liboqs' oqs.KEM interface runs a full ML-KEM exchange in a few lines of code."
  - "Lab essentials: check the key and ciphertext sizes of all three parameter sets, and confirm a tampered ciphertext decapsulates to a different secret (implicit rejection)."
  - "liboqs is a research and prototyping library; use a maintained implementation in production."
---

## What we are doing

After reading about KeyGen, Encaps and Decaps in [*ML-KEM Explained*](../pqc/ml-kem-fips-203/), the fastest way to really understand them is to run them. This tutorial uses the Open Quantum Safe (OQS) Python bindings, `liboqs-python`, to perform a complete ML-KEM-768 encapsulation locally, and to verify that the two parties' shared secrets match byte for byte.

> Note: OQS is an experimental project aimed at research and prototyping, and its documentation explicitly warns against production use. This tutorial has the same purpose: learning and verifying concepts.

## Setup

You need Python 3.10 or newer. `liboqs-python` depends on the underlying liboqs C library, whose installation differs by operating system (source build, package manager, or the official Docker image) — follow the current instructions in the liboqs-python repository README. The Python package itself installs with:

```bash
pip install liboqs-python
```

Then confirm ML-KEM is available:

```python
import oqs

print("ML-KEM-768 enabled:", "ML-KEM-768" in oqs.get_enabled_kem_mechanisms())
```

## The full experiment

```python
import oqs

ALG = "ML-KEM-768"

# 1) Receiver: generate a key pair (KeyGen)
with oqs.KeyEncapsulation(ALG) as decapsulator:
    public_key = decapsulator.generate_keypair()
    print("Encapsulation key length:", len(public_key), "bytes")   # expect 1184

    # 2) Sender: encapsulate against the public key (Encaps)
    with oqs.KeyEncapsulation(ALG) as encapsulator:
        ciphertext, shared_secret_enc = encapsulator.encap_secret(public_key)
    print("Ciphertext length:", len(ciphertext), "bytes")          # expect 1088

    # 3) Receiver: decapsulate with the private key (Decaps)
    shared_secret_dec = decapsulator.decap_secret(ciphertext)

# 4) Verify: both shared secrets must be identical
assert shared_secret_enc == shared_secret_dec, "Shared secrets differ!"
print("Verified: shared secrets match, length", len(shared_secret_enc), "bytes")
```

You should see a 1184-byte public key, a 1088-byte ciphertext and a 32-byte shared secret — exactly the ML-KEM-768 row of the FIPS 203 parameter table. Try re-running with `ALG` set to `ML-KEM-512` and `ML-KEM-1024` to compare the three parameter sets.

## Three pitfalls worth knowing

1. **The public key must come from the same KeyGen run.** Encapsulate against a stale public key and decapsulate with a newer private key, and the secrets will differ — silently. Decapsulation does not raise an error; it quietly returns a wrong result (that is exactly what implicit rejection is designed to do). Real systems must catch this with a key-confirmation step.
2. **The shared secret is not itself a session key.** In engineering practice it goes into a KDF (such as HKDF) to derive session keys; do not use it directly as an AES key.
3. **Randomness quality is everything.** It does not matter in a lab, but in any serious setting the randomness for KeyGen and Encaps must come from the operating system's cryptographic random source.

## Next steps

- Turn the experiment into hybrid mode: run an X25519 exchange alongside the ML-KEM encapsulation and feed both secrets into the KDF — which is precisely what TLS 1.3 does today.
- Read Chapter 7 of FIPS 203 and map each algorithm's inputs and outputs to this experiment.

## References

1. Open Quantum Safe project. https://openquantumsafe.org
2. liboqs-python repository (installation and API). https://github.com/open-quantum-safe/liboqs-python
3. NIST, *FIPS 203*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
