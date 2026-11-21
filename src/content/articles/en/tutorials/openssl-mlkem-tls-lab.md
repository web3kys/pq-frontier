---
title: "Hands-On: Local TLS with ML-KEM + ML-DSA Using OpenSSL 3.5"
description: "No research libraries needed: use the OpenSSL 3.5 shipped by mainstream distributions to issue an ML-DSA certificate, serve local TLS, and verify hybrid key exchange negotiation yourself."
pubDate: 2026-11-21
lang: en
section: tutorials
tags: ["OpenSSL", "TLS", "ML-KEM", "ML-DSA", "lab"]
draft: false
featured: false
heroImage: "/images/tutorials/tls-lab.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "openssl-mlkem-tls-lab"
keyPoints:
  - "OpenSSL 3.5 (April 2025) natively supports ML-KEM, ML-DSA and SLH-DSA, and enables the X25519MLKEM768 hybrid group by default in TLS 1.3 — upgrade your distribution and you can experiment today."
  - "Three steps: generate a self-signed ML-DSA-65 certificate, serve it with s_server, connect with s_client and check the negotiated group and certificate algorithm."
  - "Checklist: the client output should show Negotiated TLS1.3 group: X25519MLKEM768, and the certificate's Signature Algorithm should read ML-DSA-65."
---

The previous two labs used liboqs to learn the algorithms themselves. This one switches to the production tool: **OpenSSL 3.5**. Released in April 2025, 3.5 is OpenSSL's turning point — ML-KEM, ML-DSA and SLH-DSA are built in natively, and the default TLS 1.3 group list carries the hybrid `X25519MLKEM768`. The same post-quantum TLS that browsers and CDNs are deploying, reproducible on your own machine.

## Step 0: Check the version

```bash
openssl version
openssl list -kem-algorithms | grep -i ml-kem
openssl list -signature-algorithms | grep -i ml-dsa
```

You need ≥ 3.5. If your distribution ships 3.0–3.4, upgrade the distribution or install a newer package (don't hand-build for production machines; lab machines are fair game).

## Step 1: Generate an ML-DSA certificate

```bash
openssl genpkey -algorithm ML-DSA-65 -out mldsa-key.pem
openssl req -new -x509 -key mldsa-key.pem -out mldsa-cert.pem -days 30 \
  -subj "/CN=localhost"
openssl x509 -in mldsa-cert.pem -noout -text | grep "Signature Algorithm"
```

The last line should read `Signature Algorithm: ML-DSA-65`. While you are here, `ls -l mldsa-cert.pem` — roughly 4–5 KB; set that against the size arithmetic in our PKI migration article and the numbers become tangible.

## Step 2: Serve and connect

Terminal A (keep it running):

```bash
openssl s_server -accept 4433 -key mldsa-key.pem -cert mldsa-cert.pem \
  -tls1_3 -www
```

Terminal B:

```bash
openssl s_client -connect localhost:4433 -groups X25519MLKEM768
```

## Step 3: Verify the negotiation

Check the `s_client` output line by line:

- `Negotiated TLS1.3 group: X25519MLKEM768` — hybrid key exchange succeeded; half of the KEM is ML-KEM-768;
- In the certificate block, `Signature Algorithm: ML-DSA-65` and `Public Key Algorithm: ML-DSA-65` — the server presented a post-quantum certificate;
- Protocol is `TLSv1.3`.

Run the control experiment: change `-groups` to `X25519` and reconnect — the negotiated group falls back to purely classical. Same server, same client, one flag: that is crypto-agility at the command line.

## Troubleshooting

- **`s_client` fails with "no suitable signature algorithm"** — usually OpenSSL older than 3.5, or a system policy (some distributions' crypto-policies) disabling new algorithms; check `openssl version` first, then the policy;
- **Pure ML-KEM group** — use `-groups MLKEM768` (both ends on 3.5); browser interop requires the hybrid group;
- **Chain size** — issue an intermediate and stack it, repeat step 2, and watch the handshake bytes (the `-msg` flag) — measure the PKI size bill yourself.

## What separates this lab from production

A local self-signed setup proves **algorithm and protocol viability**, not a deployment: production additionally needs publicly issued ML-DSA certificates (the ecosystem is early — see our PKI article), a client compatibility matrix, and performance testing. But keep the order right: run this handshake at home and learn the checklist now, and when the ecosystem arrives you will be missing only a certificate, not the understanding.

## Sources and further reading

- OpenSSL, *3.5 Release Notes* (ML-KEM/ML-DSA/SLH-DSA support and default group changes), 2025-04. https://openssl-library.org/news/openssl-3.5-notes/
- OpenSSL man pages: `s_server`, `s_client`, `genpkey` (3.5).
- On this site: "Hybrid Key Exchange: How TLS Moves First" and "Migrating PKI and Certificates to Post-Quantum"
