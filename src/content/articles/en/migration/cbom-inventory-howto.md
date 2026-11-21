---
title: "Cryptographic Inventory in Practice: Building a CBOM from Zero"
description: "Migration starts with knowing what you have, not swapping algorithms: CBOM field design, the five-channel discovery method, tooling choices and a prioritization workflow you can execute."
pubDate: 2026-11-21
lang: en
section: migration
tags: ["CBOM", "inventory", "crypto-agility", "CycloneDX"]
draft: false
featured: false
heroImage: "/images/migration/cbom.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "cbom-inventory-howto"
keyPoints:
  - "A CBOM (Cryptography Bill of Materials) is the SBOM's sibling format, built on CycloneDX, recording algorithms, key sizes, protocols and certificates — and where each one lives."
  - "Discovery needs five channels in parallel: code scanning, certificate/key stores, network observation, runtime dependencies and vendor inquiries. Any single channel misses a whole class of assets."
  - "Rank results by data shelf life and exposure: long-lived plus internet-facing systems migrate first; do not spread effort evenly."
---

Migration projects fail in a predictable way: not by choosing the wrong algorithm, but by discovering — halfway through — thirty unknown systems still using RSA. The inventory is migration's first mile and the one step that cannot be skipped. Its deliverable is the **CBOM**: a Cryptography Bill of Materials.

## What a CBOM records

The CBOM reuses the SBOM ecosystem, standardized in CycloneDX (whose cryptography extension defines `cryptoProperties`). Each asset entry should carry at least:

| Field | Example |
|---|---|
| Asset type | algorithm / protocol / certificate / key / library |
| Algorithm and parameters | RSA-2048, ECDH P-256, TLS 1.2 |
| Location | system, service, repository, file path |
| Purpose | key exchange / signature / encryption at rest / in transit |
| Data shelf life | how many years this data must stay confidential |
| Certificate expiry | mandatory for certificate assets |
| Owner | the team empowered to change it |

An inventory without the *data shelf life* column is incomplete — it directly drives prioritization (see the Mosca inequality in our migration roadmap article).

## The five discovery channels

1. **Code and dependency scanning** — search repositories for crypto API calls (`Cipher.getInstance`, `crypto.createSign`, OpenSSL invocations) and walk dependency trees for crypto libraries (Bouncy Castle, OpenSSL, libsodium versions). Tools like CBOMkit and scanner plugins can draft CycloneDX output automatically;
2. **Certificates and key stores** — export CA issuance records, TLS endpoint certificates, code-signing certificates, SSH host keys and HSM key listings. Certificates are the easiest assets to inventory because they are structured by design;
3. **Network observation** — measure the actually-negotiated TLS versions and cipher suites at gateways and load balancers. What configuration *supports* differs from what traffic *uses*; observation corrects the record;
4. **Configuration and infrastructure** — VPNs, database and backup encryption, disk encryption, message-queue TLS. This "invisible cryptography" is the class most often missed;
5. **Vendors and SaaS** — send key suppliers two questions: what is your PQC roadmap, and how is our data encrypted with you? File the answers; they are compliance evidence in themselves.

## From inventory to priorities

Do not work the list top to bottom — score it. Three dimensions suffice: **data shelf life** (≥10 years moves first), **exposure** (internet-reachable moves first), **change cost** (a library upgrade moves before a protocol redesign). The first quadrant is always the same: external TLS (hybrid key exchange first — see our Tutorials) and long-lived signatures (firmware, root certificates).

One final discipline: **a CBOM is a living document.** Wire it into CI and certificate automation — new certificates register themselves, new dependencies get scanned on arrival. A one-off spreadsheet inventory is a historical artifact within a quarter. The endpoint is not a table; it is the first durable, trustworthy answer your organization has to "where does our cryptography live" — and migration, audit and compliance all draw from that answer.

## Sources and further reading

- OWASP CycloneDX, *Cryptography Bill of Materials (CBOM)* specification and capability model. https://cyclonedx.org/capabilities/cbom/
- IBM, *cbomkit* (open-source CBOM generation tooling). https://github.com/IBM/cbomkit
- On this site: "Post-Quantum Migration Roadmap: Inventory, Pilot, Switch"
