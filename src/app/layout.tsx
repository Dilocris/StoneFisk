import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { ModalProvider } from "@/context/ModalContext";
import { ErrorToast } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StoneFisk Dashboard",
  description: "StoneFisk renovation dashboard",
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
          <ModalProvider>
            {children}
          </ModalProvider>
          <ErrorToast />
        </ProjectProvider>
      </body>
    </html>
  );
}
