---
title: "动手实验：OpenSSL 3.5 搭建 ML-KEM + ML-DSA 的本地 TLS"
description: "不需要任何实验库：用发行版自带的 OpenSSL 3.5 生成 ML-DSA 证书、启动本地 TLS 服务，并亲手验证混合密钥交换协商成功。"
pubDate: 2026-11-21
lang: zh
section: tutorials
tags: ["OpenSSL", "TLS", "ML-KEM", "ML-DSA", "实验"]
draft: false
featured: false
heroImage: "/images/tutorials/tls-lab.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "openssl-mlkem-tls-lab"
keyPoints:
  - "OpenSSL 3.5（2025-04）原生支持 ML-KEM、ML-DSA 与 SLH-DSA，且 TLS 1.3 默认启用 X25519MLKEM768 混合密钥交换——主流发行版升级后即可实验。"
  - "本实验三步：生成 ML-DSA-65 自签证书、用它启动 s_server、用 s_client 连接并核对协商组与证书算法。"
  - "核对清单：客户端输出中的 Negotiated TLS1.3 group 应为 X25519MLKEM768，证书的 Signature Algorithm 应为 ML-DSA-65。"
---

前两篇实验用 liboqs 摸清了算法本身。这一篇换到生产同款工具：**OpenSSL 3.5**。2025 年 4 月发布的 3.5 是 OpenSSL 的转折版本——ML-KEM、ML-DSA、SLH-DSA 全部原生内置，TLS 1.3 的默认组列表里直接带着混合组 `X25519MLKEM768`。也就是说，浏览器与 CDN 正在用的那套后量子 TLS，你可以在自己电脑上原样复现。

## 第 0 步：确认版本

```bash
openssl version
openssl list -kem-algorithms | grep -i ml-kem
openssl list -signature-algorithms | grep -i ml-dsa
```

版本需 ≥ 3.5。若发行版自带的是 3.0–3.4，先升级发行版或从包管理器装新版（不要自己编译进生产机，实验机随意）。

## 第 1 步：生成 ML-DSA 证书

```bash
openssl genpkey -algorithm ML-DSA-65 -out mldsa-key.pem
openssl req -new -x509 -key mldsa-key.pem -out mldsa-cert.pem -days 30 \
  -subj "/CN=localhost"
openssl x509 -in mldsa-cert.pem -noout -text | grep "Signature Algorithm"
```

最后一行应显示 `Signature Algorithm: ML-DSA-65`。顺便看一眼体积：`ls -l mldsa-cert.pem`——约 4–5 KB，对照本站《PKI 迁移》里的体积账，数字立刻有了体感。

## 第 2 步：启动服务并连接

终端 A 启动服务端（保持运行）：

```bash
openssl s_server -accept 4433 -key mldsa-key.pem -cert mldsa-cert.pem \
  -tls1_3 -www
```

终端 B 连接：

```bash
openssl s_client -connect localhost:4433 -groups X25519MLKEM768
```

## 第 3 步：核对协商结果

在 `s_client` 的输出里逐项核对：

- `Negotiated TLS1.3 group: X25519MLKEM768` —— 混合密钥交换协商成功，KEM 一半是 ML-KEM-768；
- 证书段的 `Signature Algorithm: ML-DSA-65` 与 `Public Key Algorithm: ML-DSA-65` —— 服务端用的是后量子证书；
- 协议为 `TLSv1.3`。

再做对照实验：把 `-groups` 换成 `X25519`，重连后协商组应变回纯经典——同一台服务、同一个客户端，仅仅一个参数，量子安全与否立判。这正是"密码敏捷"在命令行上的样子。

## 常见问题

- **`s_client` 报错 no suitable signature algorithm**：多半是 OpenSSL 版本低于 3.5，或系统策略（如某些发行版的 crypto-policies）禁用了新算法，先 `openssl version` 再查策略；
- **想测纯 ML-KEM 组**：把 `-groups` 换成 `MLKEM768` 即可（两端都是 3.5 时）；与浏览器互通则必须用混合组；
- **证书链体积**：可以再签一张中间 CA 证书叠上去，重复第 2 步，观察握手字节数（`-msg` 参数）的变化，把 PKI 体积账亲手量出来。

## 从实验到生产之间还差什么

本地自签证书验证的是**算法与协议的可用性**，不是生产部署：生产还需要公共 CA 签发的 ML-DSA 证书（生态尚在早期，见《PKI 迁移》）、客户端兼容性矩阵、以及性能压测。但顺序不要搞反：先在本机把这套握手跑通、把核对清单练熟，等生态到位时你缺的只是证书，不是认知。

## 来源与延伸阅读

- OpenSSL, *3.5 Release Notes*（ML-KEM/ML-DSA/SLH-DSA 支持与默认组变更）, 2025-04. https://openssl-library.org/news/openssl-3.5-notes/
- OpenSSL man pages: `s_server`, `s_client`, `genpkey`（3.5 版）.
- 本站：《混合密钥交换：TLS 如何先行一步进入后量子》《PKI 与数字证书的后量子迁移》
