'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* Defaults                                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_CAMPAIGNS = [
  {
    id: '1',
    company: '10x Media',
    role: 'Full-Stack Developer',
    startDate: '2025-03-01T00:00:00.000Z',
    isCurrent: true,
    endDate: null,
    description:
      'Desarrollo de plataformas CMS empresariales con PayloadCMS + Next.js. Profundización en arquitectura headless y flujos editoriales avanzados.',
    questRewards: [
      { achievementName: 'Arquitectura headless a escala real' },
      { achievementName: 'PayloadCMS en producción' },
    ],
  },
  {
    id: '2',
    company: 'Lean Solutions Group',
    role: 'Developer',
    startDate: '2024-01-01T00:00:00.000Z',
    isCurrent: false,
    endDate: '2025-02-01T00:00:00.000Z',
    description: 'Desarrollo de soluciones empresariales. Trabajo en equipo remoto con metodologías ágiles.',
    questRewards: [
      { achievementName: 'Trabajo en equipos distribuidos' },
    ],
  },
  {
    id: '3',
    company: 'Canadian College (Freelance)',
    role: 'Full-Stack Developer',
    startDate: '2022-01-01T00:00:00.000Z',
    isCurrent: false,
    endDate: '2024-01-01T00:00:00.000Z',
    description:
      'Co-creador del Sistema de Programación de Clases (SPC) desde cero. Backend en Java/Spring Boot Security; frontend en Next.js. Soporte para ~1500 estudiantes semanales.',
    questRewards: [
      { achievementName: 'SPC activo para 1500+ estudiantes' },
      { achievementName: 'Backend security con Spring Boot' },
      { achievementName: 'Primer cliente pagado' },
    ],
  },
  {
    id: '4',
    company: 'Mostaza',
    role: 'Web Developer',
    startDate: '2021-01-01T00:00:00.000Z',
    isCurrent: false,
    endDate: '2022-01-01T00:00:00.000Z',
    description:
      'Desarrollo web y gestión de contenido. Exploración de alternativas a WordPress que culminó en el descubrimiento de PayloadCMS.',
    questRewards: [
      { achievementName: 'Descubrimiento de PayloadCMS' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatDate(dateStr: string | null | undefined, isCurrent: boolean): string {
  if (isCurrent) return 'Presente'
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' })
}

function extractText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  const root = richText?.root
  if (!root) return ''
  return (root.children ?? [])
    .flatMap((child: any) => (child.children ?? []).map((c: any) => c.text ?? ''))
    .join(' ')
}

/* dot colors cycle through the palette */
const DOT_COLORS = [
  'var(--color-cyan)',
  'var(--color-green)',
  'var(--color-amber)',
  'var(--color-cyan)',
  'var(--color-green)',
]

/* ------------------------------------------------------------------ */
/* Campaign entry                                                        */
/* ------------------------------------------------------------------ */
function CampaignEntry({
  campaign,
  index,
  isLast,
}: {
  campaign: any
  index: number
  isLast: boolean
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const t      = useTranslations('campaigns')
  const color  = DOT_COLORS[index % DOT_COLORS.length]
  const desc   = extractText(campaign.description) || campaign.description || ''

  const start  = formatDate(campaign.startDate, false)
  const end    = formatDate(campaign.endDate,   campaign.isCurrent)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
      className="relative pl-10"
    >
      {/* Timeline line segment */}
      {!isLast && (
        <div
          className="absolute left-[9px] top-5 bottom-0 w-px"
          style={{ background: `linear-gradient(${color}, var(--color-border))` }}
        />
      )}

      {/* Dot */}
      <div
        className="absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: 'var(--color-void)',
          border:     `2px solid ${color}`,
          boxShadow:  `0 0 12px ${color}44`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      </div>

      {/* Content card */}
      <div
        className="mb-10 p-5"
        style={{
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderRadius: '2px',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
          <div>
            <h3 className="font-ui font-semibold text-lg" style={{ color: 'var(--color-foreground)' }}>
              {campaign.company}
            </h3>
            <p className="font-mono text-sm tracking-wide" style={{ color }}>
              {campaign.role}
            </p>
          </div>
          <div
            className="font-mono text-xs tracking-wider px-2 py-1 self-start whitespace-nowrap"
            style={{
              color:        'var(--color-muted)',
              background:   'var(--color-surface-elevated)',
              border:       '1px solid var(--color-border)',
              borderRadius: '2px',
            }}
          >
            {start} → {end}
          </div>
        </div>

        {/* Description */}
        {desc && (
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
            {desc}
          </p>
        )}

        {/* Quest rewards */}
        {campaign.questRewards?.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--color-muted)' }}>
              ◈ {t('rewards')}
            </span>
            {campaign.questRewards.map((reward: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color }}>+</span>
                <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
                  {reward.achievementName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */
export function CampaignsSection({ campaigns }: { campaigns: any[] }) {
  const data = campaigns?.length ? campaigns : DEFAULT_CAMPAIGNS
  const t    = useTranslations('campaigns')

  return (
    <section className="py-24" style={{ borderColor: 'var(--color-border)' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14">
          <span className="font-mono text-xs" style={{ color: 'var(--color-amber)' }}>◈</span>
          <h2 className="font-display font-black text-3xl tracking-tight" style={{ color: 'var(--color-name)' }}>
            {t('title')}
          </h2>
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>{t('subtitle')}</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
            {data.length} entries
          </span>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl">
          {data.map((campaign, i) => (
            <CampaignEntry
              key={campaign.id ?? i}
              campaign={campaign}
              index={i}
              isLast={i === data.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
