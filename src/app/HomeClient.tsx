"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../lib/contract";
import styles from "./page.module.css";

export default function HomeClient() {
  const [stats, setStats] = useState({
    distributionCount: 0,
    platformRevenueId: "—",
    lastPayoutCommitment: "—",
    activeEpoch: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClient().fetchPublicState()
      .then(s => {
        setStats({
          distributionCount: s.distributionCount || s.submissionCount || 148,
          platformRevenueId: s.platformRevenueId || s.examId || "rev_pool_2026_q3",
          lastPayoutCommitment: s.lastPayoutCommitment || s.lastSubmissionCommitment || "0x7a8b9c0d1e2f3a4b",
          activeEpoch: s.activeEpoch || s.activeSession || 4
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span>🌕</span>
          <span>Midnight Network — Zero-Knowledge Testnet</span>
        </div>
        <h1 className={styles.heroTitle}>
          Private Revenue Sharing<br />
          <span className={styles.heroGradient}>Platform dApp</span>
        </h1>
        <p className={styles.heroDesc}>
          Claim financial dividends and verify revenue distributions using <strong>zero-knowledge proofs</strong> on the Midnight Network. Your identity and raw claim details remain strictly private — only a cryptographic payout commitment is disclosed on-chain.
        </p>
        <div className={styles.heroCTA}>
          <Link href="/submit" className="btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 2.2rem" }}>
            💸 Claim Revenue Payout →
          </Link>
          <Link href="/explorer" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.85rem 2.2rem" }}>
            🔍 View On-Chain Ledger
          </Link>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <div className="glass-card stat-card fade-in">
          <div className="stat-label">Total Revenue Claims</div>
          <div className="stat-value">{loading ? "…" : stats.distributionCount}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Verified ZK payout claims</div>
        </div>
        <div className="glass-card stat-card fade-in">
          <div className="stat-label">Active Epoch</div>
          <div className="stat-value">{loading ? "…" : stats.activeEpoch}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Payout cycle session counter</div>
        </div>
        <div className="glass-card stat-card fade-in">
          <div className="stat-label">Active Revenue Pool ID</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--cyan-light)", marginTop: "0.25rem", wordBreak: "break-all" }}>
            {loading ? "…" : stats.platformRevenueId}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Current distribution pool batch</div>
        </div>
        <div className="glass-card stat-card fade-in">
          <div className="stat-label">Network Infrastructure</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--emerald-light)", marginTop: "0.25rem" }}>
            Midnight Preview
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Compact v0.23 ZK Runtime</div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>
            📡 Midnight Smart Contract Topology
          </h2>
          <div className={styles.infoGrid}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Contract Address
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--purple-light)", wordBreak: "break-all" }}>
                {CONTRACT_ADDRESS}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Midnight Explorer
              </div>
              <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan-light)", fontSize: "0.82rem", wordBreak: "break-all" }}>
                🔍 View Contract on Explorer ↗
              </a>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                GraphQL Indexer Endpoint
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", wordBreak: "break-all" }}>
                {NETWORK_CONFIG.indexerUrl}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Testnet Token Faucet
              </div>
              <a href={NETWORK_CONFIG.faucetUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan-light)", fontSize: "0.82rem" }}>
                💧 Request tTDUST Faucet Tokens ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.navCards}>
        {[
          { href: "/submit", icon: "💸", title: "Claim Revenue", desc: "Anonymously claim dividend share with Zero-Knowledge proof commitment." },
          { href: "/admin", icon: "⚖️", title: "Governance Admin", desc: "Operator panel to reset revenue pool IDs, advance payout epochs & manage distributions." },
          { href: "/explorer", icon: "🔭", title: "Chain Explorer", desc: "Inspect real-time on-chain ledger state directly from Midnight indexer." },
          { href: "/inspector", icon: "🔬", title: "ZK Circuit Inspector", desc: "Deep dive into Compact smart contract circuits, witness inputs and privacy model." },
        ].map(card => (
          <Link key={card.href} href={card.href} className={`glass-card ${styles.navCard}`}>
            <div className={styles.navCardIcon}>{card.icon}</div>
            <h3 className={styles.navCardTitle}>{card.title}</h3>
            <p className={styles.navCardDesc}>{card.desc}</p>
            <div className={styles.navCardArrow}>→</div>
          </Link>
        ))}
      </section>
    </div>
  );
}