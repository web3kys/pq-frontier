---
title: "PKI 与数字证书的后量子迁移：体积、链与自动化"
description: "证书是后量子迁移里最先撞墙的系统之一：算一算 ML-DSA 证书链的体积账，看懂复合证书与混合证书的过渡路线，以及 CA 生态的时间表。"
pubDate: 2026-11-21
lang: zh
section: security
tags: ["PKI", "X.509", "证书", "ML-DSA"]
draft: false
featured: false
heroImage: "/images/security/security.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "pki-certificates-pqc"
keyPoints:
  - "换上 ML-DSA 后，一张终端证书从约 1 KB 膨胀到 4–8 KB，整条链 10 KB 以上——TLS 握手、CT 日志、OCSP 都会被这笔体积账波及。"
  - "过渡路线有两条：同一证书内双算法的复合证书（IETF LAMPS 推进中），与签发两张证书的双证书部署；两者解决的问题不同。"
  - "CA/B 论坛与根程序尚无强制时间表，但自动化签发（ACME）与短周期证书让 PKI 成为全站迁移里最适合先行的部分。"
---

公钥基础设施（PKI）是互联网信任的底座，也是后量子迁移里结构最复杂的一环：它不只是一个算法替换，而是 CA、浏览器根程序、CT 日志、HSM、证书生命周期管理共同参与的系统工程。好消息是，它也最经得起分阶段迁移。

## 先算体积账

一张典型的 ECDSA P-256 终端证书约 1 KB。换成 ML-DSA-65：公钥 1,952 字节、签名 3,309 字节——单张证书约 6 KB；再加中间 CA 一层（它自己的公钥加它被根签的签名），整条链轻松超过 12 KB。影响是连锁的：

- **TLS 握手**：证书链在第一个往返里传输，超过拥塞窗口就要多等一个 RTT，弱网下握手延迟可感；
- **CT 日志**：全网每张证书都要进日志，条目体积翻几倍，日志运营方的存储与镜像成本同步放大；
- **OCSP 与 CRL**：响应与吊销条目同样携带签名，体积问题无处不在；
- **受限设备**：智能卡、嵌入式、二维码承载证书的场景可能直接装不下——这类场景要考虑 FN-DSA（签名约 0.7 KB）或哈希签名等替代路线。

结论不是"不能迁"，而是**迁移必须带着体积预算做**：选 ML-DSA-44 而非 87、用证书压缩、缩短链深，每一项都是真金白银的延迟与带宽。

## 两条过渡路线

**复合证书（composite）**：一张 X.509 证书里同时放传统算法与 PQC 算法的公钥与签名，验证方按策略要求"两个签名都验"或"任一即可"。IETF LAMPS 工作组正在标准化复合 ML-DSA、复合 ML-KEM 等草案。优点是一张证书走天下、回滚干净；缺点是标准未定稿、实现支持还在早期。

**双证书（dual certificate）**：同一域名签两张证书（一张传统、一张 PQC），服务端按客户端能力协商选送。优点是今天就能用现成标准部署；缺点是运维翻倍、协商逻辑复杂。

实务上还有第三条路在 TLS 层已经跑通：**密钥交换先行**。TLS 1.3 的混合密钥交换（X25519+ML-KEM）不需要动证书就能挡住"先存后破"，Chrome 与主流 CDN 已经默认开启（见本站《混合密钥交换》）。证书签名迁移的紧迫性低于密钥交换——证书是"签发时"的信任，攻击者没法把今天的握手录下来等明天再伪造。所以顺序应该是：先混密钥交换，再迁证书签名。

## 生态时间表

- **根程序**：Mozilla、Chrome、Apple 的根程序都在评估 PQC 根证书的纳入，实验性 PQC 证书已在公开日志中出现；
- **CA**：主流公共 CA 已开始提供 ML-DSA 证书的实验签发；企业私有 CA 的动作取决于 HSM 厂商对 ML-DSA 的支持进度（主流 HSM 已在新固件中加入）；
- **自动化**：ACME 协议本身算法无关，Let's Encrypt 式的短周期自动化让"换算法"从年度工程变成一次配置变更——这是 PKI 迁移最被低估的顺风。

给证书体系负责人的建议清单：盘点全部证书与签发路径（与 CBOM 合并做，见迁移栏目）；确认 HSM 与 CA 软件的 PQC 路线图；先在内网 PKI 试点 ML-DSA-44；把证书体积纳入性能预算。证书迁移不需要等标准全部落定才开始——盘点与试点今天就能做。

## 来源与延伸阅读

- IETF LAMPS, *Composite ML-DSA for use in X.509 Public Key Infrastructure*（draft-ietf-lamps-dilithium-certificates 等）, 2024–2025. https://datatracker.ietf.org/wg/lamps/
- NIST, *FIPS 204*（ML-DSA 参数与体积）, 2024.
- Google Chrome, *Post-quantum cryptography in Chrome*（混合密钥交换部署）, 2024. https://security.googleblog.com/
