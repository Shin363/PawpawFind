# SightingReportFilterPanel

목격 제보 목록의 도메인 필터 그룹과 초기화 동작을 표시한다. 선택 상태는 부모가 관리하고 panel은
`SelectableChip`을 조합한다. 그룹 펼침, URL 동기화, API query 변환은 현재 계약이 없어 제외한다.

지원 상태: 선택 없음/있음, disabled, 긴 option과 좁은 너비.

## 근거

- 저장소 근거: `docs/design-audit.md`의 "화면과 상태 인벤토리"와 "Feature 컴포넌트 인벤토리"
  섹션
- 확인된 흐름: 목격 제보 목록의 필터 열기, 그룹별 선택, 필터 초기화
- 원본 와이어프레임의 파일명과 무결성 정보는 `docs/design-audit.md`의 "조사 대상과 한계"에서
  관리한다.
