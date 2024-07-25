// src/middleware/auth.ts
import { parseCookies } from 'nookies'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const token = parseCookies().petiko
  if (token) {
    return next()
  }
  return next({ path: '/' })
}
