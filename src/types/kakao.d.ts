export interface KakaoLatLng {
  getLat(): number
  getLng(): number
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void
  getCenter(): KakaoLatLng
}

export interface KakaoGeocoderAddress {
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
}

export interface KakaoGeocoderResult {
  address: KakaoGeocoderAddress
}

export interface KakaoPlaceResult {
  place_name: string
  x: string
  y: string
}

export interface KakaoPlacesService {
  keywordSearch(query: string, callback: (result: KakaoPlaceResult[], status: string) => void): void
}

export interface KakaoMapsNamespace {
  load(callback: () => void): void
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap
  LatLng: new (lat: number, lng: number) => KakaoLatLng
  event: {
    addListener(target: KakaoMap, type: string, handler: () => void): void
  }
  services: {
    Geocoder: new () => {
      coord2Address(
        lng: number,
        lat: number,
        callback: (result: KakaoGeocoderResult[], status: string) => void,
      ): void
    }
    Places: new () => KakaoPlacesService
    Status: { OK: string }
  }
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsNamespace }
  }
}
