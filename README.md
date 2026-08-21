# PawpawFind

포포파인드 프론트엔드 레포지토리

## 기술 스택

### 현재 적용

- React 18
- TypeScript
- Vite
- pnpm
- ESLint
- TypeScript ESLint
- eslint-plugin-react-hooks
- eslint-plugin-jsx-a11y
- Prettier
- Husky
- lint-staged
- Vitest
- React Testing Library
- MSW
- GitHub Actions
- Axios
- TanStack Query

### 도입 예정

- React Router
- React Hook Form
- Zod
- Playwright
- Sentry

### 상태 관리 원칙

- 서버에서 가져오는 데이터는 TanStack Query로 관리합니다.
- 폼 상태는 React Hook Form으로 관리합니다.
- 컴포넌트 내부 상태는 React의 기본 상태 관리 기능을 사용합니다.
- 여러 화면에서 공유해야 하는 클라이언트 상태가 생길 때만 Zustand를 도입합니다.

### 품질 관리

- ESLint와 TypeScript를 통해 정적 분석을 수행합니다.
- Husky와 lint-staged로 커밋 전 staged 파일에 ESLint·Prettier를 자동 적용합니다.
- Vitest와 React Testing Library로 단위·통합 테스트를 작성합니다.
- MSW를 이용해 API 응답과 오류 상황을 재현합니다.
- Playwright로 로그인, 검색, 제보 등록 등 핵심 사용자 흐름을 검증합니다.
- GitHub Actions에서 lint, typecheck, test, build를 자동으로 실행합니다.

## 시작하기

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`.env.example`을 복사하면 개발 환경에서 MSW가 실행되어 백엔드 없이 목격 제보 목록을 확인할 수
있습니다.

## 스크립트

| 명령어               | 설명                       |
| -------------------- | -------------------------- |
| `pnpm dev`           | 개발 서버 실행             |
| `pnpm build`         | 타입 체크 후 프로덕션 빌드 |
| `pnpm preview`       | 빌드 결과 미리보기         |
| `pnpm lint`          | ESLint 검사                |
| `pnpm lint:fix`      | ESLint 자동 수정           |
| `pnpm format`        | Prettier로 코드 포맷팅     |
| `pnpm format:check`  | Prettier 포맷팅 검사       |
| `pnpm test`          | 통합 테스트 한 번 실행     |
| `pnpm test:watch`    | 변경을 감지하며 테스트     |
| `pnpm test:coverage` | 테스트 커버리지 확인       |
| `pnpm verify`        | 전체 품질 검사             |
