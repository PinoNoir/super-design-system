import type { Metadata } from 'next';
import { ClientThemeProvider } from '@/app/ui/providers';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Stretto Gen AI App',
  description: 'A simple chat app using Next.js and AI SDK',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientThemeProvider defaultTheme="core-light">{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
