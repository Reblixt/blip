import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/Layout/LayoutWrapper';
import Wagmi from '@/providers/wagmi';
import Tanstack from '@/providers/tanstack';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blip',
  description: 'Swish alternative on-chain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Wagmi>
          <Tanstack>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Tanstack>
        </Wagmi>
      </body>
    </html>
  );
}
