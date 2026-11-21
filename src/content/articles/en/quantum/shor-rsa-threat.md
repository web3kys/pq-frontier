---
title: "Shor's Algorithm: How Quantum Computing Threatens RSA and Elliptic-Curve Cryptography"
description: "Starting from why factoring and discrete logarithms are hard, an explanation of Shor's core idea, how large a quantum computer breaking RSA-2048 would have to be, and why 'harvest now, decrypt later' makes migration a present-day task."
pubDate: 2026-11-20
lang: en
section: quantum
tags: ["Shor's Algorithm", "RSA", "Quantum Threat", "Harvest Now Decrypt Later"]
heroImage: "/images/quantum/shor.jpg"
imageCredit: "AI-generated artwork created for PQ Frontier"
draft: false
translationKey: "shor-rsa-threat"
keyPoints:
  - "Shor's algorithm solves integer factorization and discrete logarithms in polynomial time — neither RSA nor ECC survives a sufficiently large fault-tolerant quantum computer."
  - "Breaking RSA-2048 takes on the order of thousands of logical qubits and tens of millions of physical qubits (surface code, 10^-3 physical error rate)."
  - "The timeline is set by error-correction progress; harvest-now-decrypt-later puts long-shelf-life data at risk today."
---

## The two pillars of current public-key cryptography

RSA's security rests on **integer factorization**: given the product $N = p \times q$ of two large primes, recovering the factors with the best known classical algorithms would take far longer than the age of the universe. Elliptic-curve cryptography (ECC) rests on the **discrete logarithm** problem: given $Q = dG$ on a curve, recovering the private key $d$ is equally infeasible.

These two pillars carry nearly all of today's key exchange, digital signatures and certificate systems. The problem: neither survives a quantum computer.

## What Shor's algorithm does

In 1994, Peter Shor showed that a quantum computer can solve integer factorization and discrete logarithms in polynomial time. The core idea is to reduce factoring to **period finding**: for a randomly chosen $a$, the function $f(x) = a^x \bmod N$ is periodic, and once the quantum Fourier transform extracts the period $r$ efficiently, a non-trivial factor of $N$ follows with high probability.

Shor's algorithm runs in roughly $O((\log N)^3)$ time, against the sub-exponential general number field sieve — the best classical method. This is not "somewhat faster"; it is the difference between impossible and possible. The barrier that protects RSA-2048 classically simply does not exist for a sufficiently large fault-tolerant quantum computer. A variant of Shor's algorithm covers elliptic-curve discrete logarithms with the same conclusion — and at equal security levels, ECC needs even fewer quantum resources than RSA.

## How large a quantum computer does it take?

The operative words are "sufficiently large". Running Shor's algorithm against RSA-2048 requires a **fault-tolerant** machine: the well-known 2019 estimate by Gidney and Ekerå puts it at about 20 million noisy physical qubits running for roughly 8 hours, under specific surface-code and error-rate assumptions.

Today's quantum computers sit at roughly a thousand physical qubits with no large-scale fault tolerance — orders of magnitude away from that threshold. Nobody can credibly promise the year it will be crossed, and that is precisely the point: **a migration decision cannot rest on a timeline nobody can guarantee.**

## The real urgency: harvest now, decrypt later

Even if the machines are a decade away, the clock has already started. An attacker can record encrypted traffic today — *harvest now* — and decrypt it once a quantum computer is available — *decrypt later*. If your data must stay secret longer than the time until such a machine exists, it is already unsafe today.

Mosca's inequality makes this concrete: let data need $X$ years of secrecy, migration take $Y$ years, and a large quantum computer arrive in $Z$ years — if $X + Y > Z$, you are already late. Medical records, state secrets and long-term contracts routinely carry an $X$ measured in decades, and large systems carry a $Y$ measured in years. The conclusion is direct: **the urgency of migration depends not on when quantum computers arrive, but on how long your data must remain secret.**

## Summary

- Shor's algorithm ends the security of RSA and ECC in theory — that is a mathematical result, not speculation;
- what is missing is only a large enough fault-tolerant quantum computer, on a schedule nobody can guarantee;
- harvest-now-decrypt-later puts long-lived data at risk today;
- post-quantum migration — starting with [ML-KEM](../pqc/ml-kem-fips-203/) — is therefore engineering work to schedule now, not a topic for the future.

## References

1. Shor, P. W., *Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer*, SIAM Journal on Computing, 1997. https://arxiv.org/abs/quant-ph/9508027
2. Gidney, C., Ekerå, M., *How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits*, Quantum 5, 433 (2021). https://arxiv.org/abs/1905.09749
3. Mosca, M., *Cybersecurity in an era with quantum computers: will we be ready?*, IEEE Security & Privacy, 2018.
