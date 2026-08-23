import type {
  ReportListApiItem,
  ReportListApiResponse,
  SightingReportDetail,
} from '@/features/sighting-reports/types'

const reportSeeds = [
  ['연남동 골목에서 갈색 중형견 봤어요', 'DOG', 'MEDIUM', '서울 마포구 연남동', 15],
  ['서교동 편의점 앞 흰 소형견', 'DOG', 'SMALL', '서울 마포구 서교동', 19],
  ['망원동 주차장 삼색 고양이', 'CAT', 'SMALL', '서울 마포구 망원동', 13],
  ['합정동 카페 앞 크림색 소형견', 'DOG', 'SMALL', '서울 마포구 합정동', 17],
  ['성산동 공원에서 검은 고양이를 봤어요', 'CAT', 'MEDIUM', '서울 마포구 성산동', 11],
  ['상암동 산책로를 배회하던 대형견', 'DOG', 'LARGE', '서울 마포구 상암동', 9],
  ['동교동역 근처 치즈 고양이', 'CAT', 'SMALL', '서울 마포구 동교동', 21],
  ['아현동 골목의 회색 중형견', 'DOG', 'MEDIUM', '서울 마포구 아현동', 7],
  ['신촌역 앞 목줄 없는 소형견', 'DOG', 'SMALL', '서울 서대문구 신촌동', 23],
  ['연희동 주택가에서 고양이 목격', 'CAT', 'MEDIUM', '서울 서대문구 연희동', 15],
  ['북가좌동 하천 주변 흰 고양이', 'CAT', 'SMALL', '서울 서대문구 북가좌동', 13],
  ['홍제동 놀이터 근처 갈색 강아지', 'DOG', 'SMALL', '서울 서대문구 홍제동', 17],
  ['응암동 시장 입구 대형견', 'DOG', 'LARGE', '서울 은평구 응암동', 19],
  ['증산동 골목에서 검은 고양이 발견', 'CAT', 'MEDIUM', '서울 은평구 증산동', 11],
  ['수색동 공원 벤치 주변 소형견', 'DOG', 'SMALL', '서울 은평구 수색동', 9],
] as const

export const sightingReportApiItems: ReportListApiItem[] = reportSeeds.map(
  ([title, species, size, happenPlace, eventHour], index) => {
    const day = String(23 - Math.floor(index / 2)).padStart(2, '0')
    return {
      reportId: index + 1,
      userId: 100 + index,
      reportType: 'FOUND',
      title,
      species,
      size,
      eventDate: `2026-08-${day}`,
      eventHour,
      happenPlace,
      latitude: 37.56 + index * 0.001,
      longitude: 126.92 + index * 0.001,
      description: '이용자가 등록한 목격 제보입니다.',
      status: 'OPEN',
      createdAt: `2026-08-${day}T12:00:00.000Z`,
      updatedAt: `2026-08-${day}T12:00:00.000Z`,
    }
  },
)

const pageSort = { empty: true, sorted: false, unsorted: true }

export function createSightingReportsPage(page: number, size: number): ReportListApiResponse {
  const start = page * size
  const content = sightingReportApiItems.slice(start, start + size)
  const totalPages = Math.ceil(sightingReportApiItems.length / size)

  return {
    totalPages,
    totalElements: sightingReportApiItems.length,
    size,
    content,
    number: page,
    sort: pageSort,
    pageable: {
      offset: start,
      sort: pageSort,
      paged: true,
      pageNumber: page,
      pageSize: size,
      unpaged: false,
    },
    numberOfElements: content.length,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
  }
}

export const sightingReportsFixture = createSightingReportsPage(0, 10)

export const sightingReportDetailsFixture: Record<string, SightingReportDetail> = {
  '1': {
    id: '1',
    title: '연남동 골목에서 갈색 중형견 봤어요',
    speciesLabel: '강아지',
    colorText: '갈색, 흰색',
    sizeLabel: '중형',
    areaText: '서울 마포구 연남동',
    dateText: '2026.08.23',
    timeBandText: '14–16시',
    coatLengthLabel: '중간',
    wearingText: '목줄 없음',
    behaviorText: '겁이 많음',
    photos: [],
    location: { lat: 37.5621, lng: 126.9253, radiusM: 300 },
    predictedRoute: [
      {
        id: 'route-1',
        areaText: '서울 마포구 연남동',
        dateTimeText: '2026.08.23 14–16시',
        description: '첫 목격 지점',
        kind: 'reported',
      },
      {
        id: 'route-2',
        areaText: '서울 마포구 서교동',
        dateTimeText: '2026.08.23 18–20시',
        description: '다른 제보와 특징이 일치',
        kind: 'matched',
      },
      {
        id: 'route-3',
        areaText: '서울 마포구 동교동 방향',
        dateTimeText: '2026.08.24 예상',
        description: '이동 방향으로 추정',
        kind: 'predicted',
      },
    ],
  },
}
