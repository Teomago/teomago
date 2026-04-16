'use client'
import { motion, type Variants } from 'framer-motion'
import type { Skill } from '@/payload-types'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 10, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
}

export function SkillsPanel({ skills }: { skills: Skill }) {
  const groups = skills?.groups ?? []

  return (
    <section className="py-24 border-b border-border bg-void-dark/50">
      <div className="container mx-auto px-6">
        {/* Section header: Void Forge Aesthetic */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs text-cyan animate-pulse">◈</span>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted">
            SYSTEM_SKILLS_v2.1
          </span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-10"
        >
          {groups?.map((group, gi) => (
            <div key={gi} className="space-y-4">
              <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-green border-l-2 border-green pl-3">
                {group.groupName}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {(group.categories ?? []).map((cat, ci) => (
                  <div key={ci} className="space-y-3">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-muted/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted/40 rotate-45" />
                      {cat.categoryName}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {(cat.items ?? []).map((item, ii) => (
                        <motion.span
                          key={ii}
                          variants={itemVariants}
                          whileHover={{ y: -1, borderColor: 'var(--color-cyan)', boxShadow: 'var(--shadow-glow-cyan)' }}
                          className="inline-flex items-center gap-2 px-3 py-1.5
                                     font-mono text-[10px] text-foreground/80
                                     bg-surface-elevated border border-border rounded-sharp
                                     hover:text-cyan transition-all duration-200 cursor-default"
                        >
                          <span className="w-1 h-1 bg-cyan/50" />
                          {item.itemName}
                          {item.level != null && (
                            <span className="text-[9px] text-cyan/40 tabular-nums">[{item.level}]</span>
                          )}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
