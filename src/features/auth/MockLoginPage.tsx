import { useNavigate } from 'react-router-dom'
import { mockLogin } from '../../hooks/useAuth'

export function MockLoginPage() {
  const navigate = useNavigate()

  function handleMockLogin() {
    mockLogin()
    navigate('/report/lost')
  }

  return (
    <section style={{ padding: 40 }}>
      <button type="button" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← 뒤로가기
      </button>

      <h2>로그인 (임시 화면)</h2>
      <p>실제 로그인 기능은 아직 없어요. 아래 버튼을 누르면 로그인했다고 가정하고 넘어가요.</p>
      <button type="button" onClick={handleMockLogin}>
        로그인하고 실종 등록으로 이동
      </button>
    </section>
  )
}
