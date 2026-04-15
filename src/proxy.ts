import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleRequest = createMiddleware(routing)

export const proxy = handleRequest

export const config = {
  // Skip all paths that should not be internationalized.
  // This includes internal Next.js paths, Payload admin, and API.
  matcher: ['/((?!api|_next|_payload|admin|.*\\..*).*)'],
}
