---
title: "SLH-DSA：只靠哈希函数的保守派签名（FIPS 205）"
description: "SPHINCS+ 如何用哈希树做到无状态签名：12 组参数、几十 KB 的签名、以及它最适合的场景——离线根密钥与固件签名。"
pubDate: 2026-11-21
lang: zh
section: pqc
tags: ["SLH-DSA", "FIPS 205", "哈希签名", "SPHINCS+"]
draft: false
featured: false
heroImage: "/images/pqc/ml-kem.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "slh-dsa-fips-205"
keyPoints:
  - "SLH-DSA（FIPS 205）只依赖哈希函数的安全性，是 NIST 三个签名标准里假设最保守的一个。"
  - "代价是体积与速度：签名 7.8–49.9 KB，签名速度明显慢于 ML-DSA，但公钥只有 32–64 字节。"
  - "它是无状态的——不像 XMSS/LMS 需要小心维护一次性密钥计数器，因此特别适合离线根 CA 与固件签名。"
---

在 NIST 的三个后量子签名标准里，SLH-DSA 是"保险丝"：万一格密码的数学假设将来被削弱，只依赖哈希函数的它仍然站得住。这种保守不是免费的——它用签名体积和速度换安全假设的纯粹。

## 从哈希树到无状态签名

哈希签名有个老问题：最原始的 Lamport 一次性签名，每个密钥只能签一次。XMSS、LMS 用 Merkle 树把许多一次性密钥组织起来，但要求签名者**严格维护状态**——计数器一旦回滚、同一个一次性密钥被用两次，安全性立刻崩塌。备份恢复、虚拟机快照、双机热备都可能让状态回退，这是工程上的真实雷区。

SLH-DSA 源自 SPHINCS+，解法是把树做深、做宽（多层 hypertree），并用"少时签名"（few-time signature, FORS）承接叶子层：密钥空间大到随机选一个未用过的叶子，碰撞概率低到可忽略。于是签名不再需要计数器——**无状态**，随便备份、随便迁移。FIPS 205 于 2024 年 8 月 13 日与 FIPS 203/204 同日发布。

## 12 组参数怎么选

参数由三个维度组合：哈希函数（SHA2 或 SHAKE）、安全等级（128/192/256 位）、速度/体积取向（s = small 签名小但慢，f = fast 签名大但快）。

| 代表参数集 | 公钥 | 签名 | 特点 |
|---|---|---|---|
| SLH-DSA-SHA2-128s | 32 B | 7,856 B | 签名最小，签名最慢 |
| SLH-DSA-SHA2-128f | 32 B | 17,088 B | 128 位里速度优先 |
| SLH-DSA-SHA2-256s | 64 B | 29,792 B | 高安全、小签名 |
| SLH-DSA-SHA2-256f | 64 B | 49,856 B | 签名近 50 KB |

公钥只有几十字节，这是它被低估的优点：需要把公钥烧进 ROM、印在纸上、塞进极小引导代码的场景，SLH-DSA 是唯一现实的选择。验签速度尚可（毫秒级），慢的主要是签名——但在它的主场场景里，签名本来就是低频操作。

## 它最适合什么

- **离线根 CA 与代码签名根**：一年签不了几次，慢一点无所谓；无状态让冷备份、异地灾备都不再危险；
- **固件与引导链**：公钥极小，验证代码只需一个哈希函数，攻击面最小；
- **长期档案签名**：法律文书、存证——需要 30 年后仍可信、且不愿押注格假设的场景。

不适合的：高频在线签名（TLS 握手、每请求签名）——体积与延迟都吃不消，那是 ML-DSA 的主场。选型的一般原则：**在线签名用 ML-DSA，离线根与长寿命签名用 SLH-DSA 对冲**。这正是 CNSA 2.0 在固件签名上同时点名两者的原因。

## 来源与延伸阅读

- NIST, *FIPS 205: Stateless Hash-Based Digital Signature Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.205
- Bernstein et al., *SPHINCS+ Specification* (submission to NIST PQC). https://sphincs.org/
- 本站：《ML-DSA 入门：读懂 NIST 的后量子数字签名标准（FIPS 204）》
