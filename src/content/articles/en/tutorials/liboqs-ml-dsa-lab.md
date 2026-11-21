---
title: "Hands-On: Your First ML-DSA Signature with liboqs"
description: "In the liboqs environment from the previous lab, run the full ML-DSA flow: key generation, signing, verification, a tamper test that must fail, and a size comparison across all three parameter sets."
pubDate: 2026-11-21
lang: en
section: tutorials
tags: ["liboqs", "ML-DSA", "Python", "lab"]
draft: false
featured: false
heroImage: "/images/tutorials/liboqs.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "liboqs-ml-dsa-lab"
keyPoints:
  - "liboqs' oqs.Signature interface completes ML-DSA key generation, signing and verification in a few lines; the algorithm names are ML-DSA-44/65/87."
  - "Lab essentials: verify by hand that a tampered message fails verification, and print the key/signature sizes of all three parameter sets against the FIPS 204 table."
  - "liboqs is a research and prototyping library — its own documentation warns against unaudited production use; use maintained implementations such as OpenSSL 3.5 in production."
---

The previous lab ("Your First ML-KEM Key Exchange with liboqs") set up the environment; this one runs the full digital-signature flow in the same liboqs-python setup. The goal: generate ML-DSA keys, sign a message, verify it — then change one byte of the message by hand and watch verification fail. That last step is the entire point of a signature scheme.

## Setup

Reuse the previous lab's environment (liboqs and the oqs bindings installed). First confirm ML-DSA is enabled in your build:

```bash
python3 -c "import oqs; print([a for a in oqs.get_enabled_sig_mechanisms() if 'ML-DSA' in a])"
```

Expect `['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87', ...]` (draft variants with IPD suffixes may also appear; this lab uses only the suffix-free FIPS 204 final versions).

## The full script

```python
import oqs

message = b"PQ Frontier lab: my first post-quantum signature"

for alg in ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"]:
    with oqs.Signature(alg) as signer, oqs.Signature(alg) as verifier:
        public_key = signer.generate_keypair()
        secret_key = signer.export_secret_key()
        signature = signer.sign(message)

        ok = verifier.verify(message, signature, public_key)
        tampered = verifier.verify(message + b"!", signature, public_key)

        print(f"{alg}: pk={len(public_key)}B sk={len(secret_key)}B "
              f"sig={len(signature)}B verify={ok} tampered={tampered}")
        assert ok and not tampered

print("ALL OK")
```

Expected output (sizes match the FIPS 204 table line for line):

```text
ML-DSA-44: pk=1312B sk=2560B sig=2420B verify=True tampered=False
ML-DSA-65: pk=1952B sk=4032B sig=3309B verify=True tampered=False
ML-DSA-87: pk=2592B sk=4896B sig=4627B verify=True tampered=False
ALL OK
```

## Reading the code

- `generate_keypair()` creates the key pair inside the object and returns the public key; `export_secret_key()` exports the private key as bytes — in a real system the key stays in an HSM or protected store; exporting belongs to the lab only;
- `sign()` uses FIPS 204's hedged randomized signing by default: sign the same message twice and the signatures differ, yet both verify. Try it;
- `verify()`'s tamper sensitivity comes from hash binding: one changed byte produces a completely different Fiat–Shamir challenge and the signature collapses. The `message + b"!"` check must return False — if it ever returns True, something is deeply wrong with the library or its use; stop and investigate;
- Compare the printed sizes with the parameter table in our ML-DSA explainer — half the lab's value is the flow, the other half is turning "2,420 bytes" from a table entry into output on your own screen.

## Troubleshooting

- **`oqs.Signature` reports the mechanism unavailable** — your liboqs build did not enable it; rebuild with the previous lab's CMake flags or use a newer distribution build;
- **Trying Falcon** — swap the name to `Falcon-512` (some builds enable it separately). Falcon signature lengths are variable; expect roughly 666 bytes, fluctuating — that is normal;
- **Performance feel** — `timeit` 100 sign/verify runs per parameter set; on a desktop CPU both operations sit in the sub-millisecond to millisecond range.

## Next step

Signatures answer "who sent it"; what remains is running them inside a real protocol. The next lab uses system OpenSSL 3.5 to stand up a local TLS handshake with ML-KEM hybrid key exchange and an ML-DSA certificate — KEM and signature meeting in one handshake.

> Security note, repeated on purpose: liboqs positions itself as a research and prototyping library. Never carry this lab's key handling (plaintext byte export) into any real system.

## Sources and further reading

- Open Quantum Safe, *liboqs-python* documentation and examples. https://github.com/open-quantum-safe/liboqs-python
- NIST, *FIPS 204* (parameter and size tables), 2024.
- On this site: "Your First ML-KEM Key Exchange with liboqs" and "ML-DSA Explained"
