"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Link from "next/link";

export default function AdminPage() {
  const [revenueId, setRevenueId] = useState("rev_pool_2026_q4");
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingEpoch, setLoadingEpoch] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);
  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingReset(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog(`> [CIRCUIT] Executing resetRevenuePool("${revenueId}")...`, "info");
      const res = await getClient().resetRevenuePool(revenueId);
      setResult({ ...res, circuit: "resetRevenuePool" });
      addLog(`> [SUCCESS] Revenue Pool reset! New Pool ID: ${res.newRevenueId}`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingReset(false); }
  };

  const handleIncrement = async () => {
    setLoadingEpoch(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [CIRCUIT] Executing incrementEpoch()...", "info");
      const res = await getClient().incrementEpoch();
      setResult({ ...res, circuit: "incrementEpoch" });
      addLog(`> [SUCCESS] Payout epoch incremented! TxHash: ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingEpoch(false); }
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-amber">Platform Governance</span>
          <span className="badge badge-purple">Operator Only</span>
        </div>
        <h1 className="section-title" style={{ fontSize: "1.85rem" }}>Governance & Revenue Pool Control</h1>
        <p className="section-desc">Manage on-chain revenue pool identifiers, payout epochs, and dividend batch cycles via Midnight Lace Wallet.</p>
      </div>

      <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Reset Revenue Pool ID
        </h2>
        <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
          Updates the on-chain `platformRevenueId` ledger state to start a new distribution pool.
        </p>
        <form onSubmit={handleReset} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input type="text" id="newRevenueId" value={revenueId} onChange={e => setRevenueId(e.target.value)} placeholder="New Revenue Pool ID" style={{ flex: "1 1 280px" }} />
          <button type="submit" className="btn-primary" disabled={loadingReset} id="resetPoolBtn">
            {loadingReset ? <><span className="spinner" /> Executing Circuit...</> : "Reset Revenue Pool"}
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Advance Payout Epoch (+1)
        </h2>
        <p className="section-desc" style={{ marginBottom: "1.25rem" }}>
          Increments the on-chain `activeEpoch` payout session counter.
        </p>
        <button className="btn-primary" onClick={handleIncrement} disabled={loadingEpoch} id="incrementEpochBtn">
          {loadingEpoch ? <><span className="spinner" /> Executing Circuit...</> : "Advance Payout Epoch (+1)"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Operator Activity Log
          </div>
          <div className="log-box">{logs.map((l, i) => <div key={i} className={`log-${l.type}`}>{l.msg}</div>)}</div>
        </div>
      )}

      {result && (
        <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)" }}>
          <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            Governance Circuit Executed!
          </p>
          {[
            { label: "Circuit", value: result.circuit === "resetRevenuePool" ? "resetRevenuePool(Bytes<32>)" : "incrementEpoch()" },
            ...(result.newRevenueId ? [{ label: "New Pool ID", value: result.newRevenueId }] : []),
            { label: "On-Chain TxHash", value: result.txHash },
            { label: "Signed By", value: result.signedBy },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", minWidth: 140 }}>{label}:</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontFamily: "monospace", wordBreak: "break-all" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
}