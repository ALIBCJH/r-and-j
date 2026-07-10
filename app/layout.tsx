import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import PageTransition from "./components/layout/PageTransition";
import { CartProvider } from "./lib/cart";
import CartDrawer from "./components/cart/CartDrawer";
import WhatsAppFab from "./components/shared/WhatsAppFab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Production origin — used to resolve canonical + Open Graph URLs.
// Change this one line if the live domain differs.
const SITE_URL = "https://rjinteriors.co.ke";
const SITE_DESCRIPTION =
  "East Africa's first vertically integrated luxury curtain house. Preview fabrics and colours online, then we measure, make, and install — so you commit with confidence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "R&J Interiors — Visualize Before You Buy",
    template: "%s | R&J Interiors",
  },
  description: SITE_DESCRIPTION,
  applicationName: "R&J Interiors",
  keywords: [
    "luxury curtains",
    "curtains Kenya",
    "curtains Nyeri",
    "interior design Kenya",
    "made-to-measure curtains",
    "online curtain visualizer",
    "drapery",
    "R&J Interiors",
  ],
  openGraph: {
    type:        "website",
    siteName:    "R&J Interiors",
    title:       "R&J Interiors — Visualize Before You Buy",
    description: SITE_DESCRIPTION,
    url:         SITE_URL,
    locale:      "en_KE",
    images: [
      {
        url:    "/assets/hero3.png",
        width:  1536,
        height: 1024,
        alt:    "A concept image of R&J's in-development immersive visualization experience",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "R&J Interiors — Visualize Before You Buy",
    description: SITE_DESCRIPTION,
    images:      ["/assets/hero3.png"],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon:     '/logo24.png',
    shortcut: '/logo24.png',
    apple:    '/logo24.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <ThemeProvider><PageTransition>{children}</PageTransition></ThemeProvider>
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
