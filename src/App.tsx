import { Badge } from '@/components/ui/badge'

function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>PawpawFind</h1>
      <p>초기 프론트엔드 세팅이 완료되었습니다.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Badge>목격 제보</Badge>
        <Badge>유사도 높음</Badge>
      </div>
    </main>
  )
}

export default App
