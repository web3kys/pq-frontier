---
title: "ML-DSA 入门：读懂 NIST 的后量子数字签名标准（FIPS 204）"
description: "从 Dilithium 到 FIPS 204：ML-DSA 的格签名原理、三档参数、签名为什么这么大，以及它在证书与代码签名中的位置。"
pubDate: 2026-11-21
lang: zh
section: pqc
tags: ["ML-DSA", "FIPS 204", "数字签名", "格密码"]
draft: false
featured: true
heroImage: "/images/pqc/ml-dsa.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "ml-dsa-fips-204"
keyPoints:
  - "ML-DSA 是 FIPS 204 规定的格基数字签名，源自 CRYSTALS-Dilithium，是 NIST 钦定的主力后量子签名。"
  - "三档参数 ML-DSA-44/65/87 分别对应约 2/3/5 级安全；签名大小 2.4–4.6 KB，公钥 1.3–2.6 KB。"
  - "签名基于 Fiat–Shamir with Aborts 与拒绝采样；私钥操作快，但实现必须防时序与故障攻击。"
---

如果说 ML-KEM 解决的是"密钥怎么安全送达"，ML-DSA 解决的就是"这条消息确实是我发的"——数字签名。后量子迁移里，签名场景比加密更棘手：固件签名、代码签名、证书签发的有效期以十年计，今天签出去的东西，必须在量子计算机成熟之后仍然可信。

## 从 Dilithium 到 ML-DSA

ML-DSA（Module-Lattice Digital Signature Algorithm）源自 CRYSTALS-Dilithium，2024 年 8 月 13 日随 FIPS 204 正式发布，与 FIPS 203（ML-KEM）、FIPS 205（SLH-DSA）同日落地。它的安全性建立在两个格难题上：Module-LWE（求解带误差的线性方程）与 Module-SIS（在格上找短向量）——与 ML-KEM 同宗同源，这也是 NIST 把两者放在同一技术路线上的原因：实现、分析与硬件加速可以共享大量积累。

签名构造采用 **Fiat–Shamir with Aborts** 范式：签名者用私钥与随机掩码生成一个承诺，对消息求哈希得到挑战，再计算响应；如果响应分布会泄露私钥信息，就干脆放弃这次签名、重来一遍（这就是 "Aborts" 与拒绝采样）。如此反复，直到得到一个分布与私钥无关的响应。验证者只需用公钥、消息与签名重算挑战是否自洽。

## 三档参数

| 参数集 | 公钥（字节） | 私钥（字节） | 签名（字节） | 目标安全等级 |
|---|---|---|---|---|
| ML-DSA-44 | 1,312 | 2,560 | 2,420 | 约 2 级（≈ SHA-256 碰撞） |
| ML-DSA-65 | 1,952 | 4,032 | 3,309 | 约 3 级（≈ AES-192） |
| ML-DSA-87 | 2,592 | 4,896 | 4,627 | 约 5 级（≈ AES-256） |

和 RSA-2048 的 256 字节签名、ECDSA P-256 的 64 字节签名相比，ML-DSA 的签名大了 10–70 倍。这是迁移工程里最实际的冲击：证书链、TLS 握手、代码签名包都会显著膨胀（本站《PKI 与证书的后量子迁移》一篇专门算这笔账）。

## 实现上的三个坑

**随机数与确定性。** FIPS 204 同时允许随机化签名与确定性签名，并推荐"对冲"（hedged）模式：随机数与消息、私钥共同派生，既避免随机数发生器故障重复出事，又保留确定性签名的可复现性。实现者不要自己发明随机数方案。

**拒绝采样的时序。** 拒绝次数本身依赖于私钥与消息——如果实现让"重试了几次"通过耗时泄露出去，就等于开了一条侧信道。正规实现会把循环写成数据无关的时序，或做专门的掩码处理。选库时优先选经过侧信道审计的实现（如 liboqs、OpenSSL 3.5、BoringSSL 的实现）。

**故障攻击。** 对签名设备注入故障（电压毛刺、激光）可能让一个错误签名泄露私钥。长期离线签名（如根 CA、固件签名机）应考虑签名后自验：签完立刻用公钥验一遍，成本很低、防线很值。

## 它会被用在哪里

- **TLS 与证书**：服务器证书、中间 CA 逐步换成 ML-DSA（或先与 ECDSA 组成复合证书过渡）；
- **代码与固件签名**：CNSA 2.0 把固件签名列为最优先迁移项，时间表最早、要求最硬；
- **文档与身份签名**：电子合同、软件包签名（如 Sigstore 生态的实验支持）。

ML-DSA 不是唯一答案：对签名体积极度敏感、或想要哈希函数级别保守安全假设的场景，还有 SLH-DSA（本站下一篇）与未来的 FN-DSA（Falcon，见研究栏目）。但作为通用主力，ML-DSA 是未来十年签名迁移的默认选项——先认识它，迁移清单才排得下去。

## 来源与延伸阅读

- NIST, *FIPS 204: Module-Lattice-Based Digital Signature Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.204
- Ducas et al., *CRYSTALS-Dilithium Algorithm Specifications and Supporting Documentation*, 2021. https://pq-crystals.org/dilithium/
- NIST PQC Standardization Project. https://csrc.nist.gov/projects/post-quantum-cryptography
