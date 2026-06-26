import { authMiddleware } from '@clerk/nextjs'

export const runtime = 'nodejs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
  clockSkewInMs: 1000 * 60 * 5, // 5 minutes
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
