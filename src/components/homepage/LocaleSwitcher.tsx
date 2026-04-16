'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export function LocaleSwitcher() {
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'es' ? 'en' : 'es' })
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="font-mono text-xs tracking-[0.2em] uppercase px-3 py-2
                 border border-border rounded-sharp
                 bg-void/60 backdrop-blur-sm
                 transition-colors duration-150 hover:border-border-glow"
    >
      <span className={locale === 'es' ? 'text-cyan' : 'text-muted'}>ES</span>
      <span className="mx-2 text-border-glow">|</span>
      <span className={locale === 'en' ? 'text-cyan' : 'text-muted'}>EN</span>
    </button>
  )
}
