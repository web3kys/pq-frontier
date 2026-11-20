---
title: "格密码为什么难：从 LWE 到 Module-LWE"
description: "一行带噪声的线性方程，撑起了 ML-KEM 与 ML-DSA 的安全。拆解 LWE 的难度来源、Regev 的最坏情况归约，以及 Module-LWE 用结构换效率的取舍。"
pubDate: 2026-11-21
lang: zh
section: research
tags: ["LWE", "格密码", "Module-LWE", "安全性归约"]
heroImage: "/images/research/research.jpg"
imageCredit: "本站 AI 生成配图"
draft: false
featured: true
translationKey: "why-lattices-are-hard"
---

## 一行方程，两种命运

先看一个平平无奇的线性方程组。给定矩阵 $A$ 和向量 $b = A s \bmod q$，求未知向量 $s$——这是初中数学，高斯消元几步就能解出来。

现在给等式右边加上一点点噪声：

$$
b = A s + e \pmod q
$$

其中 $e$ 的每个分量都是很小的随机整数（比如 $-2$ 到 $2$ 之间）。就这一个改动，问题从「几步解出」变成了「已知最好的算法也要指数级时间」。这就是 **LWE**（Learning With Errors，带错误学习）问题，由 Regev 在 2005 年提出——今天 ML-KEM 和 ML-DSA 的安全性，都建在它和它的变体之上。

## 噪声为什么是本质

直觉上，噪声把精确的代数结构打碎了。没有噪声时，方程之间严丝合缝，线性代数畅通无阻；有了噪声，每条方程都「差不多对」，攻击者无法判断哪一部分是信号、哪一部分是误差，更无法用消元把误差消掉——误差在运算中只会扩散，不会消失。

把 LWE 换成几何语言，它等价于格上的**最近向量问题**（CVP）：给定格 $L(B) = \{ Bx : x \in \mathbb{Z}^n \}$ 和一个离格不远的点，找回最近的格点。维度低时（如 $n < 100$）有成熟算法；维度到了几百（ML-KEM-768 的有效维度在 700 量级以上），已知最好的筛法与 BKZ 归约的成本都随维度指数增长——这正是参数选择时用「Core-SVP 成本」估算安全强度的原因。

## 最坏情况归约：格密码的定心丸

LWE 最打动密码学家的一点，不是「平均很难」，而是 Regev 证明的**最坏情况到平均情况的归约**：如果存在一个算法能以不可忽略的概率解开随机 LWE 实例，那么就存在一个（量子）算法能解开格问题在**最坏情况**下的近似版本。

对比一下 RSA：它的安全依赖于「随机抽一个大合数，分解它很难」——但万一某类合数恰好容易分解呢？没人能排除。LWE 的归约则说：随机实例和最难的实例一样难。这类保证在公钥密码里极为罕见，是 NIST 标准化过程中格路线最重的砝码之一。后续 Peikert 等人又给出了经典（非量子）归约，进一步加固了这条链。

## Module-LWE：用结构换效率

纯 LWE 有个工程问题：密钥就是矩阵 $A$ 本身，尺寸随维度平方增长，大得没法用。解决办法是给问题加上代数结构：

- **Ring-LWE**：把向量换成多项式环 $R_q = \mathbb{Z}_q[x]/(x^n + 1)$ 上的元素，一次乘法经 NTT（数论变换）可以做到近乎线性时间；
- **Module-LWE**：介于两者之间——向量元素是多项式，矩阵是小的多项式矩阵。ML-KEM 选的就是它，用参数 $k$（2/3/4）在结构与保守之间调节。

效率的收益是实打实的：ML-KEM-768 的封装密钥只有 1184 字节，运算速度甚至快于同安全级别的椭圆曲线。但结构永远是一把双刃剑：多出来的代数结构会不会成为攻击的把手？这是二十年来持续的研究问题——针对 Ring/Module 结构的代数攻击至今没有实质突破，NIST 在遴选时也明确评估了这一点；同时选 Module 而非纯 Ring、并保留足够的参数余量，正是对这份不确定性的对冲。

## 小结

格密码的难度可以浓缩成一句话：**噪声让线性问题变得不可解，归约让这份难度有了最坏情况的背书，模结构让它变得足够小、足够快。** 理解这三层，也就理解了后量子标准为什么长成今天这个样子。安全强度的具体估算，业界通行工具是开源的 Lattice Estimator——参数表上的每一个数字，最终都要过它那一关。

## 参考来源

- Regev, O. (2005)：《On lattices, learning with errors, random linear codes, and cryptography》，arXiv: quant-ph/0507170
- Peikert, C. (2009)：《Public-key cryptosystems from the worst-case shortest vector problem》，STOC 2009
- Bos, J. 等 (2018)：《CRYSTALS-Kyber: a CCA-secure module-lattice-based KEM》，ePrint 2017/634
- Albrecht, M. 等：Lattice Estimator（开源安全强度估算工具）— https://github.com/malb/lattice-estimator
