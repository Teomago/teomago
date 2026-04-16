import type { CollectionConfig } from 'payload'

export const Stats: CollectionConfig = {
  slug: 'stats',
  labels: { singular: 'Stat', plural: 'Stats' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'category', 'level', 'updatedAt'],
  },
  defaultSort: '-level',
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      min: 1,
      max: 99,
      defaultValue: 75,
      admin: { description: '1–99. This is your RPG skill level.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Music', value: 'music' },
        { label: 'Audio Engineering', value: 'audio-engineering' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'Code',
      admin: {
        description: 'Lucide icon displayed next to the stat.',
      },
      options: [
        // Development
        { label: 'Code', value: 'Code' }, { label: 'Terminal', value: 'Terminal' },
        { label: 'Database', value: 'Database' }, { label: 'Server', value: 'Server' },
        { label: 'Cloud', value: 'Cloud' }, { label: 'Cpu', value: 'Cpu' },
        { label: 'Binary', value: 'Binary' }, { label: 'Braces', value: 'Braces' },
        { label: 'FileCode', value: 'FileCode' }, { label: 'Layers', value: 'Layers' },
        { label: 'Package', value: 'Package' }, { label: 'Globe', value: 'Globe' },
        { label: 'GitBranch', value: 'GitBranch' }, { label: 'Shield', value: 'Shield' },
        { label: 'Zap', value: 'Zap' }, { label: 'Activity', value: 'Activity' },
        // Music
        { label: 'Music', value: 'Music' }, { label: 'Music2', value: 'Music2' },
        { label: 'Headphones', value: 'Headphones' }, { label: 'Mic', value: 'Mic' },
        { label: 'Guitar', value: 'Guitar' }, { label: 'Piano', value: 'Piano' },
        { label: 'Drum', value: 'Drum' }, { label: 'AudioWaveform', value: 'AudioWaveform' },
        { label: 'Waves', value: 'Waves' }, { label: 'Sliders', value: 'Sliders' },
        // Art / Education
        { label: 'Palette', value: 'Palette' }, { label: 'Brush', value: 'Brush' },
        { label: 'Pen', value: 'Pen' }, { label: 'PenTool', value: 'PenTool' },
        { label: 'Brain', value: 'Brain' }, { label: 'GraduationCap', value: 'GraduationCap' },
        { label: 'BookOpen', value: 'BookOpen' }, { label: 'Lightbulb', value: 'Lightbulb' },
        // General
        { label: 'Star', value: 'Star' }, { label: 'Sparkles', value: 'Sparkles' },
        { label: 'Gem', value: 'Gem' }, { label: 'Flame', value: 'Flame' },
        { label: 'Coffee', value: 'Coffee' }, { label: 'Feather', value: 'Feather' },
      ],
    },
  ],
}
