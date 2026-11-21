---
title: "Migrating PKI and Certificates to Post-Quantum: Size, Chains and Automation"
description: "Certificates are among the first systems to hit the post-quantum wall: the size arithmetic of ML-DSA chains, composite versus dual-certificate transition paths, and the CA ecosystem's timeline."
pubDate: 2026-11-21
lang: en
section: security
tags: ["PKI", "X.509", "certificates", "ML-DSA"]
draft: false
featured: false
heroImage: "/images/security/security.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "pki-certificates-pqc"
keyPoints:
  - "With ML-DSA, a leaf certificate grows from ~1 KB to 4–8 KB and full chains exceed 10 KB — TLS handshakes, CT logs and OCSP all feel the size bill."
  - "Two transition paths exist: composite certificates (two algorithms in one X.509, being standardized in IETF LAMPS) and dual-certificate deployment; they solve different problems."
  - "No CA/B Forum mandate exists yet, but automated issuance (ACME) and short-lived certificates make PKI the most phase-friendly part of the migration."
---

Public key infrastructure is the trust substrate of the internet and the structurally hardest part of post-quantum migration: not a single algorithm swap but a system spanning CAs, browser root programs, CT logs, HSMs and certificate lifecycle tooling. The good news is that it also phases better than almost anything else.

## Do the size arithmetic first

A typical ECDSA P-256 leaf certificate is about 1 KB. Switch to ML-DSA-65 — a 1,952-byte public key and a 3,309-byte signature — and one certificate is roughly 6 KB; add an intermediate (its own key plus the root's signature over it) and the chain passes 12 KB. The effects cascade:

- **TLS handshakes** — the chain travels in the first flight; exceeding the congestion window costs an extra round trip, felt on poor networks;
- **CT logs** — every certificate on the internet gets logged; entries multiply in size, and log operators' storage and mirroring costs follow;
- **OCSP and CRLs** — responses and revocation entries carry signatures too; the size problem is everywhere;
- **Constrained carriers** — smartcards, embedded devices and QR-borne certificates may simply not fit — the cases where FN-DSA (~0.7 KB signatures) or hash-based schemes earn their place.

The conclusion is not "cannot migrate" but **migrate with a size budget**: ML-DSA-44 instead of 87, certificate compression, shallower chains — each choice is real latency and bandwidth.

## Two transition paths

**Composite certificates** put classical and PQC keys and signatures inside one X.509 certificate, with verifier policy deciding whether both signatures are required. IETF LAMPS is standardizing composite ML-DSA and composite ML-KEM drafts. Pros: one certificate everywhere, clean rollback. Cons: drafts not final, implementation support early.

**Dual certificates** issue two certificates per name (one classical, one PQC) and negotiate at serving time. Pros: deployable today with existing standards. Cons: double the operations and more negotiation complexity.

In practice a third path is already live at the TLS layer: **key exchange first**. Hybrid key exchange in TLS 1.3 (X25519+ML-KEM) needs no certificate changes and already blocks harvest-now-decrypt-later; Chrome and major CDNs enable it by default (see our hybrid key exchange article). Certificate *signatures* are less urgent — a handshake recorded today cannot be re-forged tomorrow. The right order: hybridize key exchange first, migrate certificate signatures second.

## The ecosystem timeline

- **Root programs** — Mozilla, Chrome and Apple are evaluating PQC roots; experimental PQC certificates already appear in public logs;
- **CAs** — major public CAs have begun experimental ML-DSA issuance; enterprise PKI waits on HSM support, which mainstream vendors are adding in current firmware;
- **Automation** — ACME is algorithm-agnostic, and Let's-Encrypt-style short-lived automation turns "change the algorithm" from an annual project into a configuration change — PKI migration's most underrated tailwind.

A starter checklist for PKI owners: inventory every certificate and issuance path (merge this with your CBOM, see the Migration section); confirm your HSM and CA software PQC roadmaps; pilot ML-DSA-44 on an internal PKI; put certificate size into the performance budget. None of this waits for every standard to finalize — inventory and pilots can start today.

## Sources and further reading

- IETF LAMPS, *Composite ML-DSA for use in X.509 Public Key Infrastructure* (and related drafts), 2024–2025. https://datatracker.ietf.org/wg/lamps/
- NIST, *FIPS 204* (ML-DSA parameters and sizes), 2024.
- Google Chrome, *Post-quantum cryptography in Chrome* (hybrid key exchange deployment), 2024. https://security.googleblog.com/
