interface ButtonProps {
  children: React.ReactNode
}

export function Button({ children }: ButtonProps) {
  return <button type="button">{children}</button>
}
