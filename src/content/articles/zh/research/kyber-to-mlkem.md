---
title: "从 Kyber 到 ML-KEM：标准化到底改了什么"
description: "ML-KEM 不是 Kyber 的改名：密钥派生绑定密文、域分离、输入校验——逐条盘点 FIPS 203 与 Kyber 规范的差异，以及为什么两者不互通。"
pubDate: 2026-11-21
lang: zh
section: research
tags: ["Kyber", "ML-KEM", "FIPS 203", "标准化"]
draft: false
featured: false
heroImage: "/images/research/research.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "kyber-to-mlkem"
keyPoints:
  - "ML-KEM 与 Kyber 共享数学内核（Module-LWE、CBD 噪声、NTT），但 FIPS 203 在 KDF 输入、域分离与校验上做了多处修改，两者产生的密文互不兼容。"
  - "最关键的一改：共享秘密的派生绑定了密文哈希，使密文与会话密钥一一对应，堵住重封装类攻击的分析缝隙。"
  - "工程含义：标注为 Kyber 的旧实现不能直接当 ML-KEM 用；TLS 的 X25519MLKEM768 用的是 FIPS 203 最终版，早期草案版本（Kyber768Draft00）只应出现在历史流量里。"
---

"我已经在用 Kyber 了，是不是改个名字就是 ML-KEM？"——这是迁移咨询里最高频的误解之一。答案是否定的：FIPS 203 在标准化过程中对 Kyber 做了若干处看似微小、实则决定兼容性的修改。用 Kyber 规范实现的系统，与 ML-KEM 系统之间连一次密钥交换都完不成。

## 没变的部分

数学内核原封不动：Module-LWE 假设、多项式环 $R_q = \mathbb{Z}_q[X]/(X^{256}+1)$、$q = 3329$、中心二项分布噪声、NTT 加速、参数三件套（512/768/1024 的 $k = 2/3/4$）都与 Kyber 第三轮规范一致。安全性分析、性能特征、侧信道注意事项也基本平移。改动全部发生在"封装层"。

## 改了的部分

**1. 共享秘密的派生方式。** Kyber 的 KEM 封装里，共享秘密由 $\bar{K} = \mathrm{KDF}(r, H(pk))$ 一路派生（解封装失败时用私钥派生的 $z$ 做隐式拒绝）。FIPS 203 改为把**密文哈希**绑进派生：$K = \mathrm{KDF}(K', H(c))$，其中 $K'$ 是解出的候选秘密。效果是共享秘密与具体密文一一绑定——任何对密文的篡改都会改变会话密钥，分析上堵住了重封装（re-encapsulation）类攻击的缝隙，证明也更干净。

**2. 域分离与标签。** FIPS 203 在多处哈希调用中加入了明确的域分离（例如对不同用途的输入做区分），并把 KEM 内部的随机数生成、密钥生成的输入格式按 FIPS 风格重新规整。字节级结果是：同一密钥、同一种子，两套规范算出的中间值就开始分叉。

**3. 输入校验（FIPS 化）。** FIPS 203 强制解封装前的密文格式校验、密钥生成时的一致性自检（pairwise consistency check 思路），并规定了随机数必须来自批准的 DRBG 等合规要求。这些不改变数学，但改变了"合格实现"的边界——也是 FIPS 140-3 验证能挂钩的前提。

**4. 命名与接口。** Kyber512/768/1024 → ML-KEM-512/768/1024；API 语义向 FIPS 惯例靠拢（如密钥生成输出的表示、随机数的供给方式）。

## 工程含义

- **盘点时要区分版本**：资产清单里写"Kyber"的，要追问是第三轮规范、FIPS 203 草案还是最终版——三者互不兼容（CBOM 的算法字段应记到这个粒度）；
- **TLS 流量里的历史包袱**：Chrome/Firefox 早期部署过 `X25519Kyber768Draft00`，已被 `X25519MLKEM768`（最终版）取代；抓包分析时看到前者说明对端版本很旧；
- **库的选择**：liboqs、OpenSSL 3.5、BoringSSL、RustCrypto 的 ml-kem 等实现都以 FIPS 203 最终版为准；任何停留在 Kyber 规范的库都应视为待升级项；
- **互操作测试不可省**：跨厂商 ML-KEM 互通要过 NIST ACVP 测试向量——"都是格密码"不构成互通的证据。

标准化不是改名，而是把学术方案锻造成可验证、可采购、可互通的工程对象。Kyber → ML-KEM 的这几处修改，正是这个锻造过程最典型的样本。

## 来源与延伸阅读

- NIST, *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
- Avanzi et al., *CRYSTALS-Kyber Algorithm Specifications and Supporting Documentation* (v3.02), 2021. https://pq-crystals.org/kyber/
- IETF, *Hybrid key exchange in TLS 1.3*（draft-ietf-tls-ecdhe-mlkem）— X25519MLKEM768 的定义与 Draft00 的更替说明.
