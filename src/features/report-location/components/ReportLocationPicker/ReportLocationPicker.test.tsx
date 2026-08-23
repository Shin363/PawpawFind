import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadKakaoMaps } from '../../kakao/loadKakaoMaps'
import type {
  KakaoGeocoder,
  KakaoLatLng,
  KakaoMap,
  KakaoMapOptions,
  KakaoMapsApi,
} from '../../kakao/kakaoMaps.types'
import { ReportLocationPicker, type ReportLocationValue } from './ReportLocationPicker'

vi.mock('../../kakao/loadKakaoMaps', () => ({ loadKakaoMaps: vi.fn() }))

const initialValue: ReportLocationValue = {
  happenPlace: '',
  latitude: '',
  longitude: '',
}

function Example({ appKey = '' }: { appKey?: string }) {
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <ReportLocationPicker
        appKey={appKey}
        description="지도를 움직여 위치를 선택해주세요."
        heading="발견 장소"
        onValueChange={setValue}
        value={value}
      />
      <output data-testid="location-value">{JSON.stringify(value)}</output>
    </>
  )
}

describe('ReportLocationPicker', () => {
  beforeEach(() => {
    vi.mocked(loadKakaoMaps).mockReset()
  })

  it('키가 없으면 지도 요청 없이 장소와 좌표를 직접 입력할 수 있다', async () => {
    const user = userEvent.setup()
    render(<Example />)

    expect(loadKakaoMaps).not.toHaveBeenCalled()
    expect(screen.getByRole('region', { name: '발견 장소 지도' })).toBeInTheDocument()
    expect(screen.getByText(/카카오맵 키를 설정하면/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '입력' }))
    await user.type(screen.getByRole('textbox', { name: /장소명 또는 주소/ }), '연남동 골목')
    await user.type(screen.getByRole('spinbutton', { name: /위도/ }), '37.561')
    await user.type(screen.getByRole('spinbutton', { name: /경도/ }), '126.923')

    expect(screen.getByTestId('location-value')).toHaveTextContent(
      JSON.stringify({
        happenPlace: '연남동 골목',
        latitude: '37.561',
        longitude: '126.923',
      }),
    )
  })

  it('지도 이동이 끝나면 중심 좌표의 도로명 주소를 controlled value로 전달한다', async () => {
    let dragEndHandler: (() => void) | undefined
    let setMapCenter: ((position: KakaoLatLng) => void) | undefined

    class FakeLatLng implements KakaoLatLng {
      constructor(
        private readonly latitude: number,
        private readonly longitude: number,
      ) {}

      getLat() {
        return this.latitude
      }

      getLng() {
        return this.longitude
      }
    }

    class FakeMap implements KakaoMap {
      private center: KakaoLatLng

      constructor(container: HTMLElement, options: KakaoMapOptions) {
        container.dataset.mapReady = 'true'
        this.center = options.center
        setMapCenter = (position) => {
          this.center = position
        }
      }

      getCenter() {
        return this.center
      }

      relayout() {
        return undefined
      }

      setCenter(position: KakaoLatLng) {
        this.center = position
      }
    }

    class FakeGeocoder implements KakaoGeocoder {
      coord2Address(
        _longitude: number,
        _latitude: number,
        callback: Parameters<KakaoGeocoder['coord2Address']>[2],
      ) {
        callback(
          [
            {
              address: { address_name: '서울 마포구 연남동 1' },
              road_address: { address_name: '서울 마포구 동교로 27길 14' },
            },
          ],
          'OK',
        )
      }
    }

    const mapsApi: KakaoMapsApi = {
      LatLng: FakeLatLng,
      Map: FakeMap,
      event: {
        addListener: (_target, type, handler) => {
          if (type === 'dragend') dragEndHandler = handler
        },
        removeListener: () => undefined,
      },
      load: (callback) => callback(),
      services: {
        Geocoder: FakeGeocoder,
        Status: { OK: 'OK' },
      },
    }

    vi.mocked(loadKakaoMaps).mockResolvedValue(mapsApi)
    render(<Example appKey="test-key" />)

    await waitFor(() =>
      expect(screen.getByText('지도를 움직여 핀을 맞춰주세요.')).toBeInTheDocument(),
    )

    act(() => {
      setMapCenter?.(new FakeLatLng(37.5631234, 126.9256789))
      dragEndHandler?.()
    })

    await waitFor(() =>
      expect(screen.getByTestId('location-value')).toHaveTextContent(
        JSON.stringify({
          happenPlace: '서울 마포구 동교로 27길 14',
          latitude: '37.5631234',
          longitude: '126.9256789',
        }),
      ),
    )
  })
})
