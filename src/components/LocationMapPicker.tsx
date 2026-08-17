import { useCallback, useEffect, useRef, useState } from 'react'
import type { KakaoMap } from '../types/kakao'

interface LocationMapPickerProps {
  onLocationChange: (location: { areaName: string; lat: number; lng: number }) => void
  moveTo?: { lat: number; lng: number } | null
}

const DEFAULT_LAT = 37.5665
const DEFAULT_LNG = 126.978

export function LocationMapPicker({ onLocationChange, moveTo }: LocationMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<KakaoMap | null>(null)
  const [areaName, setAreaName] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const resolveAddress = useCallback(
    (lat: number, lng: number) => {
      if (!window.kakao) return
      setIsResolving(true)
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.coord2Address(lng, lat, (result, status) => {
        setIsResolving(false)
        if (status === window.kakao!.maps.services.Status.OK && result[0]) {
          const region = result[0].address
          const name = `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name} 인근`
          setAreaName(name)
          onLocationChange({ areaName: name, lat, lng })
        }
      })
    },
    [onLocationChange],
  )

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오맵 SDK를 불러오지 못했어요. index.html의 script 태그를 확인해주세요.')
      return
    }

    window.kakao.maps.load(() => {
      if (!mapContainerRef.current || !window.kakao) return

      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: 4,
      })
      mapRef.current = map
      setIsReady(true)

      window.kakao.maps.event.addListener(map, 'dragend', () => {
        const center = map.getCenter()
        resolveAddress(center.getLat(), center.getLng())
      })

      resolveAddress(DEFAULT_LAT, DEFAULT_LNG)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!moveTo || !mapRef.current || !window.kakao) return
    const newCenter = new window.kakao.maps.LatLng(moveTo.lat, moveTo.lng)
    mapRef.current.setCenter(newCenter)
    resolveAddress(moveTo.lat, moveTo.lng)
  }, [moveTo, resolveAddress])

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div ref={mapContainerRef} className="location-map" style={{ position: 'relative' }} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            fontSize: 32,
            zIndex: 10,
          }}
        >
          📍
        </div>
        {areaName && <div className="location-badge">{areaName}</div>}
      </div>
      <p className="map-hint">
        {!isReady
          ? '지도를 불러오는 중...'
          : isResolving
            ? '주소 확인 중...'
            : '지도를 움직여서 위치를 맞춰주세요'}
      </p>
      {areaName && !isResolving && (
        <p
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#111',
            marginTop: -4,
            marginBottom: 12,
          }}
        >
          선택한 위치: {areaName}
        </p>
      )}
    </div>
  )
}
