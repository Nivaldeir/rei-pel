'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import ModalProvider from '@/components/providers/modal-provider'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <ModalProvider>
          <body
            className={`${inter.className} flex h-screen w-screen relative`}
          >
            {children}
            <Toaster />
          </body>
        </ModalProvider>
      </SessionProvider>
    </html>
  )
}
