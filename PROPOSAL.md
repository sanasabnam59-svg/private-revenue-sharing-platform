# Project Proposal: Private Revenue Sharing Platform (PRSP)

> **Zero-Knowledge Dividend & Profit Distribution Protocol on Midnight Network**

[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preview-8b5cf6?style=flat-square)](https://explorer.preview.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23-06b6d4?style=flat-square)](https://midnight.network)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 📌 Executive Summary

**Private Revenue Sharing Platform (PRSP)** is a privacy-preserving dApp engineered on the **Midnight Network** utilizing **Compact zero-knowledge (ZK) smart contracts**. PRSP solves a fundamental flaw in traditional corporate revenue distribution and Web3 profit sharing: **identity tracking, transactional exposure, and financial data leakage**.

By enabling shareholders to generate zero-knowledge cryptographic proofs locally on their device, beneficiaries claim their entitled revenue share and dividend payouts without exposing their personal wallet identity, shareholder key, or claim details on-chain. The contract registers a verified **commitment hash** on-chain, guaranteeing tamper-proof revenue accounting while ensuring complete financial anonymity.

---

## 🎯 Problem Statement & Solution

### The Problem
1. **Financial Identity Exposure**: Public blockchain payout distributions reveal exact wallet balances, beneficiary identities, and recurring financial transfers to on-chain observers.
2. **Competitive Intelligence Leakage**: Corporate partners and investors risk revealing confidential business share ratios when claiming distributions on transparent ledgers.
3. **Front-Running & Targeted Exploits**: High-value dividend claims on public ledgers attract phishing attacks, targeted exploits, and front-running bots.

### The Midnight ZK Solution
PRSP utilizes Midnight’s dual-state (private witness vs. public ledger) architecture:
- **Client-Side Proof Generation**: The shareholder's secret key (`shareholderSecretKey`), entropy nonce (`payoutNonce`), and raw claim hash (`revenueClaimHash`) remain strictly inside the user's browser.
- **On-Chain Public Verification**: The Midnight Compact smart contract receives a zero-knowledge proof of a `persistentHash` commitment. Platform operators verify that a claim was submitted for a specific `expectedRevenueId` without learning who claimed it.

---

## 🏗️ Technical Architecture & Compact Contract Design

### Smart Contract Specification (`contracts/counter.compact`)

```compact
pragma language_version 0.23;
import CompactStandardLibrary;

export ledger distributionCount: Counter;
export ledger platformRevenueId: Bytes<32>;
export ledger lastPayoutCommitment: Bytes<32>;
export ledger activeEpoch: Counter;

witness shareholderSecretKey(): Bytes<32>;
witness payoutNonce(): Bytes<32>;
witness revenueClaimHash(): Bytes<32>;

export circuit claimRevenue(expectedRevenueId: Bytes<32>): Bytes<32> {
  assert(platformRevenueId == expectedRevenueId, "Invalid revenue pool ID provided for claim");

  const shareholderKey = shareholderSecretKey();
  const nonce = payoutNonce();
  const claimHash = revenueClaimHash();

  const payoutCommitment = persistentHash<Vector<4, Bytes<32>>>([
    pad(32, "prsp:revenue:share:payout:v1"),
    shareholderKey,
    nonce,
    claimHash
  ]);

  distributionCount.increment(1);
  const disclosedCommitment = disclose(payoutCommitment);
  lastPayoutCommitment = disclosedCommitment;
  return disclosedCommitment;
}

export circuit resetRevenuePool(newRevenueId: Bytes<32>): Bytes<32> {
  platformRevenueId = disclose(newRevenueId);
  activeEpoch.increment(1);
  return platformRevenueId;
}

export circuit incrementEpoch(): [] {
  activeEpoch.increment(1);
}
```

---

## 🛡️ Midnight Privacy & Verification Matrix

| Component | State Type | Visibility | Purpose |
|---|---|---|---|
| `shareholderSecretKey` | Private Witness | Browser Only | Shareholder identity secret used for ZK witness computation |
| `payoutNonce` | Private Witness | Browser Only | Random salt to prevent hash dictionary attacks |
| `revenueClaimHash` | Private Witness | Browser Only | Hash of financial claim and entitlement details |
| `distributionCount` | Public Ledger | On-Chain Public | Total verified anonymous claims for current revenue pool |
| `platformRevenueId` | Public Ledger | On-Chain Public | Active revenue pool or distribution cycle identifier |
| `lastPayoutCommitment` | Public Ledger | On-Chain Public | Disclosed 256-bit ZK commitment hash verifying claim validity |
| `activeEpoch` | Public Ledger | On-Chain Public | Payout epoch session counter incremented on pool resets |

---

## 🌐 Deployed Smart Contract & Infrastructure

- **Target Network**: Midnight Preview Testnet
- **Contract Address**: `0x22eb0274974168da7f6d7552bb583dadb74a006abdfc11ec8e074e861ef02c6b`
- **Proof Server Endpoint**: `http://localhost:6300`
- **Indexer Endpoint**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Frontend Architecture**: Next.js 16 Web3 dApp with React 18, TypeScript, custom glassmorphism design system, and Midnight Lace Wallet DApp Connector integration.
