# SightingReportListItem

목격 제보 목록의 한 항목을 제목, 종류, 장소, 날짜, 특징 태그로 요약한다. API 타입을 늘리지 않고
feature-local view model을 받는다. 상세 이동 계약이 있는 사용처만 `onSelect`를 전달하며, 그때 전체
항목이 native button이 된다. 이미지 URL·오류 처리와 상세 route는 계약이 없어 제외한다.

지원 상태: 기본, 긴 문구, 태그 유무, 선택 가능. loading/error/empty는 목록 화면의 책임이다.
