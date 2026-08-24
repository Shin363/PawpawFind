import { getAccessToken, getAuthUser } from '@/api/authToken'

export function useAuth() {
  return {
    isAuthenticated: Boolean(getAccessToken()),
    user: getAuthUser(),
  }
}
