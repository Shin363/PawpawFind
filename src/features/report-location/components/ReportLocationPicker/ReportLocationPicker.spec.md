# ReportLocationPicker

## 책임

목격·실종 제보 입력에서 카카오 지도의 중심 위치를 장소와 WGS84 위·경도로 변환하는 feature
컴포넌트다. 지도 제공사와 제보 위치 입력 흐름을 알기 때문에 공용 UI primitive로 승격하지 않는다.

## Public API

```ts
interface ReportLocationValue {
  happenPlace: string
  latitude: string
  longitude: string
}

interface ReportLocationPickerProps {
  heading: string
  description: string
  value: ReportLocationValue
  onValueChange: (value: ReportLocationValue) => void
  appKey?: string
  className?: string
}
```

## 동작

- 기본 중심은 서울시청이지만 사용자가 지도를 이동하기 전에는 기본값을 폼에 저장하지 않는다.
- 지도 drag가 끝나면 중심의 위·경도를 읽고 카카오 `services.Geocoder.coord2Address`로 주소를
  조회한다.
- 도로명 주소가 있으면 우선 사용하고, 없으면 지번 주소를 사용한다.
- 주소 조회가 실패하더라도 좌표는 보존하고 사용자가 장소명을 직접 입력할 수 있게 한다.
- 장소명 입력은 좌표를 변경하지 않는다.
- 유효한 좌표를 외부에서 전달하면 해당 위치를 초기 중심으로 사용한다.

## 상태

- SDK loading / ready / missing key / load failure
- 주소 조회 중 / 조회 실패 / 선택 완료
- 장소명 입력 닫힘 / 열림
- 직접 좌표 입력 fallback

## 접근성

- 지도 영역은 이름이 있는 `region`으로 노출한다.
- SDK와 주소 조회 상태는 `aria-live="polite"`로 알린다.
- 장소명 입력 열기·닫기는 native `button`과 `aria-expanded`, `aria-controls`를 사용한다.
- 지도 사용이 어렵거나 SDK를 불러오지 못한 경우 native number input으로 좌표를 입력할 수 있다.

## 제외

- 현재 위치 권한 요청
- 장소 키워드 검색과 자동완성
- 지도에 여러 marker 표시
- 공개용 좌표 축약·마스킹
- 제보 생성 API 호출

## 근거

- 카카오 지도 Web API의 `Map`, `dragend`, `services.Geocoder.coord2Address`
- 목격 제보 입력과 실종 동물 찾기 입력의 공통 `happenPlace`, `latitude`, `longitude` 계약
