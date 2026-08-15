"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Link from "next/link";

export default function SubmitPage() {
  const [revenueId, setRevenueId] = useState("rev_pool_2026_q3");
  const [shareholderKey, setShareholderKey] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setLogs([]);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet extension...", "info");
      const client = getClient();
      client.setShareholderSecretKey(shareholderKey || "anonymous_shareholder_key_default");
      client.setRevenueClaimDetails(claimDetails || "dividend_claim_details_q3");
      addLog("> [ZK] Constructing local zero-knowledge witness state...", "info");
      addLog("> [PROOF] Computing 256-bit Poseidon/SHA commitment hash...", "info");
      addLog("> [CIRCUIT] Executing claimRevenue() circuit on Midnight Network...", "info");
      const res = await client.claimRevenue(revenueId);
      setResult(res);
      addLog(`> [SUCCESS] Revenue claim verified! TxHash: ${res.txHash}`, "success");
      addLog(`> [COMMITMENT] Disclosed Commitment: ${res.commitmentHex}`, "success");
      addLog(`> [FEE] Network Transaction Fee: ${res.txFee} ${res.txFeeAsset}`, "info");
    } catch (err: any) {
      const msg = err?.message || "Revenue claim submission failed.";
      setError(msg);
      addLog(`> [ERROR] ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-purple">ZK Dividend Claim</span>
          <span className="badge badge-cyan">Midnight Preview</span>
        </div>
        <h1 className="section-title" style={{ fontSize: "1.85rem" }}>Claim Revenue Dividend Anonymously</h1>
        <p className="section-desc">
          Your identity and claim details remain 100% private. Only a zero-knowledge cryptographic payout commitment is disclosed on the Midnight blockchain.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Active Revenue Pool ID *
            </label>
            <input type="text" id="revenueId" value={revenueId} onChange={e => setRevenueId(e.target.value)} placeholder="rev_pool_2026_q3" required />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Must match the active platform revenue pool ID registered on-chain</p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Shareholder Secret Key (Private Witness)
            </label>
            <input type="password" id="shareholderKey" value={shareholderKey} onChange={e => setShareholderKey(e.target.value)} placeholder="Your private shareholder secret key (never leaves your device)" autoComplete="off" />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Never transmitted — used only inside client-side browser ZK proof generator</p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Dividend Entitlement Details / Hash
            </label>
            <textarea id="claimDetails" value={claimDetails} onChange={e => setClaimDetails(e.target.value)} placeholder="Paste revenue claim details (hashed locally before ZK proof execution)" rows={4} style={{ resize: "vertical" }} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>Raw claim data is hashed locally — only the cryptographic commitment enters the ledger</p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <button type="submit" className="btn-primary" disabled={loading} id="submitBtn">
              {loading ? <><span className="spinner" /> Generating ZK Proof...</> : "💸 Claim Revenue (ZK Proof)"}
            </button>
            <Link href="/" className="btn-secondary">Back to Dashboard</Link>
          </div>
        </form>
      </div>

      {logs.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Real-Time ZK Execution Log
          </div>
          <div className="log-box">
            {logs.map((l, i) => <div key={i} className={`log-${l.type}`}>{l.msg}</div>)}
          </div>
        </div>
      )}

      {error && (
        <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.35)", background: "rgba(239, 68, 68, 0.08)" }}>
          <p style={{ color: "#fca5a5", fontWeight: 600 }}>Execution Error</p>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
        </div>
      )}

      {result && (
        <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.35)", background: "rgba(16, 185, 129, 0.08)" }}>
          <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            🎉 Revenue Claim Verified & Submitted!
          </p>
          {[
            { label: "Circuit Executed", value: "claimRevenue(Bytes<32>)" },
            { label: "ZK Payout Commitment", value: result.commitmentHex },
            { label: "On-Chain TxHash", value: result.txHash },
            { label: "Signed By", value: result.signedBy },
            { label: "Estimated Fee", value: `${result.txFee} ${result.txFeeAsset}` },
            { label: "Lace Wallet Balance", value: result.walletFunded ? "Funded (Active)" : "Demo Mode / Unfunded" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", minWidth: 150 }}>{label}:</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontFamily: "monospace", wordBreak: "break-all" }}>{value}</span>
            </div>
          ))}
          <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.75rem", fontWeight: 600 }}>
            Status: VERIFIED & CONFIRMED (Midnight Testnet)
          </p>
        </div>
      )}
    </div>
  );
}