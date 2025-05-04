import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { XellarProvider } from './provider/XellarProvider';
import { ReduxProvider } from "../../libs/provider";
import { ThemeInitializer } from "../components/root/ThemeInitializer";

const mona_sans = Mona_Sans({
  variable: '--font-mona',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FK HOTEL WEB3',
  description: 'HOTEL WEB3 DECENTRALIZED APPLICATION',
  icons: {
    icon: '/image/mylogo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mona_sans.variable} antialiased`}>
        <XellarProvider>
          <ReduxProvider>
            <ThemeInitializer>
              {children}
            </ThemeInitializer>
          </ReduxProvider>
        </XellarProvider>
      </body>
    </html>
  )
}