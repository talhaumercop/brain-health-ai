/**
 * Public routes (no authentication required)
 */
export const publicRoutes: string[] = [
  // Add public route paths here
]

/**
 * Protected routes (authentication required)
 */
export const protectedRoutes: string[] = [
  "/",
]

/**
 * Auth routes (login/signup pages)
 */
export const authRoutes: string[] = [
  "/auth/sign-in",
]

/**
 * API Auth prefix
 */
export const apiAuthPrefix: string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"