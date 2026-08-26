import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Midnight Relay', description: 'A late-night radio desktop.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
