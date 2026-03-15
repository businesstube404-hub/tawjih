import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-sans' })

export const viewport: Viewport = {
  themeColor: '#0b3b6f',
}

export const metadata: Metadata = {
  title: 'ToQuiz | منصة اختبارات تفاعلية لطلاب التوجيهي',
  description: 'المنصة التفاعلية الأولى لتدريب طلاب التوجيهي في الأردن. محاكاة وزارية، بنوك أسئلة، نصائح وأدعية.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-sans`}>
      <body className="font-sans antialiased bg-[#f4f7f6] text-[#111]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
