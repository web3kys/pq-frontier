---
title: "Hybrid Key Exchange: Why Post-Quantum Migration Starts with TLS"
description: "Run classic X25519 and ML-KEM-768 side by side and combine the secrets — hybrid key exchange is deployable today, and it is step one of the whole migration."
pubDate: 2026-11-21
lang: en
section: security
tags: ["Hybrid Encryption", "TLS", "ML-KEM", "Harvest Now Decrypt Later"]
heroImage: "/images/security/security.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
draft: false
featured: false
translationKey: "hybrid-key-exchange"
---

## Harvest now, decrypt later: where the urgency comes from

Post-quantum migration has an asymmetric timing problem: an attacker can record encrypted traffic today and decrypt it once a capable quantum computer exists — harvest now, decrypt later. If your data must stay secret longer than the time until such a machine arrives, your migration is already late.

That asymmetry fixes the order of operations: **key exchange first, signatures later**. A signature protects the authenticity of a connection *now*; forging it retroactively gains nothing. Key exchange protects the *content* of the connection — and recorded content is future plaintext. It is no accident that the first shot of the global migration was fired at TLS key exchange.

## What hybrid key exchange is

The hybrid construction is disarmingly direct: run two key exchanges in a single handshake — classic X25519 and post-quantum ML-KEM-768 — and feed both shared secrets into the key derivation function:

$$
ss = \mathrm{KDF}(ss_{\text{classic}} \,\|\, ss_{\text{pq}})
$$

With a sound combiner, the guarantee is an **OR**, not an AND: if either algorithm remains secure, the session keys are secure. Two consequences follow:

- If ML-KEM were ever broken, X25519 still stands — security is no worse than today;
- If a quantum computer arrives early, ML-KEM is already in place — recorded traffic stays sealed.

The cost is a larger handshake: ML-KEM-768's key share is about 1,184 bytes, which inflates the ClientHello, and a small population of legacy middleboxes chokes on that. It is a real deployment pitfall, and the reason every large rollout went gradual before going default.

## Who is already running it

This is not a lab proposal; it is the production default in the Internet's core plumbing:

- **Chrome**: since version 131 (November 2024), desktop Chrome enables the X25519MLKEM768 hybrid by default;
- **OpenSSH**: since 10.0 (April 2025), the default key exchange is mlkem768x25519-sha256; version 9.0 had already introduced an NTRU Prime hybrid;
- **Signal**: PQXDH, deployed in 2023, layers Kyber — ML-KEM's predecessor — over X25519 for initial key agreement;
- **IETF**: the TLS working group is progressing a draft to standardise ML-KEM key agreement, with the hybrid construction as the baseline under discussion.

Browsers, SSH, messaging — the three most critical connection types on the Internet have all crossed this line.

## What it means for your own systems

For your own infrastructure, hybrid key exchange is the cheapest lesson in the whole migration:

1. **Inventory the TLS termination points first** — load balancers, reverse proxies, API gateways; key exchange happens there, so the upgrade happens there;
2. **Upgrade the crypto stack before anything else** — OpenSSL, Go and Rustls all support hybrid groups; in most cases it is configuration, not re-engineering;
3. **Verify the negotiated group** — packet captures or logs should prove new connections actually land on the hybrid group rather than silently falling back to classic-only;
4. **Queue the signatures** — certificate chains and code signing are more complex and less urgent; plan them separately, after key exchange.

## Takeaway

The elegance of the hybrid construction is that it asks you to trust neither side: the classic algorithm guards today, the post-quantum algorithm guards tomorrow, and the KDF merges both guarantees into one. It is the lowest-risk, highest-immediacy step in the entire migration — and the first signal of whether a system is taking migration seriously.

## Sources

- IETF Datatracker: draft-ietf-tls-mlkem (ML-KEM key agreement in TLS) — https://datatracker.ietf.org/doc/draft-ietf-tls-mlkem/
- OpenSSH 10.0 release notes (April 2025): default key exchange changed to mlkem768x25519-sha256 — https://www.openssh.com/releasenotes.html
- Google Chrome release blog: ML-KEM hybrid key agreement enabled by default in Chrome 131 (November 2024)
- Signal official blog: the PQXDH protocol upgrade (2023)
