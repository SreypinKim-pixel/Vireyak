import type { Metadata } from 'next';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ThemeProvider from './components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vireyak - Travel Cambodia',
  description: 'Extraordinary places. Meaningful journeys.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {/* main fills available vertical height so footer is pushed down */}
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}