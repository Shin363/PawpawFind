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

export function LocationInput({ onLocationChange }: LocationInputProps) {
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedLat, setSelectedLat] = useState(37.5665)
  const [selectedLng, setSelectedLng] = useState(126.978)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>(
    [],
  )
  const [isSearching, setIsSearching] = useState(false)

  const [showDetail, setShowDetail] = useState(false)
  const [detail, setDetail] = useState('')

  const [mapMoveTarget, setMapMoveTarget] = useState<{ lat: number; lng: number } | null>(null)

  function emitChange(areaName: string, lat: number, lng: number, detailValue: string) {
    onLocationChange({ areaName, lat, lng, detail: detailValue })
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 위치 가져오기를 지원하지 않아요.')
      return
    }

    setIsLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setSelectedLat(latitude)
        setSelectedLng(longitude)
        setIsLocating(false)
        setMapMoveTarget({ lat: latitude, lng: longitude })
      },
      () => {
        setIsLocating(false)
        setLocationError(
          '위치 권한을 허용해주세요. (브라우저 주소창 옆 자물쇠 아이콘에서 설정 가능)',
        )
      },
    )
  }

  function handleSearch() {
    if (!searchQuery.trim() || !window.kakao) return
    setIsSearching(true)

    const places = new window.kakao.maps.services.Places()
    places.keywordSearch(searchQuery, (result, status) => {
      setIsSearching(false)
      if (status === window.kakao!.maps.services.Status.OK) {
        setSearchResults(
          result.slice(0, 5).map((item) => ({
            name: item.place_name,
            lat: Number(item.y),
            lng: Number(item.x),
          })),
        )
      } else {
        setSearchResults([])
      }
    })
  }

  function handleSelectSuggestion(item: { name: string; lat: number; lng: number }) {
    setSelectedLat(item.lat)
    setSelectedLng(item.lng)
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
    setMapMoveTarget({ lat: item.lat, lng: item.lng })
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

  return (
    <div className="location-input-stack">
      <LocationMapPicker onLocationChange={handleMapDragResult} moveTo={mapMoveTarget} />

      <button
        type="button"
        className="location-action"
        onClick={handleUseCurrentLocation}
        disabled={isLocating}
      >
        {isLocating ? '위치 확인 중...' : '현재 위치로 설정'}
      </button>
      {locationError && <p className="error-text">{locationError}</p>}

      <button
        type="button"
        className="location-secondary-btn"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        {showSearch ? '검색 닫기' : '다른 위치 검색'}
      </button>
      {showSearch && (
        <div className="location-search-panel">
          <input
            type="text"
            placeholder="장소나 주소를 입력해보세요 (예: 연남동, 강남역)"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
          />
          <button type="button" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? '검색 중...' : '검색'}
          </button>
          {searchResults.length > 0 && (
            <ul className="location-suggestion-list">
              {searchResults.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <button type="button" onClick={() => handleSelectSuggestion(item)}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="button"
        className="location-secondary-btn"
        onClick={() => setShowDetail((prev) => !prev)}
      >
        {showDetail ? '상세 메모 닫기' : '위치 상세 메모 (선택)'}
      </button>
      {showDetail && (
        <div className="location-detail-panel">
          <textarea
            placeholder="예: 골목 안쪽 편의점 앞, 놀이터 근처 등"
            value={detail}
            onChange={(event) => handleDetailChange(event.target.value)}
          />
        </div>
      )}

      <p className="helper-text">위치는 동 단위로만 공개돼요.</p>
    </div>
  )
}
