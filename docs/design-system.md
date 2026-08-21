# Design System

PawpawFind의 foundation과 공용 UI 경계를 정의합니다. 구체적인 화면 근거와 후보 목록은
`docs/design-audit.md`를 사용하고, 공용 컴포넌트 구현 절차는
`.claude/skills/design-system-component-workflow/SKILL.md`를 따릅니다.

## 원칙

- Claude Design 결과는 구현 명세가 아니라 반복 규칙을 찾는 증거로 사용합니다.
- foundation, primitive, feature를 분리합니다.
- 비슷하게 생겼다는 이유만으로 컴포넌트를 합치지 않습니다.
- 실제 사용 근거가 생기기 전에는 feature 가까이에 둡니다.
- 접근성과 상태를 한곳에서 보장할 가치가 있을 때 공용 primitive로 승격합니다.
- public API는 현재 확인된 요구만 지원하며 예상으로 variant를 추가하지 않습니다.

## 계층

### Foundation

색상, 글꼴, 간격, radius, shadow, motion처럼 여러 UI가 공유하는 시각 값입니다. 구현 위치는
`src/styles`입니다.

토큰으로 승격하려면 다음을 확인합니다.

- 두 곳 이상에서 같은 값과 같은 의미로 반복되는가?
- 이름이 특정 화면이나 컴포넌트에 종속되지 않는가?
- 값이 바뀔 때 함께 바뀌어야 하는 소비자가 있는가?

색상과 타이포그래피의 현재 source of truth는 `src/styles/tokens.css`입니다. spacing, radius, shadow는
감사 문서의 후보일 뿐 아직 확정 토큰이 아닙니다.

### Primitive

제품 데이터, API, route, analytics, 제품 문구를 모르는 공용 UI입니다. 구현 위치는
`src/components/ui`입니다.

다음 질문에 모두 답할 수 있을 때만 승격합니다.

- 실제로 두 군데 이상에서 반복되는가?
- 같은 props와 동작으로 사용할 수 있는가?
- 특정 페이지 데이터 없이 성립하는가?
- native HTML semantics와 키보드 동작을 공통으로 보장할 수 있는가?
- 상태별 디자인과 접근성 요구를 spec에 적을 수 있는가?

### Layout

콘텐츠 의미 없이 배치만 담당하는 공용 primitive입니다. 실제 반복이 확인되면
`src/components/layout`에 둡니다. 단순한 `div` 한 번을 감싸기 위해 만들지 않습니다.

### Feature

제품 데이터, 사용자 흐름, API, route 또는 제품 문구에 의존하는 UI입니다. 구현 위치는
`src/features/<feature>`입니다. 여러 화면에서 쓰이더라도 같은 도메인 책임을 가진다면 feature
컴포넌트로 유지합니다.

## Component contract

핵심 primitive와 상태가 복잡한 공용 컴포넌트는 구현 전에 `ComponentName.spec.md`를 작성합니다.

필수 항목:

- 용도와 책임
- public props
- 지원 상태와 지원하지 않는 상태
- native semantics
- keyboard와 focus-visible
- responsive behavior
- out of scope
- 근거가 된 화면 또는 기존 사용처

작은 정적 helper까지 모두 spec으로 만들지는 않습니다.

## 파일 구조

```text
src/
  components/
    ui/
      <kebab-case-name>/
        ComponentName.tsx
        ComponentName.css
        ComponentName.test.tsx
        ComponentName.spec.md
        index.ts
    layout/                    실제 반복이 생겼을 때만 추가
  features/
    <feature>/
      components/
  styles/
    tokens.css
```

- 공용 컴포넌트는 named export를 사용합니다.
- public prop type만 export합니다.
- feature 전용 helper와 내부 상태 타입은 export하지 않습니다.
- CSS는 가능한 한 기존 토큰을 사용하며 근거 없는 새 전역 토큰을 추가하지 않습니다.

## 승격 절차

1. Claude Design과 현재 코드에서 실제 반복 사용처를 찾습니다.
2. primitive, layout, feature 중 책임을 분류합니다.
3. 공용 후보라면 spec을 먼저 작성합니다.
4. 가장 작은 public API로 첫 사용처를 구현합니다.
5. 두 번째 사용처에서도 같은 계약이 성립하는지 확인합니다.
6. 상태별 접근성과 반응형 결과를 시각적으로 확인합니다.
7. 테스트와 `pnpm verify`를 통과시킵니다.

두 번째 사용처에서 prop 분기와 제품 문구가 늘어난다면 공용화가 잘못된 신호입니다. feature로
되돌리거나 서로 다른 컴포넌트로 분리합니다.

## Verification

- spec과 구현의 props·상태가 일치하는가?
- 지원하는 상태를 `*.stories.tsx`로 작성했는가?
- native element와 heading 구조가 적절한가?
- keyboard와 focus-visible을 확인했는가?
- disabled와 loading 중 중복 동작이 차단되는가?
- 긴 텍스트와 좁은 화면을 확인했는가?
- 현재 화면의 시각 회귀가 없는가?
- `pnpm verify`가 통과하는가?

공용 UI는 Storybook에서 상태를 독립적으로 확인하고 Chromatic에서 시각 변경을 검토합니다. Storybook
정적 빌드는 `pnpm verify`에 포함합니다. 새로운 시각 변경은 기준 이미지로 자동 승인하지 않고
Chromatic에서 의도한 변경인지 확인합니다.

## 자동화 기준

컴포넌트 수가 많다는 이유만으로 generator나 Skill을 추가하지 않습니다. 같은 파일 생성, spec 누락,
검증 누락이 반복적으로 발생해 문서만으로 방지하기 어려울 때 자동화를 도입합니다.
