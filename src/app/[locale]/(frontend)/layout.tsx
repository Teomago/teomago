import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Unbounded, Chakra_Petch, JetBrains_Mono, Crimson_Pro } from 'next/font/google'
import './styles.css'

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})

export const metadata = {
  description: 'Full-Stack Developer · Musician · Arts Educator',
  title: 'Teomago',
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${unbounded.variable} ${chakraPetch.variable} ${jetbrainsMono.variable} ${crimsonPro.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <main>{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
