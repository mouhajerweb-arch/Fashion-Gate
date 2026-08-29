import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline } from "@mui/material";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import LoaderProvider from "@/components/LoaderProvider";
import "./globals.css";

import { getHomepageData, imageUrl } from "@/lib/sanity";

export const revalidate = 60;



export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/brand/logo.png";
  let title = "Fashion Gate";
  let description = "Fashion Gate boutique ecommerce experience powered by Sanity CMS.";

  try {
    const data = await getHomepageData();
    if (data?.settings) {
      title = data.settings.title || title;
      description = data.settings.tagline || description;
      
      if (data.settings.logo) {
        try {
          const resolved = imageUrl(data.settings.logo).url();
          if (resolved) {
            faviconUrl = resolved;
          }
        } catch (e) {
          console.error("Failed to resolve logo image URL for metadata favicon", e);
        }
      }
    }
  } catch (error) {
    console.error("Failed to load metadata from Sanity:", error);
  }

  return {
    title,
    description,
    icons: {
      icon: faviconUrl
    }
  };
}

import LayoutWrapper from "@/components/LayoutWrapper";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let initialSettings = null;
  try {
    const data = await getHomepageData();
    initialSettings = data?.settings || null;
  } catch (error) {
    console.error("Failed to fetch settings in RootLayout:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>



        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1535285561613867');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1535285561613867&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <AppRouterCacheProvider>
          <CssBaseline />
          <LoaderProvider>
            <SmoothScroll />
            <LayoutWrapper initialSettings={initialSettings}>
              {children}
            </LayoutWrapper>
          </LoaderProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
