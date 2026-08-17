import type { TraitCategory, TraitSelections } from '../constants/traitCategories'

interface TraitToggleProps {
  categories: TraitCategory[]
  selections: TraitSelections
  onChange: (categoryKey: string, value: string | string[]) => void
}

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
        <div key={category.key} className="chip-row">
          {category.options.map((option) => (
            <button
              key={option}
              type="button"
              className="trait-chip"
              aria-pressed={isSelected(category, option)}
              onClick={() => handleOptionClick(category, option)}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
