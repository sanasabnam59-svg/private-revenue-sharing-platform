import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";

export default function InspectorPage() {
  const circuits = [
    { name: "claimRevenue", params: "expectedRevenueId: Bytes<32>", returns: "Bytes<32>", privacy: "Anonymous ZK", desc: "Submits shareholder dividend claim commitment. Generates ZK proof locally using private witnesses (shareholder key, nonce, claim hash)." },
    { name: "resetRevenuePool", params: "newRevenueId: Bytes<32>", returns: "Bytes<32>", privacy: "Operator Admin", desc: "Updates the active revenue pool identifier on-chain. Resets distribution pool for new epoch." },
    { name: "incrementEpoch", params: "(none)", returns: "[]", privacy: "Operator Admin", desc: "Increments the activeEpoch payout session counter on the Midnight public ledger." },
  ];

  const witnesses = [
    { name: "shareholderSecretKey()", type: "Bytes<32>", desc: "Private shareholder identity key — kept strictly inside browser local witness state" },
    { name: "payoutNonce()", type: "Bytes<32>", desc: "Random entropy salt preventing hash collisions & dictionary attacks" },
    { name: "revenueClaimHash()", type: "Bytes<32>", desc: "SHA-256 hash of raw financial dividend claim entitlement" },
  ];

  const ledger = [
    { name: "distributionCount", type: "Counter", visibility: "Public Ledger" },
    { name: "platformRevenueId", type: "Bytes<32>", visibility: "Public Ledger" },
    { name: "lastPayoutCommitment", type: "Bytes<32>", visibility: "Public Ledger" },
    { name: "activeEpoch", type: "Counter", visibility: "Public Ledger" },
  ];

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-purple">Circuit Inspector</span>
          <span className="badge badge-amber">Compact v0.23</span>
        </div>
        <h1 className="section-title" style={{ fontSize: "1.85rem" }}>Smart Contract & ZK Circuit Inspector</h1>
        <p className="section-desc">Inspect the Private Revenue Sharing Platform Compact contract topology — exported circuits, ledger state, and ZK witness inputs.</p>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Contract Protocol", value: "Private Revenue Sharing" },
            { label: "Compiler Version", value: "Compact v0.23" },
            { label: "Target Network", value: "Midnight Preview" },
            { label: "Address", value: String(CONTRACT_ADDRESS).substring(0, 18) + "..." },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{label}</div>
              <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "monospace" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "0", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "1.05rem" }}>
          Exported Compact Circuits
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {circuits.map(c => (
            <div key={c.name} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.1rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <code style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--cyan-light)", fontSize: "0.95rem" }}>{c.name}({c.params})</code>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>-&gt; {c.returns}</span>
                <span className={`badge ${c.privacy.includes("Anonymous") ? "badge-green" : "badge-amber"}`} style={{ fontSize: "0.72rem", padding: "0.2rem 0.6rem" }}>
                  {c.privacy}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "0", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "1.05rem" }}>
          Private Zero-Knowledge Witness Inputs
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {witnesses.map(w => (
            <div key={w.name} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <code style={{ fontFamily: "monospace", fontSize: "0.88rem", color: "var(--purple-light)", flexShrink: 0, minWidth: 220 }}>{w.name}</code>
              <span style={{ fontSize: "0.75rem", color: "var(--cyan-light)", background: "rgba(6, 182, 212, 0.12)", padding: "0.15rem 0.55rem", borderRadius: 6, flexShrink: 0 }}>
                {w.type}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{w.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "0", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "1.05rem" }}>
          Public Ledger Schema Fields
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Field", "Type", "Visibility"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.5rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.map((row, i) => (
                <tr key={row.name} style={{ borderBottom: i < ledger.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "0.85rem 1.5rem", fontFamily: "monospace", color: "var(--cyan-light)" }}>{row.name}</td>
                  <td style={{ padding: "0.85rem 1.5rem", fontFamily: "monospace", color: "var(--text-primary)" }}>{row.type}</td>
                  <td style={{ padding: "0.85rem 1.5rem" }}>
                    <span className="badge badge-green" style={{ fontSize: "0.72rem", padding: "0.18rem 0.55rem" }}>{row.visibility}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: "0.88rem" }}>
          View Contract on Midnight Explorer ↗
        </a>
        <Link href="/" className="btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
}