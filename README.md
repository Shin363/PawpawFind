# PawpawFind

포포파인드 프론트엔드 레포지토리

## 기술 스택

### 현재 적용

- React 18
- React Router 7
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

| 명령어                 | 설명                         |
| ---------------------- | ---------------------------- |
| `pnpm dev`             | 개발 서버 실행               |
| `pnpm build`           | 타입 체크 후 프로덕션 빌드   |
| `pnpm preview`         | 빌드 결과 미리보기           |
| `pnpm lint`            | ESLint 검사                  |
| `pnpm lint:fix`        | ESLint 자동 수정             |
| `pnpm format`          | Prettier로 코드 포맷팅       |
| `pnpm format:check`    | Prettier 포맷팅 검사         |
| `pnpm test`            | 통합 테스트 한 번 실행       |
| `pnpm test:watch`      | 변경을 감지하며 테스트       |
| `pnpm test:coverage`   | 테스트 커버리지 확인         |
| `pnpm storybook`       | Storybook 로컬 실행          |
| `pnpm build-storybook` | Storybook 정적 빌드          |
| `pnpm chromatic`       | Storybook을 Chromatic에 배포 |
| `pnpm verify`          | 전체 품질 검사               |

## Storybook과 Chromatic

공용 UI와 아직 페이지 계약에 연결되지 않은 feature UI의 지원 상태는 Storybook에서 독립적으로
확인합니다. 전역 `tokens.css`는 `styles.css`를 통해 앱과 Storybook에 동일하게 적용됩니다.

```bash
pnpm storybook
```

Chromatic 배포를 사용하려면 Chromatic에서 이 GitHub 저장소의 프로젝트를 만든 뒤 GitHub Actions
저장소 secret에 발급받은 토큰을 등록합니다.

```text
CHROMATIC_PROJECT_TOKEN
```

토큰은 소스 코드나 `.env` 파일에 저장하지 않습니다. secret이 등록된 뒤 동일 저장소에서 만든 PR과
`main` push에서 Chromatic workflow가 Storybook을 배포하고 이전 기준 이미지와 시각 차이를
비교합니다. Fork 저장소에서 보낸 PR은 repository secret에 접근할 수 없으므로 배포 단계를
건너뜁니다. secret이 없는 경우에도 배포 단계만 건너뛰므로 일반 CI와 `pnpm verify`에는 영향을 주지
않습니다. 새 snapshot은 Chromatic 화면에서 의도한 변경인지 직접 확인한 뒤 승인합니다.

## 현재 UI 구조

- Foundation token: `src/styles/tokens.css`
- 공용 primitive: `src/components/ui`의 Button, Badge, SelectableChip, SegmentedControl, TextInput
- 목격 제보 목록 UI: `src/features/sighting-reports/components`의 목록 항목, 필터 panel, 적용 필터,
  pagination

공용 primitive는 제품 데이터나 API를 모르며, 목격 제보 문구와 흐름을 아는 UI는
`sighting-reports`, 실종 동물 찾기 흐름은 `missing-animal-search` feature에 둡니다. 자세한 승격
기준과 지원 상태는 `docs/design-system.md`, 와이어프레임 근거와 보류 항목은
`docs/design-audit.md`를 참고합니다.
