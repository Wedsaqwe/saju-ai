import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "NUVO AI — 사주 × AI × 시장 시그널",
  description: "AI 사주명리 분석 + 실시간 시장 브리핑 + 맞춤 투자 시그널. 동서양 융합 운명 분석 플랫폼.",
  openGraph: {
    title: "NUVO AI — 사주 × AI × 시장 시그널",
    description: "AI가 분석하는 사주명리 + 맞춤 투자 시그널",
    url: "https://saju-ai-one.vercel.app",
    siteName: "NUVO AI",
    type: "website",
    locale: "ko_KR",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#0c0b14",
};

// ─── GA4 Measurement ID ───
// Vercel 환경변수로 설정: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// ─── Meta Pixel ID ───
// Vercel 환경변수로 설정: NEXT_PUBLIC_META_PIXEL_ID=123456789
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* GA4 */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
