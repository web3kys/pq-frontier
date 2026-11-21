---
title: "A Five-Step Roadmap for Post-Quantum Migration"
description: "Migration is not swapping one algorithm — it is replacing cryptography everywhere an organisation uses it. Inventory, assess, sequence, pilot, switch: each step with a deliverable."
pubDate: 2026-11-21
lang: en
section: migration
tags: ["Migration Roadmap", "Crypto-Agility", "CBOM", "Risk Assessment"]
heroImage: "/images/migration/migration.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
draft: false
featured: false
translationKey: "migration-roadmap"
keyPoints:
  - "Migration runs inventory (CBOM) → pilot → switch, in that order — the sequence is not negotiable."
  - "Mosca's inequality: if data shelf life plus migration time exceeds the time until the threat arrives, you are already late."
  - "Priorities follow data shelf life and exposure: external TLS and long-lived signatures go first."
---

## The hard part is not the algorithm

ML-KEM implementations already ship in every mainstream cryptographic library. The hard part is that in a mid-sized organisation, RSA and elliptic curves hide in hundreds of unexpected places — firmware signatures, database encryption, internal RPC, backup formats, vendor SDKs, a single-sign-on system from a decade ago. The first principle of migration engineering: **you cannot replace what you cannot find.**

The five steps below compress the migration guidance published by NIST, the NSA and others into an executable route. Each step names its deliverable — a step without a deliverable did not happen.

## Step 1 — Inventory: draw the cryptographic map

Deliverable: **a Cryptography Bill of Materials (CBOM)**.

- Scan code, configuration, certificate stores and dependency trees; record every use of public-key cryptography: algorithm, key size, purpose, owning system;
- Do not miss the three blind spots: hardware and firmware (HSMs, TPMs, device signing), third-party components (SDKs, how SaaS products connect), and the data layer (how keys are wrapped for storage and backups);
- The CycloneDX CBOM format and open-source scanners already exist — the inventory does not have to be manual.

## Step 2 — Assess: schedule with the Mosca inequality

Deliverable: **a risk register graded by data secrecy lifetime**.

The Mosca inequality frames the judgement: if the secrecy lifetime your data needs ($X$), plus the time migration will take ($Y$), exceeds the time until the quantum threat arrives ($Z$),

$$
X + Y > Z
$$

then the risk already exists. Ask of every data class: "If this is decrypted in ten years, is that acceptable?" What is acceptable waits; what is not — medical records, state secrets, long-term contracts, identity data — forms the first migration wave.

## Step 3 — Sequence: key exchange before signatures

Deliverable: **a phased priority table of systems**.

The ordering follows from the harvest-now-decrypt-later asymmetry (see this site's article on hybrid key exchange):

1. Key exchange in external TLS and VPNs — the recorded-traffic risk is accumulating today;
2. Key exchange and data encryption between internal services;
3. Signature systems — certificate chains, code signing (less urgent, but slow; start early);
4. The long tail: firmware signing, archived data, offline media.

Anchor to the hard timelines: the NSA's CNSA 2.0 requires US national security systems to complete the transition between 2030 and 2033, and the ecosystem will be pulled along by that schedule.

## Step 4 — Pilot: hybrid deployment, small and measured

Deliverable: **a pilot report — performance baseline, compatibility list, rollback plan**.

- Pick one system with clean boundaries and pilot hybrid key exchange (classic + post-quantum);
- Measure three things: handshake latency and packet-size changes, compatibility with legacy clients and middleboxes, and whether monitoring can actually see the negotiated result;
- The rollback switch must be real: one action returns the system to classic-only mode.

The goal of this phase is not "going live" — it is converting unknown pitfalls into a known list.

## Step 5 — Switch, then normalise: crypto-agility

Deliverable: **a repeatable switching procedure plus continuous inventory**.

The end state is not merely "migrated once" but **crypto-agility**: algorithms exist as configuration, not code, so the next algorithm transition — there will be one — costs an operation, not an engineering programme. After the switch, step 1's inventory becomes a standing scan: new systems enter the register on arrival, and only then is the loop closed.

## Takeaway

The order of the five steps is itself the risk ranking: see first (inventory), judge second (assess), act last (sequence, pilot, switch). Organisations that skip the inventory and start swapping algorithms always repay the time later — usually at a firmware signature or a vendor SDK.

## Sources

- NIST IR 8547 (draft): *Transition to Post-Quantum Cryptography Standards*, initial public draft, November 2024
- NSA: *Commercial National Security Algorithm Suite 2.0* (CNSA 2.0) and its migration timeline — https://www.nsa.gov
- CISA: Post-Quantum Cryptography Initiative — https://www.cisa.gov/quantum
- CycloneDX: the CBOM (Cryptography Bill of Materials) specification — https://cyclonedx.org
