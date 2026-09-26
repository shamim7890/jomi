// app/layout.tsx
// Server component — metadata এখানে থাকতে হয় বলে "use client" নেই।
// আসল Provider/Header/Sidebar লজিক components/AppShell.tsx (client) এ।

import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "জমি ক্রয় সহায়ক | ধাপে ধাপে গাইড",
  description: "বাংলাদেশে নিরাপদে জমি কেনার জন্য ধাপে ধাপে চেকলিস্ট ও গাইড",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}