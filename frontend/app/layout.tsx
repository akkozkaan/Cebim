'use client'; // Ensure this file is treated as a client component

import './globals.css'; // Import the global CSS file

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}