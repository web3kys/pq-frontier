---
title: "Global Migration Timelines Compared: CNSA 2.0, NIST IR 8547, the EU and the UK"
description: "The major official timelines on one table: what must be done by 2030, the shared 2035 endpoint, and which line an enterprise should plan against."
pubDate: 2026-11-21
lang: en
section: migration
tags: ["CNSA 2.0", "NIST IR 8547", "migration timelines", "compliance"]
draft: false
featured: false
heroImage: "/images/migration/migration.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "global-migration-timelines"
keyPoints:
  - "Official timelines are converging: high-priority systems migrated around 2030, full transition around 2035 — the common shape of the NIST, EU and UK roadmaps."
  - "CNSA 2.0 is the hardest-edged: for US national security systems, firmware signing leads from 2025, phased mandates run 2030–2033, and classical public key is essentially out by 2035."
  - "Enterprises should plan against the strictest line that touches their supply chain or markets — not wait for their own regulator to call."
---

The most common migration question — "by when, exactly?" — is answered not by any single document but by the intersection of several official timelines. Laid side by side, they agree more than you might expect.

## The United States: CNSA 2.0 and NIST IR 8547

**CNSA 2.0** (NSA; binding on national security systems and their suppliers) is the most concrete table available:

- **Software and firmware signing** — prefer CNSA 2.0 algorithms (ML-DSA, LMS/XMSS) from 2025; classical signing out of default use by 2030;
- **Networking, VPN and TLS** — phased switch to ML-KEM and ML-DSA across 2026–2030;
- **Operating systems and cloud services** — complete by 2030–2033;
- **2035** — quantum-vulnerable algorithms essentially eliminated from national security systems.

**NIST IR 8547** (2024 draft) draws the algorithm retirement line: from 2030, classical public-key algorithms at ≤112-bit security (RSA-2048, ECDH P-256 and peers) are *deprecated*; from 2035, *disallowed*. It formally binds federal systems and FIPS-validated products — and reaches everyone else through the supply chain.

## The EU and the UK

**European Union.** The coordinated roadmap published in April 2025 (under the NIS Cooperation Group) recommends member states start migration and complete inventories and plans by the end of 2026, finish high-risk systems by the end of 2030, and complete the transition as far as possible by 2035. The EU additionally ties migration to product law such as the Cyber Resilience Act — products sold into the EU will need cryptographic inventories and upgrade paths.

**United Kingdom.** NCSC guidance (2025) sets three milestones: discovery and prioritization by 2028, highest-priority systems migrated by 2031, full migration by 2035. It is written as self-directed organizational planning and is the most borrowable template for unregulated industries.

## Other signals worth noting

- **Canada and Australia** — the CCCS expects federal transition plans aimed at 2035; Australia's ASD ISM guidance puts classical public-key retirement around 2030, among the more aggressive dates in the major economies;
- **Finance** — FS-ISAC, central-bank and payment-network position papers consistently rank payment and interbank systems as high priority, and cross-border interoperability windows will close earlier than any single national table;
- **China** — an independent standards and research track (commercial-cryptography system plus domestic PQC research); cross-border systems need dual-track planning.

## How an enterprise should use this table

1. **Adopt the strictest line that touches you** — a US government supply chain, an EU market, or financial customers each import their deadlines into your plan;
2. **2030 is the real hard node** — high-priority systems (external TLS, signing, long-shelf-life data) land around 2030 in every table; plan backwards from "high-priority migration done by end of 2029";
3. **2035 is the zero line** — budget and architecture should assume classical public key exits production by 2035;
4. **Timelines move, direction doesn't** — every revision so far has made these tables finer and firmer, never looser. Building the CBOM inventory first is the step that is correct under every version of every table.

## Sources and further reading

- NSA, *Commercial National Security Algorithm Suite 2.0* (CNSA 2.0) FAQ, 2022–2024. https://www.nsa.gov/Cybersecurity/Post-Quantum-Cybersecurity-Resources/
- NIST, *IR 8547 (initial public draft): Transition to Post-Quantum Cryptography Standards*, 2024. https://csrc.nist.gov/pubs/ir/8547/ipd
- European Commission, *A Coordinated Implementation Roadmap for the Transition to Post-Quantum Cryptography*, 2025-04.
- UK NCSC, *Timelines for migration to post-quantum cryptography*, 2025-03.
