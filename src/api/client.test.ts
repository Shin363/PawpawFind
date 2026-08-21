import { describe, expect, it } from 'vitest'
import { apiClient } from './client'

describe('apiClient', () => {
  it('요청 제한 시간을 20초로 설정한다', () => {
    expect(apiClient.defaults.timeout).toBe(20_000)
  })
})
