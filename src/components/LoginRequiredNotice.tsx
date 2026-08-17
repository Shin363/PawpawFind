import { useNavigate } from 'react-router-dom'

interface LoginRequiredNoticeProps {
  message?: string
}

export function LoginRequiredNotice({
  message = '로그인이 필요한 기능이에요.',
}: LoginRequiredNoticeProps) {
  const navigate = useNavigate()

  return (
    <section style={{ padding: 40 }}>
      <button type="button" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← 뒤로가기
      </button>

      <h2>로그인이 필요해요</h2>
      <p>{message}</p>
      <button type="button" onClick={() => navigate('/mock-login')}>
        로그인하러 가기
      </button>
    </section>
  )
}
