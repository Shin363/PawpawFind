export function useAuth() {
  return {
    // 실제 인증 연결 전까지 개발 서버에서는 보호 화면을 직접 확인할 수 있게 한다.
    isAuthenticated: import.meta.env.MODE === 'development',
  }
}
