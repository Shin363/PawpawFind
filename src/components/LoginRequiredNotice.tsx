interface LoginRequiredNoticeProps {
  message?: string
}

export function LoginRequiredNotice({
  message = '로그인이 필요한 기능이에요.',
}: LoginRequiredNoticeProps) {
  return (
    <section>
      <h2>로그인이 필요해요</h2>
      <p>{message}</p>
      <button type="button" disabled>
        로그인하러 가기 (라우터 연결 전)
      </button>
    </section>
  )
}
