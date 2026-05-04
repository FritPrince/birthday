import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Joyeux Anniversaire ♡",
  description: "Pour toi, aujourd'hui et toujours.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${dancing.variable} antialiased`}
    >
      <body style={{ margin: 0, padding: 0, background: "#04000d" }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
