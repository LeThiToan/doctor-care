import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AIChatboxWrapper } from "@/components/ai-chatbox-wrapper"
import FloatingChatButton from "@/components/chat/floating-chat-button"
import { ChatProvider } from "@/app/contexts/chat-context"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "MedBooking - Đặt lịch khám bệnh online",
  description: "Hệ thống đặt lịch khám bệnh trực tuyến hiện đại và tiện lợi",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ChatProvider>
          <Suspense fallback={null}>
            {children}
            <Analytics />
            <Toaster />
            <AIChatboxWrapper />
            <FloatingChatButton />
          </Suspense>
        </ChatProvider>
      </body>
    </html>
  )
}
