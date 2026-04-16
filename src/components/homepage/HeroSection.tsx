'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ------------------------------------------------------------------ */
/* Defaults                                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_NAME = 'Mateo Ibagón'
const DEFAULT_ROLE = 'Full-Stack Developer · Musician · Arts Educator'
const DEFAULT_BIO =
  "Full-stack developer, jazz musician, and arts educator forging tools at the intersection of code and creativity. Currently building with Next.js + PayloadCMS · graduating from a Master's in Arts Education at Universidad Nacional de Colombia · keeping the forge burning."

const DEFAULT_STATS = [
  { statName: 'TypeScript',       value: 94 },
  { statName: 'Next.js',          value: 91 },
  { statName: 'React',            value: 90 },
  { statName: 'PayloadCMS',       value: 88 },
  { statName: 'Jazz Piano',       value: 85 },
  { statName: 'Music Production', value: 80 },
]

const DEFAULT_SOCIAL = [
  { label: 'GitHub',   url: 'https://github.com/teomago',          icon: 'Github'  },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/mateoibagon', icon: 'Linkedin'},
  { label: 'Mail',     url: 'mailto:teo.ibagon@gmail.com',         icon: 'Mail'    },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
function extractBioText(bio: any): string | null {
  if (!bio) return null
  if (typeof bio === 'string') return bio
  const root = bio?.root
  if (!root) return null
  const lines: string[] = []
  for (const child of root.children ?? []) {
    const text = (child.children ?? []).map((c: any) => c.text ?? '').join('')
    if (text) lines.push(text)
  }
  return lines.join(' ') || null
}

function isMusicStat(name: string) {
  return /jazz|music|piano|audio|sound|drum|guitar/i.test(name)
}

/* ------------------------------------------------------------------ */
/* Sub-component: animated stat bar                                     */
/* ------------------------------------------------------------------ */
function HeroStatBar({
  name,
  level,
  isMusic,
  delay,
}: {
  name: string
  level: number
  isMusic: boolean
  delay: number
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const pct    = Math.round((level / 99) * 100)

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[11px] text-muted uppercase tracking-wider">{name}</span>
        <span className={`font-mono text-[11px] ${isMusic ? 'text-green' : 'text-cyan'}`}>{level}</span>
      </div>
      <div className="relative h-1.5 bg-surface-elevated rounded-full overflow-visible">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${isMusic ? 'bg-green' : 'bg-cyan'}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay }}
        />
        {inView && (
          <motion.div
            className={`absolute top-0 bottom-0 w-0.5 rounded-full ${isMusic ? 'bg-green' : 'bg-cyan'}`}
            style={{
              left:      `calc(${pct}% - 1px)`,
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 1.0 }}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-component: social link button                                    */
/* ------------------------------------------------------------------ */
function SocialButton({ link }: { link: { label: string; url: string } }) {
  return (
    <motion.a
      href={link.url}
      target={link.url.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted tracking-widest uppercase
                 border border-border rounded-sharp
                 hover:border-cyan hover:text-cyan hover:bg-glow-cyan
                 transition-colors duration-200"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {link.label}
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */
export function HeroSection({
  hero,
  defaultAvatar,
}: {
  hero: any
  defaultAvatar: string
}) {
  const t = useTranslations('hero')

  const avatarUrl   = hero?.avatar?.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${hero.avatar.url}`
    : defaultAvatar
  const name        = hero?.name        || DEFAULT_NAME
  const role        = hero?.role        || DEFAULT_ROLE
  const bio         = extractBioText(hero?.bio) || DEFAULT_BIO
  const stats       = hero?.stats?.length      ? hero.stats       : DEFAULT_STATS
  const socialLinks = hero?.socialLinks?.length ? hero.socialLinks : DEFAULT_SOCIAL

  return (
    <section className="relative min-h-screen flex items-center border-b border-border overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '-10%',
          width: '60vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 py-24 relative z-10">
        {/* Character sheet label */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-3"
        >
          <span className="font-mono text-xs text-cyan">◈</span>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted">
            {t('character')}
          </span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-border-glow">TEOMAGO_v2.0</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* ─── LEFT — Avatar + Stats ─────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
            >
              <div
                className="relative w-full max-w-xs mx-auto lg:mx-0 aspect-square overflow-hidden rounded-sharp border border-border-glow shadow-avatar"
              >
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 320px"
                  priority
                />
                {/* Scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
                  }}
                />
                {/* Scan beam */}
                <div
                  className="absolute left-0 right-0 h-16 pointer-events-none"
                  style={{
                    background:  'linear-gradient(transparent, rgba(0,212,255,0.04), transparent)',
                    animation:   'scanline 5s linear infinite',
                  }}
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan" />
              </div>
            </motion.div>

            {/* Core stats panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="p-4 space-y-3 bg-surface border border-border rounded-sharp"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-green">◈</span>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted">
                  {t('coreStats')}
                </span>
              </div>
              {stats.slice(0, 6).map((stat: any, i: number) => (
                <HeroStatBar
                  key={i}
                  name={stat.statName ?? stat.name ?? 'Unknown'}
                  level={stat.value ?? stat.level ?? 75}
                  isMusic={isMusicStat(stat.statName ?? stat.name ?? '')}
                  delay={0.4 + i * 0.08}
                />
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT — Name, Role, Bio, Social ──────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-8 pt-2">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="font-mono text-xs tracking-[0.2em] uppercase text-muted"
            >
              {t('playerLabel')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display font-black leading-none tracking-tighter text-name"
              style={{
                fontSize:   'clamp(3rem, 8vw, 6rem)',
                textShadow: '0 0 60px rgba(0,212,255,0.12)',
              }}
            >
              {name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-xs text-cyan">▶</span>
              <p className="font-ui tracking-wider text-cyan" style={{ fontSize: '1.05rem' }}>
                {role}
              </p>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative p-5 bg-surface border border-border rounded-sharp"
            >
              <div className="absolute -top-2.5 left-4 px-2 font-mono text-[10px] tracking-widest uppercase text-muted bg-void">
                {t('bioLabel')}
              </div>
              <p className="font-body text-lg leading-relaxed text-foreground">{bio}</p>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-wrap gap-3"
            >
              {socialLinks.map((link: any, i: number) => (
                <SocialButton key={i} link={link} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
