"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./NavBar.module.css";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/submit", label: "Claim Revenue" },
  { href: "/admin", label: "Admin Panel" },
  { href: "/explorer", label: "Explorer" },
  { href: "/inspector", label: "ZK Inspector" },
];

export default function NavBar({ walletAddress, onConnect, onDisconnect, connecting }: {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortAddr = walletAddress ? `${walletAddress.substring(0, 10)}...${walletAddress.slice(-6)}` : null;

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>💎</span>
          <span className={styles.logoText}>PRSP<span className={styles.logoSub}>dApp</span></span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`${styles.navLink} ${pathname === l.href ? styles.active : ""}`} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.netPill}>
            <span className={styles.netDot} />
            <span>Midnight Testnet</span>
          </div>
          {walletAddress ? (
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <button className="btn-secondary" onClick={handleCopy} title="Click to copy wallet address" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                {copied ? "✓ Copied!" : `🔗 ${shortAddr}`}
              </button>
              <button className="btn-secondary" onClick={onDisconnect} title="Disconnect Wallet" style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: "#fca5a5", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                ✕
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onConnect} disabled={connecting} style={{ padding: "0.55rem 1.25rem", fontSize: "0.88rem" }}>
              {connecting ? <><span className="spinner" /> Connecting...</> : "Connect Wallet"}
            </button>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}