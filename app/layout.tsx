import { siteUrl, siteDescription } from "@/lib/seo";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteChrome from "../components/SiteChrome";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vireyak — Discover Cambodia",
    template: "%s | Vireyak",
  },
  description: siteDescription,
  icons: {
    icon: { url: "/Logo.png", type: "image/png" },
    apple: { url: "/Logo.png", type: "image/png" },
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
const themeScript = `(function(){try{var t=localStorage.getItem('vireyak-theme');document.documentElement.classList.toggle('dark',t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches));}catch(e){}})();`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-panel focus:p-4"
        >
          Skip to content
        </a>
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteChrome>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
