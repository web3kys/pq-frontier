---
title: "The Quantum Hardware Landscape: Superconducting, Trapped-Ion, Neutral-Atom, Photonic and Topological"
description: "The five leading hardware routes — their physical carriers, representative players, fidelities and scaling bottlenecks — and the metrics that actually matter when judging any of them."
pubDate: 2026-11-21
lang: en
section: quantum
tags: ["quantum hardware", "superconducting", "trapped ion", "neutral atom"]
draft: false
featured: false
heroImage: "/images/quantum/shor.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "quantum-hardware-landscape"
keyPoints:
  - "No route has won: superconducting leads on speed and engineering depth, ions on fidelity, neutral atoms on scale, photonics on room-temperature operation and networking, topological on in-hardware protection in principle."
  - "Judge hardware by more than qubit counts: two-qubit gate fidelity, coherence, connectivity and error-correction demonstrations together decide the distance to fault tolerance."
  - "For cryptographic planning, what matters is not a route's raw qubit total but the quality and scaling slope of its logical qubits."
---

A "quantum computer" is not one machine but at least five, built on entirely different physical carriers, with different bottlenecks and different clocks. This article maps the landscape: what each route uses as a qubit, how far it has come, and where it is stuck.

## Superconducting circuits: the deepest engineering bench

Josephson junctions shaped into anharmonic oscillators, operated inside millikelvin dilution refrigerators — the route of Google, IBM, Rigetti and many national labs. Gates are fast (tens of nanoseconds), fabrication borrows from the semiconductor world, and the ecosystem is the most mature: IBM's Condor reached 1,121 physical qubits, its Heron line optimizes fidelity, and Google's Willow (105 qubits) mattered not for its count but for below-threshold surface-code operation (see our error-correction primer).

The bottlenecks are equally clear: wiring density (every qubit needs microwave lines into the fridge), crosstalk, and fabrication variability. Scaling means multi-chip modules and cryogenic electronics — engineering that gets harder, not easier, with size.

## Trapped ions: the fidelity benchmark

Single ions (Yb⁺, Ca⁺) held in electromagnetic traps and driven by lasers. Coherence times run to seconds or minutes, connectivity is all-to-all within a chain, and two-qubit gate fidelities are the best in the field (publicly reported around 99.9%). Quantinuum's H series (H2: 56 qubits) and IonQ lead here, and their logical-qubit demonstrations have consistently set the quality bar.

The price is speed — gates are two to three orders of magnitude slower than superconducting — and chains hold only so many ions, so scaling needs ion shuttling (QCCD architectures) or photonic interconnects, both complex.

## Neutral atoms: the scale dark horse

Optical tweezer arrays holding hundreds to thousands of neutral atoms (e.g. Rb), with Rydberg interactions for gates. This route scales fastest in raw numbers — thousand-atom arrays are routine demonstrations — and in 2023 a Harvard/MIT/QuEra team reported 48 logical qubits in *Nature*, a result that reset expectations for the whole field. Reconfigurable connectivity (atoms can be moved) is a unique flexibility.

The gaps are gate fidelity (still chasing ions) and readout speed, plus atom loss, which needs erasure-conversion techniques. Pasqal, QuEra and Atom Computing are the main players.

## Photonics: room-temperature and network-native

Photons as qubits are naturally suited to communication and networking, with sources and detectors at or near room temperature. Deterministic entangled sources are the hard part, so the mainstream approach is measurement- and fusion-based computing: prepare small entangled resource states, then stitch them together with fusion measurements. PsiQuantum bets on exactly this, manufactured in semiconductor fabs; Xanadu has demonstrated photonic quantum advantage experiments. Loss and correction overhead are the gates this route must clear.

## Silicon spin and topological: the long-distance runners

Silicon spin qubits share DNA with CMOS — smallest footprint, fab-compatible — but started latest and are still climbing on fidelity and scale. The topological route (Microsoft's Majorana platform) aims to build protection into the hardware itself with non-Abelian anyons: Microsoft's Majorana 1 chip (eight topological qubits, February 2025) is the boldest claim in the landscape and remains contested in the community, pending independent verification — the highest-uncertainty entry on this map.

## How to judge a route

| Metric | What it tells you |
|---|---|
| Two-qubit gate fidelity | Distance to the ~99% correction threshold |
| Coherence time / gate speed | How many operations fit in a qubit's lifetime |
| Connectivity | Compilation overhead for codes and algorithms |
| Logical-qubit demonstrations | Logical error rate and the suppression factor Λ |
| Scaling path | Whether wiring, cooling and interconnects have credible engineering answers |

For security planners the conclusion matches this site's standing advice: never calibrate a migration timeline to "company X announced N qubits." Watch the quality and cost curve of logical qubits. If any one of the five routes makes logical qubits cheap and reliable, Q-day moves closer — and the entire point of post-quantum migration is not betting that it won't.

## Sources and further reading

- Google Quantum AI, *Quantum error correction below the surface code threshold*, Nature 638 (2025).
- Bluvstein et al., *Logical quantum processor based on reconfigurable atom arrays*, Nature 626 (2024).
- Microsoft Azure Quantum, *Majorana 1* announcement, 2025-02. (Topological claims await independent verification.)
- Quantinuum, *System Model H2* technical documentation, 2024.
