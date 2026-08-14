import { useState } from 'react'
import { LocationMapPicker } from './LocationMapPicker'

interface LocationInputProps {
  onLocationChange: (location: {
    areaName: string
    lat: number
    lng: number
    detail: string
  }) => void
}

// 지도(드래그 방식)는 항상 펼쳐진 상태로 표시
// 현재 위치 버튼 / 검색은 지도 보정용 보조 수단

const MOCK_AREA_SUGGESTIONS = [
  { name: '서울 마포구 연남동', lat: 37.5665, lng: 126.978 },
  { name: '서울 마포구 연남로', lat: 37.5601, lng: 126.9252 },
  { name: '서울 마포구 동교동', lat: 37.5573, lng: 126.9254 },
  { name: '서울 마포구 성산동', lat: 37.566, lng: 126.9186 },
  { name: '서울 서대문구 연희동', lat: 37.5695, lng: 126.9366 },
]

function mockSearchAddress(query: string) {
  if (!query.trim()) return []
  return MOCK_AREA_SUGGESTIONS.filter((item) => item.name.includes(query))
}

export function LocationInput({ onLocationChange }: LocationInputProps) {
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedLat, setSelectedLat] = useState(37.5665)
  const [selectedLng, setSelectedLng] = useState(126.978)
  const [isLocating, setIsLocating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [detail, setDetail] = useState('')

  function emitChange(areaName: string, lat: number, lng: number, detailValue: string) {
    onLocationChange({ areaName, lat, lng, detail: detailValue })
  }

  function handleUseCurrentLocation() {
    setIsLocating(true)
    setTimeout(() => {
      const area = '서울 마포구 연남동 인근'
      setSelectedArea(area)
      setSelectedLat(37.5665)
      setSelectedLng(126.978)
      setIsLocating(false)
      emitChange(area, 37.5665, 126.978, detail)
    }, 500)
  }

  function handleSelectSuggestion(item: { name: string; lat: number; lng: number }) {
    const area = `${item.name} 인근`
    setSelectedArea(area)
    setSelectedLat(item.lat)
    setSelectedLng(item.lng)
    setSearchQuery('')
    setShowSearch(false)
    emitChange(area, item.lat, item.lng, detail)
  }

  function handleMapDragResult(location: { areaName: string; lat: number; lng: number }) {
    setSelectedArea(location.areaName)
    setSelectedLat(location.lat)
    setSelectedLng(location.lng)
    emitChange(location.areaName, location.lat, location.lng, detail)
  }

  function handleDetailChange(value: string) {
    setDetail(value)
    emitChange(selectedArea, selectedLat, selectedLng, value)
  }

  const suggestions = mockSearchAddress(searchQuery)

  return (
    <div>
      <LocationMapPicker onLocationChange={handleMapDragResult} />

      {selectedArea && <p>설정된 위치: {selectedArea}</p>}

      <button type="button" onClick={handleUseCurrentLocation} disabled={isLocating}>
        {isLocating ? '위치 확인 중...' : '현재 위치로 설정'}
      </button>

      <button type="button" onClick={() => setShowSearch((prev) => !prev)}>
        {showSearch ? '검색 닫기' : '다른 위치 검색'}
      </button>

      {showSearch && (
        <div>
          <input
            type="text"
            placeholder="동 이름을 입력해보세요 (예: 연남동)"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((item) => (
                <li key={item.name}>
                  <button type="button" onClick={() => handleSelectSuggestion(item)}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <label htmlFor="locationDetail">위치 상세 메모 (선택)</label>
      <textarea
        id="locationDetail"
        placeholder="예: 골목 안쪽 편의점 앞, 놀이터 근처 등"
        value={detail}
        onChange={(event) => handleDetailChange(event.target.value)}
      />

      <p>위치는 동 단위로만 공개돼요.</p>
    </div>
  )
}
