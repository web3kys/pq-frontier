// Per-section explainer content: what each area is about, in three points.
// Used by SectionPage to render the animated explainer block under the banner.

export interface Explainer {
  accent: string;
  art: string;
  zh: { essence: string; points: string[] };
  en: { essence: string; points: string[] };
}

export const EXPLAINERS: Record<string, Explainer> = {
  pqc: {
    accent: '#38bdf8',
    art: 'lattice',
    zh: {
      essence: '造一把量子计算机也算不动的新锁。',
      points: [
        '新算法凭什么安全——格与哈希背后的数学难题',
        'NIST 标准怎么读——FIPS 203 / 204 / 205 逐条拆解',
        '算法之间怎么选——参数、性能与实现对比',
      ],
    },
    en: {
      essence: 'Building locks that even a quantum computer cannot pick.',
      points: [
        'Why the new algorithms are hard — the lattice and hash problems underneath',
        'How to read the NIST standards — FIPS 203 / 204 / 205, clause by clause',
        'How to choose — parameters, performance and implementation trade-offs',
      ],
    },
  },
  quantum: {
    accent: '#a78bfa',
    art: 'orbit',
    zh: {
      essence: '量子计算机为什么强，离实用还有多远。',
      points: [
        '量子比特、叠加与纠缠，到底是什么',
        'Shor、Grover 等算法如何威胁现有密码',
        '纠错与硬件路线，离“够大够稳”还差什么',
      ],
    },
    en: {
      essence: 'Why quantum computers are powerful — and how far they still have to go.',
      points: [
        'What qubits, superposition and entanglement actually are',
        'How Shor, Grover and friends threaten today\u2019s cryptography',
        'What error correction and hardware still owe us before “large and stable”',
      ],
    },
  },
  security: {
    accent: '#2dd4bf',
    art: 'shield',
    zh: {
      essence: '锁造出来之后，怎么用对、用稳。',
      points: [
        '加密、签名、认证，各自解决什么问题',
        '密钥从生成到销毁的全生命周期管理',
        '真实系统的安全边界与常见误区',
      ],
    },
    en: {
      essence: 'Once the locks exist — using them correctly, and keeping them sound.',
      points: [
        'Encryption, signatures, authentication — which problem each one solves',
        'Key management across the whole lifecycle, generation to destruction',
        'Real-world security boundaries and the misconceptions that break them',
      ],
    },
  },
  migration: {
    accent: '#f0b35e',
    art: 'roadmap',
    zh: {
      essence: '把全世界的锁换一遍，还不能停业。',
      points: [
        '先盘点：哪些系统还在用 RSA / ECC',
        '再评估：数据要保密多久，风险有多高',
        '后实施：混合部署、试点验证与回滚路线',
      ],
    },
    en: {
      essence: 'Replacing every lock in the world — without closing for business.',
      points: [
        'Inventory first: which systems still rely on RSA / ECC',
        'Then assess: how long must the data stay secret, how high is the risk',
        'Then execute: hybrid deployment, pilots and a rollback path',
      ],
    },
  },
  research: {
    accent: '#818cf8',
    art: 'constellation',
    zh: {
      essence: '不止于读懂——拆开、比较、算账。',
      points: [
        '论文解读：把学术结果翻译成工程语言',
        '技术对比：同一问题的不同路线孰优孰劣',
        '资源估算：破解 RSA 到底需要多少量子比特',
      ],
    },
    en: {
      essence: 'Beyond reading — taking things apart, comparing, doing the math.',
      points: [
        'Paper reading: academic results translated into engineering language',
        'Technology comparison: rival routes to the same problem, weighed',
        'Resource estimates: how many qubits breaking RSA would really take',
      ],
    },
  },
  tutorials: {
    accent: '#34d399',
    art: 'terminal',
    zh: {
      essence: '能跑起来的，才算学会。',
      points: [
        '从零实验：用 liboqs 等开源工具亲手跑通',
        '每一步都有可验证的输出，不跳步',
        '踩坑记录：报错、原因与修法全部公开',
      ],
    },
    en: {
      essence: 'If it runs, you have learned it.',
      points: [
        'Experiments from zero, with open-source tools like liboqs',
        'Every step has verifiable output — nothing skipped',
        'Pitfall logs: the errors, the causes and the fixes, all in the open',
      ],
    },
  },
};
