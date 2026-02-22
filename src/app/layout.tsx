import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SEO_TITLE = "IPMaxTV | Le Meilleur de l'IPTV, Sans Coupure en 4K";
const SEO_DESC = "Découvrez IPMaxTV, le fournisseur IPTV n°1. Plus de 20,000 chaînes, VOD en qualité 4K et FHD, stabilité anti-coupure garantie. Support 24/7 et activation instantanée pour tous vos films et matchs.";
const SEO_URL = "https://ipmaxtv.shop";
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESC,
  keywords: ["iptv", "abonnement iptv", "iptv 4k", "serveur iptv", "iptv sans coupure", "meilleur iptv francais", "smart iptv", "smarters pro"],
  authors: [{ name: "IPMaxTV" }],
  creator: "IPMaxTV",
  publisher: "IPMaxTV",
  metadataBase: new URL(SEO_URL),
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESC,
    url: SEO_URL,
    siteName: 'IPMaxTV',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_TITLE,
    description: SEO_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
