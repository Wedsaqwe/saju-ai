export const metadata = {
  title: 'AI 사주명리',
  description: 'AI가 풀어주는 사주팔자 분석',
}
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
