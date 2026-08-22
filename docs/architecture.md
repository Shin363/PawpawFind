# Architecture

PawpawFind 프론트엔드의 현재 구조와 코드 배치 기준을 정의합니다.

## 현재 구조

```text
src/
  app/          앱 조립, provider, router와 전역 route 경계
  api/          여러 기능이 공유하는 API 기반 코드
  components/   도메인에 종속되지 않는 공용 UI
  features/     기능과 도메인 단위 코드
  hooks/        여러 기능에서 재사용하는 훅
  styles/       전역 스타일과 디자인 토큰
  types/        여러 기능이 공유하는 타입
```

`src/app`은 제품 feature를 조립하는 최상위 계층입니다. route path, 인증 guard, 앱 layout, 전역
provider를 이곳에서 관리하며 feature 내부 구현을 다시 export하지 않습니다.

## 코드 배치 기준

### Feature first

페이지, 기능 전용 컴포넌트, 기능 전용 훅과 API는 `src/features/<feature>`에 먼저 둡니다. 한 곳에서만
사용하는 코드를 재사용 가능할 것이라는 예상만으로 공용 영역에 올리지 않습니다.

```text
src/features/<feature>/
  pages/
  components/
  hooks/
  api/
  types.ts
  index.ts
```

폴더는 실제 필요한 경계만 만들며 빈 디렉터리를 미리 만들지 않습니다.

`pages`는 router가 직접 렌더링하는 feature 진입점입니다. page 아래에서 같은 feature의 components,
hooks, api를 조합하고 router 설정 자체는 알지 않습니다.

목격 제보와 실종 동물 찾기는 데이터와 사용자 흐름이 다르므로 각각 `sighting-reports`와
`missing-animal-search` feature로 분리합니다. `reports`처럼 두 도메인을 포괄할 수 있는 이름의
feature는 만들지 않습니다.

### Shared UI

`src/components`의 코드는 다음 조건을 만족해야 합니다.

- 특정 도메인 데이터나 API 응답 형태를 알지 않는다.
- 라우트와 제품 기능에 직접 의존하지 않는다.
- 두 곳 이상에서 실제로 재사용되거나 반복 근거가 명확하다.

공용 컴포넌트 작업은 `.claude/skills/design-system-component-workflow/SKILL.md`를 따르고 public API와
상태, 접근성을 spec에 먼저 기록합니다. 공용 승격 기준과 foundation 규칙은
`docs/design-system.md`, 와이어프레임에서 확인한 근거는 `docs/design-audit.md`를 따릅니다.

### Shared types and hooks

- 기능 내부에서만 쓰는 타입은 feature 가까이에 둡니다.
- 여러 기능이 같은 의미로 공유할 때만 `src/types`로 이동합니다.
- 커스텀 훅은 로직을 숨기기 위해 만들지 않고, 의미 있는 동작이 재사용될 때 추출합니다.

## 상태 경계

- 서버에서 받은 데이터와 요청 상태: 서버 상태 관리 계층
- URL에서 표현할 수 있는 검색·필터: URL 상태
- 한 컴포넌트 트리에서만 쓰는 값: React 로컬 상태
- 여러 화면이 공유하지만 서버에 없는 값: 필요성이 확인된 뒤 전역 클라이언트 상태
- 입력 폼 값: 폼 경계 내부 상태

서버 상태는 TanStack Query로 관리하고 HTTP 요청은 공용 Axios client를 사용합니다. 아직 도입되지
않은 다른 도구는 React 기본 기능으로 가장 작은 구현을 만들고, 실제 문제가 생긴 뒤 추가합니다.

## Router

- React Router Data Mode의 `createBrowserRouter`와 `RouterProvider`를 사용합니다.
- router 인스턴스와 route tree는 React render 밖의 `src/app/router`에서 한 번 생성합니다.
- route matching pattern은 `ROUTE_PATHS`, 실제 이동 URL은 `routeUrls`에서 관리합니다.
- 동적 segment를 만드는 함수는 값을 `encodeURIComponent`로 인코딩합니다.
- URL path는 page와 resource ID, search params는 필터·페이지·정렬 상태를 표현합니다.
- API 서버 상태는 계속 TanStack Query가 담당하며 현재 route loader/action으로 옮기지 않습니다.
- 인증 경계는 별도 router가 아니라 path가 없는 `RequireAuth` route와 `Outlet`으로 구성합니다.
- 미인증 redirect의 최종 로그인 UX는 아직 미정입니다. 현재는 홈으로 이동하며 `returnTo`를 route
  state에 보존합니다.

### 확정 route

| URL                       | 페이지                             | 인증 |
| ------------------------- | ---------------------------------- | ---- |
| `/`                       | 홈 placeholder                     | 공개 |
| `/sightings`              | 목격 제보 목록                     | 공개 |
| `/sightings/new`          | 목격 제보 입력 placeholder         | 공개 |
| `/sightings/:sightingId`  | 목격 제보 상세 placeholder         | 공개 |
| `/find`                   | 실종 동물 찾기 landing placeholder | 필요 |
| `/find/new`               | 실종 동물 찾기 입력 placeholder    | 필요 |
| `/find/results/:searchId` | 실종 동물 찾기 결과 placeholder    | 필요 |
| `/mypage`                 | 마이페이지 placeholder             | 필요 |

Browser history 기반 URL을 사용하므로 배포 서버는 파일이 없는 경로 요청에도 `index.html`을
반환하는 SPA fallback이 필요합니다.

## 의존 방향

```text
src/main.tsx -> src/app -> src/features/<feature> -> shared UI / shared API foundation
```

- 공용 UI가 feature를 import하지 않습니다.
- 공용 타입에 화면 컴포넌트나 라우트 타입을 섞지 않습니다.
- feature는 `src/app`이나 router를 import하지 않습니다.
- 순환 의존성을 만들지 않습니다.
- 배럴 export는 feature의 의도된 public API에만 사용합니다.

## 변경 원칙

- 구조 변경은 현재 문제와 영향을 먼저 기록합니다.
- 앱이 실제로 둘 이상 생기기 전에는 모노레포로 전환하지 않습니다.
- 공용 패키지 분리는 여러 소비자와 독립적인 변경·배포 필요성이 확인된 뒤 결정합니다.
