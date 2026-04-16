'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* Defaults                                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=900&auto=format&fit=crop&q=60'

const DEFAULT_QUESTS = [
  {
    id: '1',
    title: 'Fundación Jazz para la Paz',
    category: 'music',
    status: 'in-progress',
    featured: true,
    sortOrder: 1,
    description: 'Plataforma web para la fundación que promueve el jazz como herramienta de transformación social. Talleres activos, comunidad viva.',
    stack: [
      { techName: 'Next.js', icon: 'Layers' },
      { techName: 'TypeScript', icon: 'Code' },
      { techName: 'Vercel', icon: 'Cloud' },
    ],
    link: 'https://fjpp.vercel.app/',
  },
  {
    id: '2',
    title: 'HeionHub',
    category: 'tech',
    status: 'in-progress',
    featured: true,
    sortOrder: 2,
    description: 'Plataforma de gestión de contenido y comunidad construida sobre Next.js + PayloadCMS. Anteriormente EtherHub.',
    stack: [
      { techName: 'Next.js',     icon: 'Layers'   },
      { techName: 'PayloadCMS',  icon: 'Database' },
      { techName: 'TypeScript',  icon: 'Code'     },
    ],
    link: 'https://heionhub.com/',
  },
  {
    id: '3',
    title: 'Realidad, Memoria y Creencia',
    category: 'education',
    status: 'completed',
    featured: true,
    sortOrder: 3,
    description: 'Tesis de Maestría en Educación Artística — UN. Una investigación sobre la forja encendida: convertir la incertidumbre en criterio propio.',
    stack: [
      { techName: 'Investigación', icon: 'BookOpen'      },
      { techName: 'Instalación Sonora', icon: 'AudioWaveform' },
    ],
    link: 'https://repositorio.unal.edu.co/items/4c8fad63-28eb-4187-8654-55fae0b061cf',
  },
  {
    id: '4',
    title: 'SPC — Canadian College',
    category: 'tech',
    status: 'completed',
    featured: false,
    sortOrder: 4,
    description: 'Sistema de programación de clases para ~1500 estudiantes. Java/Spring Boot security en backend, Next.js en frontend.',
    stack: [
      { techName: 'Java',     icon: 'Server'  },
      { techName: 'Spring',   icon: 'Shield'  },
      { techName: 'Next.js',  icon: 'Layers'  },
    ],
    link: null,
  },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const CATEGORY_COLOR: Record<string, string> = {
  tech:      'var(--color-cyan)',
  music:     'var(--color-green)',
  art:       'var(--color-amber)',
  coffee:    'var(--color-amber)',
  education: 'var(--color-amber)',
}

const CATEGORY_GLOW: Record<string, string> = {
  tech:      'rgba(0,212,255,0.15)',
  music:     'rgba(0,255,136,0.15)',
  art:       'rgba(255,140,0,0.15)',
  coffee:    'rgba(255,140,0,0.15)',
  education: 'rgba(255,140,0,0.15)',
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  completed:   { label: '✓ Completed',    color: 'var(--color-green)'  },
  'in-progress': { label: '⟳ In Progress', color: 'var(--color-amber)'  },
  'side-quest':  { label: '◎ Side Quest',  color: 'var(--color-muted)'  },
}

function extractText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  const root = richText?.root
  if (!root) return ''
  const lines: string[] = []
  for (const child of root.children ?? []) {
    const text = (child.children ?? []).map((c: any) => c.text ?? '').join('')
    if (text) lines.push(text)
  }
  return lines.join(' ')
}

/* ------------------------------------------------------------------ */
/* Quest Card                                                           */
/* ------------------------------------------------------------------ */
function QuestCard({
  quest,
  defaultCover,
  featured,
  viewProjectLabel,
}: {
  quest: any
  defaultCover: string
  featured: boolean
  viewProjectLabel: string
}) {
  const coverUrl =
    quest.coverImage?.url
      ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${quest.coverImage.url}`
      : defaultCover

  const accentColor = CATEGORY_COLOR[quest.category] ?? 'var(--color-cyan)'
  const glowColor   = CATEGORY_GLOW[quest.category]  ?? 'rgba(0,212,255,0.15)'
  const status      = STATUS_LABEL[quest.status]
  const descText    = extractText(quest.description) || quest.description || 'Archived in the deep logs.'

  return (
    <motion.div
      variants={{
        hidden:   { opacity: 0, y: 20 },
        visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
      whileHover={{ x: -2, y: -4, rotate: -0.3, transition: { duration: 0.18 } }}
      className={`flex flex-col overflow-hidden group cursor-default ${featured ? 'md:col-span-2' : ''}`}
      style={{
        background:   'var(--color-surface)',
        border:       '1px solid var(--color-border)',
        borderRadius: '2px',
        willChange:   'transform',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-glow)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${glowColor}`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Cover image */}
      <div className={`relative w-full overflow-hidden ${featured ? 'h-56' : 'h-40'}`}>
        <Image
          src={coverUrl}
          alt={quest.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Category tag on image */}
        <div className="absolute top-3 left-3">
          <span
            className="font-mono text-[9px] tracking-[0.25em] uppercase px-2 py-1"
            style={{
              color: accentColor,
              background: 'rgba(0,0,0,0.7)',
              border: `1px solid ${accentColor}44`,
              borderRadius: '2px',
            }}
          >
            {quest.category}
          </span>
        </div>
        {/* Status badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <span
              className="font-mono text-[9px] tracking-wider uppercase px-2 py-1"
              style={{
                color:      status.color,
                background: 'rgba(0,0,0,0.7)',
                border:     `1px solid ${status.color}44`,
                borderRadius: '2px',
              }}
            >
              {status.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-ui font-semibold text-xl leading-tight" style={{ color: 'var(--color-foreground)' }}>
          {quest.title}
        </h3>

        <p
          className="font-body text-sm leading-relaxed flex-1"
          style={{ color: 'var(--color-muted)' }}
        >
          {descText.length > 140 ? descText.slice(0, 140) + '…' : descText}
        </p>

        {/* Stack pills */}
        {quest.stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {quest.stack.map((s: any, i: number) => (
              <span
                key={i}
                className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5"
                style={{
                  color:        'var(--color-muted)',
                  background:   'var(--color-surface-elevated)',
                  border:       '1px solid var(--color-border)',
                  borderRadius: '2px',
                }}
              >
                {s.techName}
              </span>
            ))}
          </div>
        )}

        {/* Link */}
        {quest.link && (
          <a
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto font-mono text-xs tracking-widest uppercase flex items-center gap-2 transition-colors duration-150 w-fit"
            style={{ color: accentColor }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <span>{viewProjectLabel}</span>
            <span>→</span>
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */
export function QuestsSection({
  quests,
  defaultCover,
}: {
  quests: any[]
  defaultCover: string
}) {
  const data = quests?.length ? quests : DEFAULT_QUESTS
  const t    = useTranslations('quests')

  return (
    <section className="py-24 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14">
          <span className="font-mono text-xs" style={{ color: 'var(--color-green)' }}>◈</span>
          <h2 className="font-display font-black text-3xl tracking-tight" style={{ color: 'var(--color-name)' }}>
            {t('title')}
          </h2>
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>{t('subtitle')}</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
            {t('count', { n: data.length })}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {data.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              defaultCover={defaultCover || DEFAULT_COVER}
              featured={!!quest.featured}
              viewProjectLabel={t('viewProject')}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
