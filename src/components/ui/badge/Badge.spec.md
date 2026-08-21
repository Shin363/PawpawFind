# Badge

## 용도

출처(목격 제보/보호소)나 유사도 구간처럼, 짧은 보조 정보를 라벨로 표시한다.

## Public API

```ts
interface BadgeProps {
  children: React.ReactNode
}
```

## 상태

- [x] default (유일한 상태 — 배지는 정적 라벨이며 disabled/loading/error 상태를 갖지 않는다)

## 접근성

- role: 없음 (기본 `span`, 장식적 보조 텍스트)
- label: `children` 텍스트 자체가 라벨
- keyboard: 상호작용 없음, 포커스 대상 아님
- focus-visible: 해당 없음

## 참고

- 와이어프레임/Figma 링크: https://claude.ai/design/p/6c5747a2-9eae-4016-a2e5-b6a049902736
- 근거: 기능명세서 3.2 "연한 포인트(#FEF3E2) — 배지, 선택된 보조 칩" / MTR 유사도 구간 라벨 / SGD·CDD 출처 배지
- 색상 variant를 두지 않는다: 명세서에 유사도 구간별 배지 색상 차이가 정의돼 있지 않으므로,
  구간별 시각 구분이 필요해지면 그때 근거를 확인하고 추가한다.
