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
      className="font-mono text-xs tracking-[0.2em] uppercase px-3 py-2 transition-colors duration-150"
      style={{
        border:       '1px solid var(--color-border)',
        borderRadius: '2px',
        background:   'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
      }}
      aria-label="Toggle language"
    >
      <span style={{ color: locale === 'es' ? 'var(--color-cyan)' : 'var(--color-muted)' }}>ES</span>
      <span className="mx-2" style={{ color: 'var(--color-border-glow)' }}>|</span>
      <span style={{ color: locale === 'en' ? 'var(--color-cyan)' : 'var(--color-muted)' }}>EN</span>
    </button>
  )
}
