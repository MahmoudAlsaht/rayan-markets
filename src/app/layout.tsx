import type { Metadata } from "next";
import localFont from "next/font/local";
import InstallApp from "../components/InstallApp";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import LoadingProvider from "@/context/LoadingContext";
import AdminNavbar from "./admin/_components/AdminNavbar";
import MainNavbar from "./(siteFacing)/_components/MainNavbar";
import { checkUser } from "./(siteFacing)/auth/_actions/isAuthenticated";
import { getCart } from "./(siteFacing)/cart/_actions/checkCart";
import BottomNavbar from "./(siteFacing)/(mobile)/_components/BottomNavbar";
import db from "@/db/db";
import { getPendingLength } from "./(siteFacing)/orders/_actions/getOrders";

const Alexandria = localFont({
  src: "../fonts/Alexandria-VariableFont_wght.ttf",
  display: "swap",
});

const APP_NAME = "أسواق الريان";
const APP_DEFAULT_TITLE = "أسواق الريان العالمية";
const APP_TITLE_TEMPLATE = "%s - أسواق الريان";
const APP_DESCRIPTION =
  "أسواق الريان العالمية تجسد روح الكفاءة والابتكار والتركيز على العملاء";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startupImage: ["/apple-touch-icon.png"],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await checkUser()) as {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: { id: string };
  };
  const cart = await getCart();
  const pendingLength = await getPendingLength();
  const offers = await db.product.findFirst({ where: { isOffer: true } });
  const forHomeProducts = await db.product.findFirst({
    where: { productType: "forHome" },
  });

  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-200 text-rayanPrimary-dark antialiased",
          Alexandria.className,
        )}
        dir="rtl"
      >
        <ThemeProvider attribute="class">
          <LoadingProvider
            AdminNavbar={<AdminNavbar />}
            SiteFacingNavbar={
              <MainNavbar
                pendingOrdersLength={pendingLength}
                offersExists={offers !== null}
                forHomeExists={forHomeProducts !== null}
                user={user}
                cart={cart}
              />
            }
            MobileNavBar={<BottomNavbar />}
          >
            {children}
          </LoadingProvider>

          <InstallApp />
          <div className="h-24"></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
