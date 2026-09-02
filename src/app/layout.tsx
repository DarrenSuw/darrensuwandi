import type { Metadata } from 'next';
import { Syne, DM_Sans, Fragment_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import DotNav from '@/components/layout/DotNav';
import AdversarialField from '@/components/ui/AdversarialField';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500'],
  display: 'swap',
});

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://darrensuwandi.vercel.app'),
  title: 'Darren Cornelius Suwandi — ML Researcher & AI Engineer',
  description:
    'Personal portfolio of Darren Cornelius Suwandi, ML researcher and AI engineer specialising in adversarial robustness and explainability.',
  openGraph: {
    title: 'Darren Cornelius Suwandi — ML Researcher & AI Engineer',
    description: 'ML researcher and AI engineer — adversarial robustness, XAI, full-stack SaaS.',
    url: 'https://darrensuwandi.vercel.app',
    siteName: 'Darren Cornelius Suwandi',
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${fragmentMono.variable}`}>
      <body>
        {/* z-0: canvas field — fixed, scrolls visually as cursor moves */}
        <AdversarialField />
        {/* z-1: all content */}
        <div className="above-field">
          <Navbar />
          <DotNav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
