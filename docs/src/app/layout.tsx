import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Grit',
    absolute: 'Grit Documentation',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
