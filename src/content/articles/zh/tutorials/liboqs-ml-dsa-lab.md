---
title: "动手实验：用 liboqs 生成你的第一个 ML-DSA 签名"
description: "在上一篇搭好的 liboqs 环境里完成 ML-DSA 签名全流程：密钥生成、签名、验签、篡改失败验证，并对比三档参数的尺寸。"
pubDate: 2026-11-21
lang: zh
section: tutorials
tags: ["liboqs", "ML-DSA", "Python", "实验"]
draft: false
featured: false
heroImage: "/images/tutorials/liboqs.jpg"
imageCredit: "本站 AI 生成配图"
translationKey: "liboqs-ml-dsa-lab"
keyPoints:
  - "liboqs 的 oqs.Signature 接口三行完成 ML-DSA 的生成密钥、签名、验签；算法名是 ML-DSA-44/65/87。"
  - "实验要点：亲手验证篡改消息后验签必然失败，并打印三档参数的公钥/签名尺寸与 FIPS 204 对照。"
  - "liboqs 是研究与原型库，官方明确不建议未经审计直接用于生产——生产请用 OpenSSL 3.5 等受维护实现。"
---

上一篇《用 liboqs 跑通第一个 ML-KEM 密钥交换》搭好了环境，这一篇用同一套 liboqs-python 完成数字签名的全流程。目标：生成 ML-DSA 密钥、签一条消息、验签、再亲手把消息改一个字节，确认验签失败——签名方案的全部意义，就在最后这一步里。

## 准备

沿用上一篇的环境（已安装 liboqs 与 oqs 绑定）。先确认 ML-DSA 在你的构建里可用：

```bash
python3 -c "import oqs; print([a for a in oqs.get_enabled_sig_mechanisms() if 'ML-DSA' in a])"
```

应输出 `['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87', ...]`（还可能有带 IPD 后缀的草案版本，本实验只用无后缀的 FIPS 204 最终版）。

## 完整脚本

```python
import oqs

message = b"PQ Frontier lab: my first post-quantum signature"

for alg in ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"]:
    with oqs.Signature(alg) as signer, oqs.Signature(alg) as verifier:
        public_key = signer.generate_keypair()
        secret_key = signer.export_secret_key()
        signature = signer.sign(message)

        ok = verifier.verify(message, signature, public_key)
        tampered = verifier.verify(message + b"!", signature, public_key)

        print(f"{alg}: pk={len(public_key)}B sk={len(secret_key)}B "
              f"sig={len(signature)}B verify={ok} tampered={tampered}")
        assert ok and not tampered

print("ALL OK")
```

预期输出（尺寸与 FIPS 204 表格逐项对应）：

```text
ML-DSA-44: pk=1312B sk=2560B sig=2420B verify=True tampered=False
ML-DSA-65: pk=1952B sk=4032B sig=3309B verify=True tampered=False
ML-DSA-87: pk=2592B sk=4896B sig=4627B verify=True tampered=False
ALL OK
```

## 读懂这段代码

- `generate_keypair()` 在对象内部生成密钥对并返回公钥；`export_secret_key()` 把私钥以字节导出——真实系统里私钥应留在 HSM 或受保护存储中，这个导出动作只属于实验；
- `sign()` 默认使用 FIPS 204 的对冲（hedged）随机化签名：同一消息签两次，签名不同，但都验得过。可以自己验证：对同一消息签两次并比较字节；
- `verify()` 对篡改的敏感性来自哈希绑定：消息变一个字节，Fiat–Shamir 挑战就完全不同，签名随之失效——实验里 `message + b"!"` 的验签结果必须为 False，若为 True，说明库或用法出了严重问题，立即停下排查；
- 尺寸数字请与本站《ML-DSA 入门》中的参数表对照——实验的价值一半在流程，另一半在把"2,420 字节"从表格变成自己屏幕上的输出。

## 常见问题

- **`oqs.Signature` 抛机制不可用**：liboqs 构建时未启用该算法，重新按上一篇的 CMake 参数构建，或改用发行版的新版本；
- **想试 Falcon**：把算法名换成 `Falcon-512` 即可（部分构建需单独启用）；注意 Falcon 的签名长度是可变的，打印出来约 666 字节上下浮动，属正常现象；
- **性能对比**：可以用 `timeit` 给三档参数各跑 100 次签名/验签，感受一下 ML-DSA 的量级（桌面 CPU 上签名与验签都在亚毫秒到毫秒级）。

## 下一步

签名解决了"谁发的"，还差"在真实协议里跑起来"：下一篇《OpenSSL 3.5 实战》用系统级的 OpenSSL 搭建带 ML-KEM 混合密钥交换与 ML-DSA 证书的本地 TLS，把 KEM 与签名在同一个握手里合拢。

> 安全提示重申：liboqs 官方定位是研究与原型验证库。本实验的密钥管理方式（明文字节导出）严禁照搬到任何真实系统。

## 来源与延伸阅读

- Open Quantum Safe, *liboqs-python* 文档与示例. https://github.com/open-quantum-safe/liboqs-python
- NIST, *FIPS 204*（参数与尺寸表）, 2024.
- 本站：《用 liboqs 跑通第一个 ML-KEM 密钥交换》《ML-DSA 入门》
