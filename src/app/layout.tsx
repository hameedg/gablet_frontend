import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gablet Property Listing",
  description: "Enrich the property listing with more details",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
