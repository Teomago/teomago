import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/homepage/HeroSection'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect } from 'vitest'

const messages = {
  hero: { character: 'Character Sheet', playerLabel: 'Player', coreStats: 'Core Stats', bioLabel: 'Bio' },
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="es" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

describe('HeroSection — properName fallback', () => {
  it('renders DEFAULT_PROPER_NAME subtitle when hero has no properName', () => {
    render(
      <Wrapper>
        <HeroSection hero={{ name: 'teomago' }} defaultAvatar="/avatar.jpg" />
      </Wrapper>
    )
    expect(screen.getByText('Mateo Ibagón')).toBeTruthy()
  })

  it('renders hero.properName when provided', () => {
    render(
      <Wrapper>
        <HeroSection hero={{ name: 'teomago', properName: 'Test Name' }} defaultAvatar="/avatar.jpg" />
      </Wrapper>
    )
    expect(screen.getByText('Test Name')).toBeTruthy()
  })
})
