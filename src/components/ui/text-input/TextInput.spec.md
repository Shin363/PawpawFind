# TextInput

## 용도와 책임

label, 설명, 오류를 하나의 접근 가능한 계약으로 묶는 공용 한 줄 입력이다. 값과 validation은
사용처가 관리한다.

## Public API

```ts
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  containerClassName?: string
}
```

- native input 속성을 전달한다. `id`가 없으면 `useId`로 만든다.
- native `disabled`, `required`, controlled/uncontrolled 입력을 그대로 지원한다.

## 상태

- [x] default, filled, disabled, required
- [x] help text, invalid/error message
- [ ] icon slot, password 보기, 검색 지우기: 와이어프레임 근거가 없어 제외한다.

## 접근성과 키보드

- `label[for]`와 `input[id]`를 연결한다.
- 설명과 오류는 `aria-describedby`로 연결하며 오류가 있으면 `aria-invalid=true`를 전달한다.
- native text input의 키보드와 focus 동작을 유지하고 focus-visible outline을 표시한다.

## 반응형과 범위 밖

- 기본적으로 부모 너비를 채우고 긴 label/help/error 문구는 줄바꿈한다.
- API 요청, 제출, validation 규칙, React Hook Form은 다루지 않는다.

## 근거

- 와이어프레임의 제보 제목과 마이페이지 닉네임 입력.
