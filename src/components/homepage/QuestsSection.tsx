'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* Accent variant                                                        */
/* ------------------------------------------------------------------ */
type AccentVariant = 'cyan' | 'green' | 'amber'

const CATEGORY_ACCENT: Record<string, AccentVariant> = {
  tech:      'cyan',
  music:     'green',
  art:       'amber',
  coffee:    'amber',
  education: 'amber',
}

const ACCENT_TEXT   = { cyan: 'text-cyan',   green: 'text-green',   amber: 'text-amber'   } as const
const ACCENT_BG     = { cyan: 'bg-glow-cyan', green: 'bg-glow-green', amber: 'bg-glow-amber' } as const
const ACCENT_SHADOW = {
  cyan:  'hover:shadow-glow-cyan',
  green: 'hover:shadow-glow-green',
  amber: 'hover:shadow-glow-amber',
} as const

const STATUS_CONFIG: Record<string, { label: string; colorClass: string }> = {
  completed:   { label: '✓ Completed',    colorClass: 'text-green' },
  'in-progress': { label: '⟳ In Progress', colorClass: 'text-amber' },
  'side-quest':  { label: '◎ Side Quest',  colorClass: 'text-muted' },
}

/* ------------------------------------------------------------------ */
/* Defaults                                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=900&auto=format&fit=crop&q=60'

const DEFAULT_QUESTS = [
  {
    id: '1', title: 'Fundación Jazz para la Paz', category: 'music',
    status: 'in-progress', featured: true, sortOrder: 1,
    description: 'Plataforma web para la fundación que promueve el jazz como herramienta de transformación social. Talleres activos, comunidad viva.',
    stack: [{ techName: 'Next.js' }, { techName: 'TypeScript' }, { techName: 'Vercel' }],
    link: 'https://fjpp.vercel.app/',
  },
  {
    id: '2', title: 'HeionHub', category: 'tech',
    status: 'in-progress', featured: true, sortOrder: 2,
    description: 'Plataforma de gestión de contenido y comunidad construida sobre Next.js + PayloadCMS. Anteriormente EtherHub.',
    stack: [{ techName: 'Next.js' }, { techName: 'PayloadCMS' }, { techName: 'TypeScript' }],
    link: 'https://heionhub.com/',
  },
  {
    id: '3', title: 'Realidad, Memoria y Creencia', category: 'education',
    status: 'completed', featured: true, sortOrder: 3,
    description: 'Tesis de Maestría en Educación Artística — UN. Una investigación sobre la forja encendida: convertir la incertidumbre en criterio propio.',
    stack: [{ techName: 'Investigación' }, { techName: 'Instalación Sonora' }],
    link: 'https://repositorio.unal.edu.co/items/4c8fad63-28eb-4187-8654-55fae0b061cf',
  },
  {
    id: '4', title: 'SPC — Canadian College', category: 'tech',
    status: 'completed', featured: false, sortOrder: 4,
    description: 'Sistema de programación de clases para ~1500 estudiantes. Java/Spring Boot security en backend, Next.js en frontend.',
    stack: [{ techName: 'Java' }, { techName: 'Spring' }, { techName: 'Next.js' }],
    link: null,
  },
]

/* ------------------------------------------------------------------ */
/* Helper                                                               */
/* ------------------------------------------------------------------ */
function extractText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  const root = richText?.root
  if (!root) return ''
  return (root.children ?? [])
    .flatMap((child: any) => (child.children ?? []).map((c: any) => c.text ?? ''))
    .join(' ')
}

/* ------------------------------------------------------------------ */
/* Quest card                                                            */
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
  const coverUrl = quest.coverImage?.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${quest.coverImage.url}`
    : defaultCover

  const variant  = CATEGORY_ACCENT[quest.category] ?? 'cyan'
  const status   = STATUS_CONFIG[quest.status]
  const descText = extractText(quest.description) || quest.description || 'Archived in the deep logs.'

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
      whileHover={{ x: -2, y: -4, rotate: -0.3, transition: { duration: 0.18 } }}
      className={`flex flex-col overflow-hidden cursor-default group
                  bg-surface border border-border rounded-sharp
                  hover:border-border-glow transition-all duration-200
                  ${ACCENT_SHADOW[variant]}
                  ${featured ? 'md:col-span-2' : ''}`}
      style={{ willChange: 'transform' }}
    >
      {/* Cover image */}
      <div className={`relative w-full overflow-hidden ${featured ? 'h-56' : 'h-40'}`}>
        <Image
          src={coverUrl}
          alt={quest.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500
                     scale-105 group-hover:scale-100 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className={`font-mono text-[9px] tracking-[0.25em] uppercase px-2 py-1
                            rounded-sharp bg-void/70 border border-current/25
                            ${ACCENT_TEXT[variant]}`}>
            {quest.category}
          </span>
        </div>
        {/* Status badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-1
                              rounded-sharp bg-void/70 border border-current/25
                              ${status.colorClass}`}>
              {status.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-ui font-semibold text-xl leading-tight text-foreground">
          {quest.title}
        </h3>
        <p className="font-body text-sm leading-relaxed flex-1 text-muted">
          {descText.length > 140 ? descText.slice(0, 140) + '…' : descText}
        </p>

        {/* Stack pills */}
        {quest.stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {quest.stack.map((s: any, i: number) => (
              <span
                key={i}
                className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5
                           rounded-sharp bg-surface-elevated border border-border text-muted"
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
            className={`mt-auto font-mono text-xs tracking-widest uppercase
                        flex items-center gap-2 w-fit opacity-100 hover:opacity-70
                        transition-opacity duration-150 ${ACCENT_TEXT[variant]}`}
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
export function QuestsSection({ quests, defaultCover }: { quests: any[]; defaultCover: string }) {
  const data = quests?.length ? quests : DEFAULT_QUESTS
  const t    = useTranslations('quests')

  return (
    <section className="py-24 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-14">
          <span className="font-mono text-xs text-green">◈</span>
          <h2 className="font-display font-black text-3xl tracking-tight text-name">{t('title')}</h2>
          <span className="font-mono text-xs text-muted">{t('subtitle')}</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted">{t('count', { n: data.length })}</span>
        </div>

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
