---
title: "动手实验：用 liboqs 跑通你的第一次 ML-KEM 密钥封装"
description: "在本地环境用 Open Quantum Safe 的 Python 绑定完成 ML-KEM-768 的密钥生成、封装与解封装，并验证双方得到的共享秘密完全一致。"
pubDate: 2026-11-20
lang: zh
section: tutorials
tags: ["liboqs", "ML-KEM", "Python", "实验"]
heroImage: "/images/tutorials/liboqs.jpg"
imageCredit: "本站 AI 生成配图"
draft: false
translationKey: "liboqs-ml-kem-lab"
keyPoints:
  - "liboqs 的 oqs.KEM 接口用数行代码即可完成 ML-KEM 密钥交换全流程。"
  - "实验要点：核对三档参数的公钥与密文尺寸，并验证篡改密文后解封装给出不同秘密（隐式拒绝）。"
  - "liboqs 是研究与原型库，生产环境请使用受维护的实现。"
---

## 实验目标

读完 [《ML-KEM 入门》](../pqc/ml-kem-fips-203/) 里的 KeyGen / Encaps / Decaps 三个算法之后，最好的理解方式是亲手跑一遍。本教程用 Open Quantum Safe（OQS）项目的 Python 绑定 `liboqs-python`，在本地完成一次完整的 ML-KEM-768 密钥封装，并验证通信双方得到的共享秘密逐字节一致。

> 说明：OQS 是面向研究与原型验证的实验性项目，官方明确提示不要直接用于生产环境。本教程的目的同样是学习与验证概念。

## 准备环境

需要 Python 3.10 或更高版本。`liboqs-python` 依赖底层的 liboqs C 库，安装方式随操作系统而异（源码构建、包管理器或官方 Docker 镜像），请以 liboqs-python 仓库 README 的最新说明为准。Python 包本身的安装是：

```bash
pip install liboqs-python
```

装好后先确认 ML-KEM 可用：

```python
import oqs

print("ML-KEM-768 是否启用:", "ML-KEM-768" in oqs.get_enabled_kem_mechanisms())
```

## 完整实验代码

```python
import oqs

ALG = "ML-KEM-768"

# 1) 接收方：生成密钥对（KeyGen）
with oqs.KeyEncapsulation(ALG) as decapsulator:
    public_key = decapsulator.generate_keypair()
    print("封装公钥长度:", len(public_key), "字节")   # 应为 1184

    # 2) 发送方：用公钥封装出密文与共享秘密（Encaps）
    with oqs.KeyEncapsulation(ALG) as encapsulator:
        ciphertext, shared_secret_enc = encapsulator.encap_secret(public_key)
    print("密文长度:", len(ciphertext), "字节")       # 应为 1088

    # 3) 接收方：用私钥解封装，恢复共享秘密（Decaps）
    shared_secret_dec = decapsulator.decap_secret(ciphertext)

# 4) 验证：双方的共享秘密必须完全一致
assert shared_secret_enc == shared_secret_dec, "共享秘密不一致！"
print("验证通过：双方共享秘密一致，长度", len(shared_secret_enc), "字节")
```

运行后你会看到公钥 1184 字节、密文 1088 字节、共享秘密 32 字节——与 FIPS 203 中 ML-KEM-768 的参数表完全对上。建议把 `ALG` 换成 `ML-KEM-512` 和 `ML-KEM-1024` 各跑一次，对照三个参数集的尺寸差异。

## 三个容易踩的坑

1. **封装用的公钥必须来自同一次 KeyGen。** 用旧公钥封装、新私钥解封装，得到的秘密不一致，而且解封装不会报错——它只会安静地给出一个错误的结果（这正是隐式拒绝的设计）。真实系统里必须靠后续的密钥确认步骤发现这类错误。
2. **共享秘密不是会话密钥本身。** 工程实践中应把它输入 KDF（如 HKDF）再派生会话密钥，不要直接当 AES 密钥使用。
3. **随机源质量决定一切。** 实验环境无所谓，但在任何严肃场景里，KeyGen 与 Encaps 的随机性必须来自操作系统密码学随机源。

## 下一步

- 把实验改成混合模式：同时做一次 X25519 交换和一次 ML-KEM 封装，把两个秘密一起输入 KDF——这正是今天 TLS 1.3 在做的事情。
- 阅读 FIPS 203 原文第 7 章，对照本实验理解每个算法的输入输出。

## 参考资料

1. Open Quantum Safe 项目主页. https://openquantumsafe.org
2. liboqs-python 仓库（安装说明与 API）. https://github.com/open-quantum-safe/liboqs-python
3. NIST, *FIPS 203*, 2024-08-13. https://doi.org/10.6028/NIST.FIPS.203
