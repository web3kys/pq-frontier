---
title: "Falcon 与 FN-DSA：最小的后量子签名，为什么最难实现"
description: "NTRU 格上的高斯采样如何把签名压到约 666 字节：Falcon 的原理、浮点陷阱与 FIPS 206 的标准化进程。"
pubDate: 2026-11-21
lang: zh
section: research
tags: ["Falcon", "FN-DSA", "FIPS 206", "NTRU"]
draft: false
featured: false
heroImage: "/images/research/falcon.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "falcon-fndsa"
keyPoints:
  - "Falcon 是 NIST 选定的第四个签名方案（将标准化为 FN-DSA / FIPS 206），签名约 666 字节（Falcon-512），是所有后量子签名里最小的。"
  - "小体积来自 NTRU 格 + 格上高斯采样；代价是签名必须用双精度浮点运算，实现难度与侧信道风险显著高于 ML-DSA。"
  - "它的位置不是取代 ML-DSA，而是补位：带宽与存储极度受限、验签频繁的场景（DNSSEC、证书链、嵌入式）。"
---

在后量子签名里，Falcon 是个异类：当 ML-DSA 的签名以 KB 计、SLH-DSA 以几十 KB 计时，Falcon-512 的签名只有约 666 字节，公钥 897 字节——和 RSA 时代的尺寸同一量级。NIST 在 2022 年宣布将它标准化（正式名称 FN-DSA，标准号 FIPS 206，目前仍在起草中）。这篇文章讲清它为什么这么小、又为什么这么难。

## 小体积从哪里来

Falcon 建在 **NTRU 格**上。签名过程本质上是：给定消息哈希出的目标点，用私钥（格的一组"好基"）在格上采样一个离目标足够近的短向量——这个采样必须服从**离散高斯分布**，否则采样结果的统计形状会泄露私钥基的信息。

高斯采样是 Falcon 的灵魂，也是它全部难度的来源：采样分布的方差、中心都要精确控制，采样器用的是递归的快速傅里叶域算法（Falcon 的招牌结构：一棵"Falcon 树"在 FFT 域里自上而下地采样）。做对了，签名又短又安全；做偏一点，就是私钥泄露。

## 浮点陷阱

Falcon 签名**要求双精度浮点运算**（IEEE 754 binary64）。这在服务器上是理所当然，在别处处处是坑：

- **没有 FPU 的微控制器**：软件模拟浮点慢且时序不恒定；
- **恒时性**：浮点运算的耗时在某些平台上与操作数相关，高斯采样的拒绝次数同样会泄露信息——恒时实现需要非常小心，审计难度远高于整数运算的 ML-DSA；
- **故障与舍入**：采样对数值误差敏感，不同平台的浮点行为差异可能影响正确性，需要逐平台验证。

因此 Falcon 的生态位从来不是"通用签名"，NIST 的定位也是互补：ML-DSA 做默认，Falcon 服务那些**体积就是生命线**的场景。

## 它补谁的位

- **DNSSEC**：响应报文有严格的尺寸传统，KB 级签名会引发分片与放大攻击面，Falcon 的尺寸最接近现状；
- **证书链**：本站《PKI 迁移》算过体积账——链上每一层都用 Falcon，握手包能瘦回一圈；
- **高频验签**：Falcon 验签极快（纯整数运算），适合"一次签名、百万次验证"的分发场景，如软件更新与广播认证。

FIPS 206 的时间表：NIST 预计在标准草案征求意见后正式发布（业界普遍预期 2026 年前后走完流程）。在那之前，工程上可以试点，但别把生产系统的合规叙事押在未定稿的标准上——这也是本站把它放在"研究"而非"标准解读"栏目的原因。

## 来源与延伸阅读

- Fouque et al., *Falcon: Fast-Fourier Lattice-based Compact Signatures over NTRU*（NIST PQC 提交文档）. https://falcon-sign.info/
- NIST, *Status Report on the Third Round of the NIST PQC Standardization Process* (NISTIR 8413) — 宣布 Falcon 将标准化为 FN-DSA.
- Prest, *High-Precision Arithmetic in Falcon*（实现难点讨论）, 2021.
