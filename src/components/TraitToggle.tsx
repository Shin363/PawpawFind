import type { TraitCategory, TraitSelections } from '../constants/traitCategories'

interface TraitToggleProps {
  categories: TraitCategory[]
  selections: TraitSelections
  onChange: (categoryKey: string, value: string | string[]) => void
}

// 카테고리마다 selectionType이 'single'이면 하나만, 'multi'면 여러 개 선택 가능
// 버튼(토글) 형태 UI. 스타일은 와이어프레임 확정 후 입힐 예정, 지금은 동작만 확인
export function TraitToggle({ categories, selections, onChange }: TraitToggleProps) {
  function handleOptionClick(category: TraitCategory, option: string) {
    if (category.selectionType === 'single') {
      const current = selections[category.key]
      const next = current === option ? '' : option
      onChange(category.key, next)
      return
    }

    const current = selections[category.key]
    const currentList = Array.isArray(current) ? current : []
    const next = currentList.includes(option)
      ? currentList.filter((item) => item !== option)
      : [...currentList, option]
    onChange(category.key, next)
  }

  function isSelected(category: TraitCategory, option: string) {
    const current = selections[category.key]
    if (category.selectionType === 'single') {
      return current === option
    }
    return Array.isArray(current) && current.includes(option)
  }

  return (
    <div>
      {categories.map((category) => (
        <fieldset key={category.key}>
          <legend>
            {category.label} ({category.selectionType === 'single' ? '하나만' : '여러 개 선택 가능'}
            )
          </legend>
          {category.options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected(category, option)}
              onClick={() => handleOptionClick(category, option)}
            >
              {option}
            </button>
          ))}
        </fieldset>
      ))}
    </div>
  )
}
