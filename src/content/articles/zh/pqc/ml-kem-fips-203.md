---
title: "ML-KEM 入门：读懂 NIST 的后量子密钥封装标准（FIPS 203）"
description: "从为什么需要密钥封装机制出发，系统解读 FIPS 203 的数学基础、三个参数集与三个核心算法，以及它和 CRYSTALS-Kyber 的关系。"
pubDate: 2026-11-20
lang: zh
section: pqc
tags: ["ML-KEM", "FIPS 203", "NIST", "密钥封装"]
heroImage: "/images/pqc/ml-kem.jpg"
imageCredit: "本站 AI 生成配图"
draft: false
featured: true
translationKey: "ml-kem-fips-203"
keyPoints:
  - "ML-KEM 是 FIPS 203 规定的格基密钥封装机制，源自 CRYSTALS-Kyber，是后量子密钥交换的默认选择。"
  - "三档参数 ML-KEM-512/768/1024 对应约 1/3/5 级安全；公钥 800–1568 字节，密文 768–1568 字节。"
  - "解封装采用隐式拒绝抵御选择密文攻击；工程上优先与 X25519 组成混合密钥交换部署。"
---

## 为什么先从密钥封装开始

今天互联网上几乎每一次安全连接，第一步都是协商出一把双方共享的会话密钥。RSA 密钥交换已经淘汰，主流做法是椭圆曲线 Diffie–Hellman（ECDH）——而它和 RSA 一样，会被足够大的量子计算机上的 Shor 算法攻破。

后量子迁移的第一块基石因此是一种叫**密钥封装机制**（Key Encapsulation Mechanism, KEM）的原语：一方用对方的公钥"封装"出一个随机共享秘密，另一方用私钥"解封装"恢复它。2024 年 8 月 13 日，NIST 发布 FIPS 203，ML-KEM 成为第一个标准化的后量子 KEM，也是目前迁移工作的默认选项。

## 数学基础：Module-LWE

ML-KEM 的安全性建立在**模格上的容错学习问题**（Module Learning With Errors, Module-LWE）之上。直观地说：给定矩阵 $\mathbf{A}$ 和被小噪声扰动过的乘积 $\mathbf{b} = \mathbf{A}\mathbf{s} + \mathbf{e}$，恢复秘密向量 $\mathbf{s}$ 被认为是困难的——对经典和量子计算机都是如此。

它工作的多项式环是 $R_q = \mathbb{Z}_q[X]/(X^{256} + 1)$，其中模数 $q = 3329$。所有运算都可以用数论变换（NTT）高效完成，这是 ML-KEM 速度快、实现友好的重要原因。

## 三个参数集

FIPS 203 定义了三个参数集，对应 NIST 的三个安全等级。共享秘密长度恒为 32 字节：

| 参数集 | 安全等级 | 封装公钥（字节） | 解封装私钥（字节） | 密文（字节） |
| --- | --- | --- | --- | --- |
| ML-KEM-512 | 等级 1（≈AES-128） | 800 | 1632 | 768 |
| ML-KEM-768 | 等级 3（≈AES-192） | 1184 | 2400 | 1088 |
| ML-KEM-1024 | 等级 5（≈AES-256） | 1568 | 3168 | 1568 |

ML-KEM-768 是目前业界部署的默认选择：安全裕度充足，而公钥和密文各约 1.1 KB，放在 TLS 握手里可接受。作为对比，X25519 的公钥只有 32 字节——后量子迁移的一个实际代价，就是握手包变大，这一点在做系统评估时必须计入。

## 三个核心算法

- **KeyGen**：由随机种子展开矩阵 $\mathbf{A}$，采样秘密与噪声，生成封装公钥与解封装私钥。
- **Encaps**：用公钥加密一个随机消息并做哈希，得到密文与 32 字节共享秘密。
- **Decaps**：用私钥恢复消息，重新加密并比对密文（Fujisaki–Okamoto 变换），一致才接受共享秘密，不一致则返回一个由私钥派生的"伪秘密"——失败时不泄露任何信息。

这套构造使 ML-KEM 达到 IND-CCA2 安全：即使攻击者可以反复要求系统解封装自选的密文，也得不到任何优势。

## 和 CRYSTALS-Kyber 的关系

ML-KEM 源于学术界的 CRYSTALS-Kyber（NIST 2022 年 7 月首批选定的算法之一）。标准化过程中 NIST 做了少量修改——例如密钥生成对随机源的使用方式、编码与哈希细节——因此 **FIPS 203 的实现与最后一轮 Kyber 规范并不逐字节兼容**。做互操作测试时，认准 "ML-KEM / FIPS 203" 字样，不要默认 "Kyber" 实现可以直接混用。

## 部署现状（截至 2026 年 11 月）

主流浏览器与大型 CDN 已在 TLS 1.3 中启用 X25519 与 ML-KEM-768 的**混合密钥交换**：两种算法同时使用，任一未被攻破则连接仍然安全。这也是当前最稳妥的迁移姿势——先用混合模式获得后量子保护，同时保留经典算法的安全背书，待生态成熟后再切换为纯后量子。

## 小结

ML-KEM 解决的是"量子时代如何协商密钥"的问题：基于 Module-LWE，三个参数集覆盖从 AES-128 到 AES-256 的安全等级，768 是当前的部署甜点。下一篇我们会动手实验：在 [技术教程](../tutorials/) 里用 liboqs 真正跑一次 ML-KEM 的密钥生成、封装与解封装。

## 参考资料

1. NIST, *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
2. NIST, Post-Quantum Cryptography Standardization（项目主页）. https://csrc.nist.gov/projects/post-quantum-cryptography
3. Bos, J. et al., *CRYSTALS – Kyber: a CCA-secure module-lattice-based KEM*, IEEE EuroS&P 2018. https://eprint.iacr.org/2017/634
