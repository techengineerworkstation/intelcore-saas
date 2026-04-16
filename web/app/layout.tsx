import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IntelCore SaaS - Enterprise Business Intelligence',
  description: 'AI-powered business intelligence and KPI analytics platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } html,body { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #080D18; color: white; }`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}