import type { Metadata } from "next";
import "../styles/globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Private Revenue Sharing Platform — Midnight Network dApp",
  description: "Privacy-preserving zero-knowledge revenue distribution and dividend sharing dApp on the Midnight Network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}