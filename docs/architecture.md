# Architecture

PawpawFind 프론트엔드의 현재 구조와 코드 배치 기준을 정의합니다.

## 현재 구조

```text
src/
  api/          여러 기능이 공유하는 API 기반 코드
  components/   도메인에 종속되지 않는 공용 UI
  features/     기능과 도메인 단위 코드
  hooks/        여러 기능에서 재사용하는 훅
  styles/       전역 스타일과 디자인 토큰
  types/        여러 기능이 공유하는 타입
```

## 코드 배치 기준

### Feature first

페이지, 기능 전용 컴포넌트, 기능 전용 훅과 API는 `src/features/<feature>`에 먼저 둡니다. 한 곳에서만
사용하는 코드를 재사용 가능할 것이라는 예상만으로 공용 영역에 올리지 않습니다.

```text
src/features/<feature>/
  components/
  hooks/
  api/
  types.ts
  index.ts
```

폴더는 실제 필요한 경계만 만들며 빈 디렉터리를 미리 만들지 않습니다.

### Shared UI

`src/components`의 코드는 다음 조건을 만족해야 합니다.

- 특정 도메인 데이터나 API 응답 형태를 알지 않는다.
- 라우트와 제품 기능에 직접 의존하지 않는다.
- 두 곳 이상에서 실제로 재사용되거나 반복 근거가 명확하다.

공용 컴포넌트 작업은 `.claude/skills/design-system-component-workflow/SKILL.md`를 따르고 public API와
상태, 접근성을 spec에 먼저 기록합니다.

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

아직 해당 도구가 도입되지 않았다면 React 기본 기능으로 가장 작은 구현을 만들고, 실제 문제가 생긴
뒤 라이브러리를 추가합니다.

## 의존 방향

```text
app/page -> feature -> shared UI / shared API foundation
```

- 공용 UI가 feature를 import하지 않습니다.
- 공용 타입에 화면 컴포넌트나 라우트 타입을 섞지 않습니다.
- 순환 의존성을 만들지 않습니다.
- 배럴 export는 feature의 의도된 public API에만 사용합니다.

## 변경 원칙

- 구조 변경은 현재 문제와 영향을 먼저 기록합니다.
- 앱이 실제로 둘 이상 생기기 전에는 모노레포로 전환하지 않습니다.
- 공용 패키지 분리는 여러 소비자와 독립적인 변경·배포 필요성이 확인된 뒤 결정합니다.
