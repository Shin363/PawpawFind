# ActiveSightingReportFilters

현재 적용된 목격 제보 필터를 제거 가능한 목록으로 보여준다. 각 항목은 삭제 동작이므로 선택 토글용
`SelectableChip`과 분리한다. 선택 없음에는 렌더링하지 않으며 filter 값/label 변환과 URL 상태는
부모 책임이다. 긴 label과 좁은 너비를 지원한다.
