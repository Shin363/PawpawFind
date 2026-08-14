// 동물 등록 폼 - 외형 특징 카테고리 (8/12 팀 스크린샷 기준)
// "행동" 카테고리는 스크린샷이 하단에서 잘려있어 4개 옵션까지만 반영됨 -> 확인 후 추가 예정

export interface TraitCategory {
  key: string
  label: string
  selectionType: 'single' | 'multi'
  options: string[]
}

export const TRAIT_CATEGORIES: TraitCategory[] = [
  {
    key: 'furLength',
    label: '털 길이',
    selectionType: 'single',
    options: ['짧음', '중간', '김', '짧게 깎임', '엉킴'],
  },
  {
    key: 'ears',
    label: '귀',
    selectionType: 'single',
    options: ['쫑긋', '접힘', '한쪽만 접힘', '끝 잘림'],
  },
  { key: 'tail', label: '꼬리', selectionType: 'single', options: ['김', '짧음', '말림', '없음'] },
  {
    key: 'faceEyes',
    label: '눈·얼굴',
    selectionType: 'multi',
    options: ['눈 색 다름', '코가 검정', '코가 분홍', '주둥이 흰 털'],
  },
  {
    key: 'wearing',
    label: '착용 중',
    selectionType: 'multi',
    options: ['목줄 없음', '목줄 있음', '하네스', '인식표', '옷'],
  },
  {
    key: 'condition',
    label: '몸 상태',
    selectionType: 'multi',
    options: ['다리 절뚝임', '말랐음', '털 빠짐', '상처 있음', '임신·수유 중'],
  },
  {
    key: 'behavior',
    label: '행동',
    selectionType: 'multi',
    // TODO: 스크린샷 하단이 잘려서 4개까지만 확인됨. 팀 확인 후 추가 옵션 반영
    options: ['사람 잘 따름', '경계심 강함', '겁이 많음', '짖음'],
  },
]

// 폼에서 관리할 선택 상태 형태: 단일선택은 string, 다중선택은 string[]
export type TraitSelections = Record<string, string | string[]>

export function createEmptyTraitSelections(): TraitSelections {
  const initial: TraitSelections = {}
  for (const category of TRAIT_CATEGORIES) {
    initial[category.key] = category.selectionType === 'single' ? '' : []
  }
  return initial
}
