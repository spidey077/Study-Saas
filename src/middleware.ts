import { authMiddleware } from '@clerk/nextjs'

export const runtime = 'nodejs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/dashboard', '/analytics', '/study-plan', '/subjects', '/pricing', '/onboarding', '/api/stripe/webhook'],
  clockSkewInMs: 1000 * 60 * 5, // 5 minutes
  debug: false,
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
