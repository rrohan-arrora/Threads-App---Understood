import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import TopBar from '@/components/shared/Topbar'
import LeftSideBar from '@/components/shared/LeftSidebar'
import RightSideBar from '@/components/shared/RightSidebar'
import BottomBar from '@/components/shared/Bottombar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads App',
  description: 'Thread App clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
          <main>
            <LeftSideBar />
              <section className="main-container">
                <div className='w-full max-w-4xl'>
                  {children}
                </div>
              </section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  )
}