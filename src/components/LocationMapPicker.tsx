import { useRef, useState } from 'react'

interface LocationMapPickerProps {
  onLocationChange: (location: { areaName: string; lat: number; lng: number }) => void
}

// 카카오T 출발지 설정 방식: 핀은 화면 중앙 고정, 지도(배경)를 드래그해서 옮김
// TODO: 실제 카카오맵 SDK 붙이면 이 mock 드래그 로직 대신
//   kakao.maps.event.addListener(map, 'dragend', ...) 로 교체
//   좌표->주소 변환도 kakao.maps.services.Geocoder().coord2Address(...) 로 교체

const BASE_LAT = 37.5665
const BASE_LNG = 126.978
const PIXEL_TO_DEGREE = 0.00003 // mock 전용 임의 값. 실제 지도에선 SDK가 좌표를 직접 줌

function mockReverseGeocode(lat: number, lng: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const latDiff = lat - BASE_LAT
      const lngDiff = lng - BASE_LNG
      if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) {
        resolve('서울 마포구 연남동 인근')
      } else if (lngDiff > 0) {
        resolve('서울 마포구 동교동 인근')
      } else {
        resolve('서울 마포구 성산동 인근')
      }
    }, 250)
  })
}

export function LocationMapPicker({ onLocationChange }: LocationMapPickerProps) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isResolving, setIsResolving] = useState(false)
  const dragState = useRef<{
    startX: number
    startY: number
    startTx: number
    startTy: number
  } | null>(null)

  function handlePointerDown(event: React.PointerEvent) {
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startTx: translate.x,
      startTy: translate.y,
    }
    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!dragState.current) return
    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    setTranslate({ x: dragState.current.startTx + dx, y: dragState.current.startTy + dy })
  }

  async function handlePointerUp() {
    if (!dragState.current) return
    dragState.current = null

    const lat = BASE_LAT + translate.y * PIXEL_TO_DEGREE
    const lng = BASE_LNG - translate.x * PIXEL_TO_DEGREE

    setIsResolving(true)
    const areaName = await mockReverseGeocode(lat, lng)
    setIsResolving(false)
    onLocationChange({ areaName, lat, lng })
  }

  return (
    <div>
      <div
        style={{
          position: 'relative',
          height: 220,
          overflow: 'hidden',
          border: '1px solid #ccc',
          touchAction: 'none',
          cursor: 'grab',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-200px',
            backgroundImage:
              'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: `translate(${translate.x}px, ${translate.y}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            fontSize: 28,
          }}
        >
          📍
        </div>
      </div>
      <p>{isResolving ? '주소 확인 중...' : '지도를 움직여서 위치를 맞춰주세요'}</p>
    </div>
  )
}
