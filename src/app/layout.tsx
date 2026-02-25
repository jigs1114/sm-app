import type { Metadata } from "next";
import "./globals.css";

// The build previously failed attempting to load custom fonts.  for now we
// use the default system fonts.  Add local font logic back later when the
// font files are available in `public/fonts`.

export const metadata: Metadata = {
  title: "Smart Monitor",
  description: "Real-time network and energy monitoring dashboard",
  icons: {
    icon: "/energy.svg",
    apple: "/energy.svg",
    shortcut: "/energy.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
