export function useAuth() {
  return {
    // 실제 인증 상태 연결 전에는 미인증으로 처리한다.
    isAuthenticated: false,
  }
}
