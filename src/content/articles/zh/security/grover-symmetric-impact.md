---
title: "Grover 算法与对称密码：AES-128 还安全吗"
description: "量子搜索只给平方级加速：为什么对称密码靠加倍密钥长度就能过关，哈希又该怎么选——以及 NIST 安全等级的标尺是怎么定的。"
pubDate: 2026-11-21
lang: zh
section: security
tags: ["Grover", "AES", "对称密码", "哈希"]
draft: false
featured: false
heroImage: "/images/security/grover.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "grover-symmetric-impact"
keyPoints:
  - "Grover 算法给无结构搜索平方级加速：2^n 的密钥空间变成约 2^(n/2) 次量子查询——AES-128 降到约 2^64，AES-256 仍有约 2^128。"
  - "但每次 Grover 迭代本身是一次完整的量子 AES 电路，深度与纠错开销巨大；在现实深度约束下，AES-128 的实际安全余量比 2^64 这个数字看起来要大。"
  - "工程结论简单：长期机密用 AES-256 与 SHA-384/512，对称体系不需要推倒重来——这也是它与公钥体系命运完全不同的原因。"
---

后量子讨论里有个常见误会：以为量子计算机"破解一切密码"。事实是分化的——Shor 算法对 RSA、ECC 是指数级打击，而对对称密码，量子计算只能拿出 Grover 算法这张牌：平方级加速。平方级听起来吓人，实际处理起来只需要把密钥加长一倍。

## Grover 做了什么

Grover 算法（1996）在 $N$ 个无结构候选里找满足条件的那个，经典需要 $O(N)$ 次尝试，量子只需 $O(\sqrt{N})$ 次"查询"。对 128 位密钥的 AES：经典暴力破解是 $2^{128}$，量子约 $2^{64}$ 次迭代。

但魔鬼在细节里。**一次 Grover 迭代不是一次经典试错**：它要把整个 AES 电路以量子可逆电路形式跑一遍，还要在纠错保护下运行。估算显示，单次迭代需要数千个逻辑量子比特与深达数万门的电路；$2^{64}$ 次这样的迭代串行执行，总时间以年甚至远超年的尺度计。NIST 在 PQC 标准化中专门引入了 MAXDEPTH（可行的最大电路深度，$2^{40}$–$2^{96}$）来约束这类估算：在现实深度上限下并行拆分 Grover，收益会迅速递减。

这就是 NIST 安全等级的定义方式：1 级 = 破解 AES-128 的资源量，3 级 = AES-192，5 级 = AES-256——标尺本身就建立在"算上 Grover 与深度约束后的真实成本"之上，而不是裸的平方根。

## 哈希函数的情况

- **原像攻击**（给定哈希找输入）：Grover 平方加速，SHA-256 的原像强度从 $2^{256}$ 降到 $2^{128}$——仍然足够；
- **碰撞攻击**（找任意两个同哈希输入）：经典生日攻击 $2^{128}$；量子 BHT 算法名义上是 $2^{85}$ 量级，但需要巨大的量子存储，按存储成本核算后优势基本消失，业界普遍认为 SHA-256 的碰撞强度在量子时代仍可接受；
- 真正要动的是输出太短的老算法：SHA-1、MD5 在经典时代就已经死了，与量子无关。

## 工程结论

1. **新系统默认 AES-256**：成本与 AES-128 几乎无差（多 4 轮），换来对 Grover 的完整免疫；
2. **长期机密与根密钥**：哈希选 SHA-384/512，KDF 输出拉长；
3. **存量 AES-128 不必恐慌式更换**：按数据保质期排优先级即可，它排在公钥迁移的后面很远；
4. **对称体系没有"先存后破"问题**：密文被存下来，等量子机成熟时 Grover 的成本依然高得离谱——与 RSA 密文"到期即裸奔"完全不同。

一句话总结：量子计算对公钥体系是革命，对对称体系只是通胀——把面额（密钥长度）印大一倍，账就平了。

## 来源与延伸阅读

- Grover, *A fast quantum mechanical algorithm for database search*, STOC 1996. arXiv:quant-ph/9605043
- NIST, *Call for Proposals: PQC Standardization*（安全等级与 MAXDEPTH 定义）, 2016. https://csrc.nist.gov/projects/post-quantum-cryptography
- Grassl et al., *Applying Grover's algorithm to AES: quantum resource estimates*, PQCrypto 2016.
