---
title: "Quantum Error Correction: Surface Codes, Thresholds and Logical Qubits"
description: "Why a quantum computer needs thousands of physical qubits to protect one logical qubit — error models, the surface code, the threshold theorem, and Willow's below-threshold demonstration."
pubDate: 2026-11-21
lang: en
section: quantum
tags: ["quantum error correction", "surface code", "fault tolerance"]
draft: false
featured: false
heroImage: "/images/quantum/qec.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
translationKey: "quantum-error-correction"
keyPoints:
  - "QEC encodes one logical qubit into many physical qubits and locates errors by measuring syndromes — without ever looking at the protected data."
  - "The surface code is the leading approach: it tolerates roughly 1% physical error rates, needs only nearest-neighbour coupling, and has demonstrated below-threshold scaling."
  - "Overhead is the hard constraint: at a 10^-3 physical error rate, one high-fidelity logical qubit costs on the order of a thousand physical qubits."
---

Qubits are notoriously fragile: a whisper of environmental coupling or a slightly-off control pulse quietly corrupts a superposition. Worse, the classical fix — copy the data and take a majority vote — is forbidden by the no-cloning theorem. Quantum error correction (QEC) solves the problem within the rules of quantum mechanics, and its progress is the central variable in every estimate of how far away a cryptographically relevant quantum computer is (see our Shor's algorithm article for the resource side).

## The core idea: make errors measurable

QEC encodes the information of one logical qubit **non-locally** across the entangled state of many physical qubits. Errors (bit flips X, phase flips Z) change certain observables of that state — the **syndrome**. By measuring syndromes repeatedly, a classical decoder infers which qubit most likely suffered which error and corrects the bookkeeping in software, never measuring — and never collapsing — the protected data itself.

The price is redundancy, and it is steep. A distance-$d$ surface-code logical qubit needs roughly $d^2$ data qubits plus $d^2$ ancillas. To reach logical error rates low enough for Shor's algorithm (around $10^{-15}$ per operation) at a physical error rate of $10^{-3}$, $d$ must be 25–30 — about 1,000–1,500 physical qubits per logical qubit. Multiply by the thousands of logical qubits the algorithm needs, and you get the famous "tens of millions of physical qubits" figure.

## The threshold theorem: why correction can work at all

The threshold theorem is QEC's foundation: **if the physical error rate sits below a threshold (about 1% for the surface code), increasing the code distance suppresses the logical error rate without bound**, at only polynomial overhead. Above threshold, correction introduces more errors than it removes, and no amount of hardware helps.

That line defines the industry's real race: push physical error rates from percent down to per-mille, and prove that logical errors actually shrink as codes grow. In December 2024 Google published the Willow results in *Nature*: scaling surface codes from distance 3 to 5 to 7 cut the logical error rate by a factor of about 2.14 at each step, and the logical qubit outlived its best physical qubit — the landmark demonstration of below-threshold operation, and the point where error correction turned from principle into engineering.

## Why the surface code leads

- **Locality** — only nearest-neighbour interactions on a 2D grid, a natural match for superconducting chip layouts;
- **High threshold** — around 1%, the most forgiving of any code family;
- **Mature decoding** — minimum-weight perfect matching and its successors have two decades of work behind them, and real-time decoding pipelines (FPGA/ASIC) are being engineered now.

Challengers are coming: qLDPC codes (such as IBM's bivariate bicycle codes) trade long-range coupling for far lower encoding overhead and have advanced quickly since 2024; bosonic codes (cat, GKP) push correction down into a single resonator. The winner is undecided, but the axis of competition for the next five years is clear: **not who has the most physical qubits, but who has the cheapest logical qubit**.

## What it means for security planning

For cryptography, QEC's pace sets the harvest-now-decrypt-later window: every step down in physical error rates and logical-qubit overhead shrinks the machine needed to break RSA-2048. When you follow this field, ignore qubit-count headlines and watch three numbers instead: the physical error rate, the logical error suppression factor per distance step (Λ), and the count of demonstrated logical qubits. Those are the coordinates a migration timeline should be anchored to.

## Sources and further reading

- Google Quantum AI, *Quantum error correction below the surface code threshold*, Nature 638 (2025). https://doi.org/10.1038/s41586-024-08449-y
- Fowler et al., *Surface codes: Towards practical large-scale quantum computation*, Phys. Rev. A 86, 032324 (2012).
- Bravyi et al., *High-threshold and low-overhead fault-tolerant quantum memory*, Nature 627 (2024).
