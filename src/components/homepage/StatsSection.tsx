'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/* ------------------------------------------------------------------ */
/* Defaults                                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_STATS = [
  { id: '1', name: 'TypeScript',        level: 94, category: 'frontend',          icon: 'Code'          },
  { id: '2', name: 'Next.js',           level: 91, category: 'frontend',          icon: 'Layers'        },
  { id: '3', name: 'React',             level: 90, category: 'frontend',          icon: 'Braces'        },
  { id: '4', name: 'PayloadCMS',        level: 88, category: 'backend',           icon: 'Database'      },
  { id: '5', name: 'Java / Spring',     level: 72, category: 'backend',           icon: 'Server'        },
  { id: '6', name: 'Jazz Piano',        level: 85, category: 'music',             icon: 'Piano'         },
  { id: '7', name: 'Music Production',  level: 80, category: 'audio-engineering', icon: 'AudioWaveform' },
  { id: '8', name: 'Sound Design',      level: 75, category: 'audio-engineering', icon: 'Waves'         },
  { id: '9', name: 'Arts Education',    level: 88, category: 'music',             icon: 'GraduationCap' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const ACCENT: Record<string, string> = {
  frontend:          'var(--color-cyan)',
  backend:           'var(--color-cyan)',
  music:             'var(--color-green)',
  'audio-engineering': 'var(--color-green)',
}

const GLOW: Record<string, string> = {
  frontend:          'rgba(0,212,255,0.18)',
  backend:           'rgba(0,212,255,0.18)',
  music:             'rgba(0,255,136,0.18)',
  'audio-engineering': 'rgba(0,255,136,0.18)',
}

const CATEGORY_LABEL: Record<string, string> = {
  frontend:          'Frontend',
  backend:           'Backend',
  music:             'Music',
  'audio-engineering': 'Audio Eng',
}

/* icon is just a text label — we use a monospace glyph map */
const ICON_GLYPH: Record<string, string> = {
  Code:          '</>',
  Layers:        '◫◫',
  Braces:        '{ }',
  Database:      '⊞DB',
  Server:        '[SRV]',
  Piano:         '♪♬',
  AudioWaveform: '≋≋≋',
  Waves:         '∿∿∿',
  GraduationCap: '⚑',
  Guitar:        '♩',
  Music:         '♫',
  Music2:        '♫',
  Mic:           '⊙',
  Headphones:    '⌒⌒',
  Sliders:       '≡≡≡',
  Brain:         '◎',
  BookOpen:      '⊡',
  Lightbulb:     '✦',
  Globe:         '⊕',
  GitBranch:     '⎇',
  Shield:        '⬡',
  Zap:           '⚡',
  Activity:      '∾',
  Feather:       '〜',
  Star:          '★',
  Sparkles:      '✦✦',
  Gem:           '◆',
  Flame:         '🔥',
  Coffee:        '⊙',
}

/* ------------------------------------------------------------------ */
/* Sub-component: stat card with animated bar                           */
/* ------------------------------------------------------------------ */
function StatCard({ stat, index }: { stat: any; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const color = ACCENT[stat.category] ?? 'var(--color-cyan)'
  const glow  = GLOW[stat.category]  ?? 'rgba(0,212,255,0.18)'
  const pct   = Math.round((stat.level / 99) * 100)
  const glyph = ICON_GLYPH[stat.icon] ?? '<>'

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
      whileHover={{ x: -2, y: -4, rotate: -0.3, transition: { duration: 0.2 } }}
      className="relative p-5 flex flex-col gap-4 cursor-default group"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '2px',
        willChange: 'transform',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-glow)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${glow}`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between">
        <div
          className="font-mono text-sm select-none"
          style={{ color, letterSpacing: '0.05em' }}
        >
          {glyph}
        </div>
        <span
          className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
          style={{
            color,
            background: glow,
            border: `1px solid ${color}22`,
            borderRadius: '2px',
          }}
        >
          {CATEGORY_LABEL[stat.category] ?? stat.category}
        </span>
      </div>

      {/* Name + level */}
      <div className="flex items-end justify-between">
        <span className="font-ui text-base" style={{ color: 'var(--color-foreground)' }}>
          {stat.name}
        </span>
        <span
          className="font-mono font-bold text-2xl leading-none"
          style={{ color, textShadow: `0 0 20px ${glow}` }}
        >
          {stat.level}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full overflow-visible" style={{ background: 'var(--color-surface-elevated)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: index * 0.06 }}
        />
        {inView && (
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 rounded-full"
            style={{
              left: `calc(${pct}% - 1px)`,
              backgroundColor: color,
              animation: 'glow-pulse 2.5s ease-in-out infinite',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.06 + 1.1 }}
          />
        )}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */
export function StatsSection({ stats }: { stats: any[] }) {
  const data = stats?.length ? stats : DEFAULT_STATS
  const ref  = useRef(null)

  return (
    <section
      className="py-24 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <span className="font-mono text-xs" style={{ color: 'var(--color-cyan)' }}>◈</span>
          <h2
            className="font-display font-black text-3xl tracking-tight"
            style={{ color: 'var(--color-name)' }}
          >
            ATRIBUTOS
          </h2>
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>/ ATTRIBUTES</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
            {data.length} skills
          </span>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {data.map((stat, i) => (
            <StatCard key={stat.id ?? i} stat={stat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
