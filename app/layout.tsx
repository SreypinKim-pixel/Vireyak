import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteChrome from "../components/SiteChrome";
export const metadata: Metadata = {
  metadataBase: new URL("https://vireyak-rust.vercel.app"),
  title: {
    default: "Vireyak — Discover Cambodia, beautifully",
    template: "%s | Vireyak",
  },
  description:
    "Find your kind of extraordinary. Explore memorable stays, timeless temples, and beautiful escapes across Cambodia with Vireyak.",
  openGraph: {
    type: "website",
    siteName: "Vireyak",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1672,
        height: 941,
        alt: "Vireyak — Discover Cambodia, beautifully",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/thumbnail.png"],
  },
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
