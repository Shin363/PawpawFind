import { useAuth } from '../../hooks/useAuth'
import { LoginRequiredNotice } from '../../components/LoginRequiredNotice'
import { LostReportForm } from './LostReportForm'

export function LostReportPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginRequiredNotice message="실종 동물을 등록하려면 먼저 로그인해주세요." />
  }

  return <LostReportForm />
}
