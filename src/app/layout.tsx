'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import ModalProvider from '@/components/providers/modal-provider'
import { Toaster } from 'sonner'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">

      <body
        className={`${inter.className} flex h-screen w-screen relative`}
      >
        <SessionProvider>
          <ModalProvider>
          {children}
          <Toaster position='top-center' richColors />
        </ModalProvider>
      </SessionProvider>
    </body>
    </html >
  )
}
