export const AUTH_ACCESS_TOKEN_KEY = 'pawpawfind.accessToken'
const AUTH_USER_KEY = 'pawpawfind.authUser'

export interface AuthUser {
  userId: number
  nickname: string
  provider: string
}

export function getAccessToken() {
  return localStorage.getItem(AUTH_ACCESS_TOKEN_KEY)
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken)
}

export function getAuthUser(): AuthUser | null {
  const serializedUser = localStorage.getItem(AUTH_USER_KEY)
  if (!serializedUser) return null

  try {
    return JSON.parse(serializedUser) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
