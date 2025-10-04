import type { Metadata } from "next";
import { Kaisei_Tokumin, Inconsolata } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider } from "@/components/SidebarProvider";
import { MainContent } from "@/components/MainContent";

const kaiseiTokumin = Kaisei_Tokumin({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-kaisei-tokumin",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});


export const metadata: Metadata = {
  title: "Evalpedia",
  description: "Agentic Evals Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kaiseiTokumin.variable} ${inconsolata.variable} antialiased`}
      >
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Navbar />
            <MainContent>
              {children}
            </MainContent>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>

    </html>
  );
}
