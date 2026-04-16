import { vi } from 'vitest'

// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null
  rootMargin = ''
  thresholds = []
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})
