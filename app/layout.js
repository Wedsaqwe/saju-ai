import "./globals.css";

export const metadata = {
  title: "NUVO AI — 사주 × AI × 시장 시그널",
  description: "AI 사주명리 분석 + 실시간 시장 브리핑 + 맞춤 투자 시그널. 동서양 융합 운명 분석 플랫폼.",
  keywords: "사주, AI 사주, 사주명리, 운세, 점성술, 궁합, MBTI, 투자 시그널, 브리핑",
  openGraph: {
    title: "NUVO AI — 사주 × AI × 시장 시그널",
    description: "AI가 분석하는 사주명리 + 맞춤 투자 시그널",
    url: "https://saju-ai-one.vercel.app",
    siteName: "NUVO AI",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUVO AI — 사주 × AI × 시장 시그널",
    description: "AI가 분석하는 사주명리 + 맞춤 투자 시그널",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#0c0b14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
