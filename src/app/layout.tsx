import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reforma Dashboard",
  description: "Master Control for Home Renovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
