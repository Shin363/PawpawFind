interface KakaoLatLng {
  getLat: () => number
  getLng: () => number
}

interface KakaoMapOptions {
  center: KakaoLatLng
  level: number
}

interface KakaoMap {
  getCenter: () => KakaoLatLng
  relayout: () => void
  setCenter: (position: KakaoLatLng) => void
}

interface KakaoAddressResult {
  address: { address_name: string } | null
  road_address: { address_name: string } | null
}

type KakaoAddressSearchCallback = (result: readonly KakaoAddressResult[], status: string) => void

interface KakaoGeocoder {
  coord2Address: (longitude: number, latitude: number, callback: KakaoAddressSearchCallback) => void
}

interface KakaoMapsApi {
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap
  event: {
    addListener: (target: KakaoMap, type: string, handler: () => void) => void
    removeListener: (target: KakaoMap, type: string, handler: () => void) => void
  }
  load: (callback: () => void) => void
  services: {
    Geocoder: new () => KakaoGeocoder
    Status: { OK: string }
  }
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsApi }
  }
}

export type {
  KakaoAddressResult,
  KakaoGeocoder,
  KakaoLatLng,
  KakaoMap,
  KakaoMapOptions,
  KakaoMapsApi,
}
