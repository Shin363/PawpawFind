import { useParams } from 'react-router'

export function MissingAnimalSearchResultPage() {
  const { searchId } = useParams<{ searchId: string }>()

  return (
    <main>
      <h1>실종 동물 찾기 결과</h1>
      <p>검색 ID: {searchId}</p>
    </main>
  )
}
