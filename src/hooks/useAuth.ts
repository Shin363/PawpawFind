// TODO: 진짜 로그인 기능 붙으면 이 mock 로직 전체를 실제 인증 상태 확인으로 교체
let mockIsLoggedIn = false

export function useAuth() {
  return {
    isAuthenticated: mockIsLoggedIn,
  }
}

export function mockLogin() {
  mockIsLoggedIn = true
}
