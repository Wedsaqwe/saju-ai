export const metadata = {
  title: 'AI 사주명리 | 당신의 운명을 읽어드립니다',
  description: 'AI가 풀어주는 사주팔자 분석, 궁합, 타로, 오늘의 운세',
}
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
