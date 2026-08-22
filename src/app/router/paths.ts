export const ROUTE_PATHS = {
  HOME: '/',
  SIGHTING_REPORTS: '/sightings',
  SIGHTING_REPORT_CREATE: '/sightings/new',
  SIGHTING_REPORT_DETAIL: '/sightings/:sightingId',
  MISSING_ANIMAL_SEARCH: '/find',
  MISSING_ANIMAL_SEARCH_FORM: '/find/new',
  MISSING_ANIMAL_SEARCH_RESULT: '/find/results/:searchId',
  MY_PAGE: '/mypage',
} as const

export const routeUrls = {
  home: () => ROUTE_PATHS.HOME,
  sightingReports: () => ROUTE_PATHS.SIGHTING_REPORTS,
  sightingReportCreate: () => ROUTE_PATHS.SIGHTING_REPORT_CREATE,
  sightingReportDetail: (sightingId: string) => `/sightings/${encodeURIComponent(sightingId)}`,
  missingAnimalSearch: () => ROUTE_PATHS.MISSING_ANIMAL_SEARCH,
  missingAnimalSearchForm: () => ROUTE_PATHS.MISSING_ANIMAL_SEARCH_FORM,
  missingAnimalSearchResult: (searchId: string) => `/find/results/${encodeURIComponent(searchId)}`,
  myPage: () => ROUTE_PATHS.MY_PAGE,
} as const
