import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Iqbal Musyaffa - Software Engineer & Fullstack Developer',
  description: 'Portfolio web modern Iqbal Musyaffa - Lulusan Universitas Telkom Surabaya, Fullstack & Backend Developer berpengalaman dengan Next.js, React, Laravel, dan MySQL.',
  keywords: 'Iqbal Musyaffa, Software Engineer, Fullstack Developer, Next.js, Laravel, React, MySQL, Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#030014] dark:bg-[#030014] text-gray-900 dark:text-gray-100 antialiased selection:bg-[#8245ec] selection:text-white transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
