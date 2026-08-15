import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Dashboard — Private Revenue Sharing Platform (PRSP)",
  description: "Private Revenue Sharing Platform — privacy-preserving ZK proof dApp on Midnight Network Preview.",
};

export default function HomePage() {
  return <HomeClient />;
}