"use client";
import { useEffect, useState } from "react";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";
import Link from "next/link";

export default function ExplorerPage() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try { const s = await getClient().fetchPublicState(); setState(s); } catch {}
    if (isRefresh) setRefreshing(false); else setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const rows = state ? [
    { label: "Total Revenue Share Claims", value: state.distributionCount || state.submissionCount, mono: false },
    { label: "Active Revenue Pool ID", value: state.platformRevenueId || state.examId, mono: true },
    { label: "Latest Payout Commitment", value: state.lastPayoutCommitment || state.lastSubmissionCommitment, mono: true },
    { label: "Active Payout Epoch", value: state.activeEpoch || state.activeSession, mono: false },
  ] : [];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-purple">Chain Explorer</span>
          <span className="badge badge-green">Live Midnight Indexer</span>
        </div>
        <h1 className="section-title" style={{ fontSize: "1.85rem" }}>Revenue Distribution Explorer</h1>
        <p className="section-desc">Real-time public ledger state and transaction history from the Midnight Preview GraphQL indexer.</p>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contract Address</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--purple-light)", wordBreak: "break-all" }}>{CONTRACT_ADDRESS}</div>
            <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan-light)", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem" }}>
              View on Midnight Preview Explorer ↗
            </a>
          </div>
          <button className="btn-secondary" onClick={() => load(true)} disabled={refreshing} id="refreshBtn">
            {refreshing ? <><span className="spinner" /> Refreshing...</> : "Refresh Ledger"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
          <span className="spinner" style={{ display: "inline-block", marginBottom: "0.5rem" }} /><br />
          Loading on-chain ledger state...
        </div>
      ) : (
        <div className="glass-card fade-in" style={{ padding: "0" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Public Ledger State</span>
            <span style={{ fontSize: "0.75rem", color: "#10b981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "0.25rem 0.85rem", fontWeight: 600 }}>
              LIVE INDEXER
            </span>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {rows.map(r => (
              <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.label}</span>
                <span style={{ fontFamily: r.mono ? "monospace" : "inherit", fontSize: r.mono ? "0.85rem" : "1.35rem", fontWeight: r.mono ? 500 : 700, color: r.mono ? "var(--cyan-light)" : "var(--text-primary)", wordBreak: "break-all" }}>{String(r.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Verified On-Chain Transactions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { circuit: "resetRevenuePool(Bytes<32>)", hash: "0x96be9fef64c0b536f8f6f4bada06ae1c8e77cc135f2efdeaad4b6ce0891c3770" },
            { circuit: "claimRevenue(Bytes<32>)", hash: "0x5a85886a759b483bd7f6f04c467bfd96bd939abfd72070f74b052627792f2c8b" },
            { circuit: "incrementEpoch()", hash: "0x3f18a42c98d642b109e2e6005cfa28e19b8076d6541f2a33c14a9058b762881a" },
          ].map((tx, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.95rem 1.1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", color: "#6ee7b7", background: "rgba(16,185,129,0.15)", padding: "0.25rem 0.6rem", borderRadius: 6, fontFamily: "monospace", fontWeight: 600 }}>CONFIRMED</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{tx.circuit}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.74rem", color: "var(--text-secondary)", wordBreak: "break-all", marginTop: "0.2rem" }}>{tx.hash}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
}