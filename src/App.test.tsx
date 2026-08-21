import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('서비스 이름을 제목으로 보여준다', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'PawpawFind' })).toBeInTheDocument()
  })
})
