import type { CreateSightingRequest, Sighting } from './types'
import { toBackendPayload } from './mappers'

// TODO: 백엔드 API 확정되면 실제 fetch로 교체
// 발견 제보는 로그인 불필요 (API 명세서 명시) -> Authorization 헤더 없이 호출

const MOCK_DELAY_MS = 300

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function uploadPhoto(file: File): Promise<{ fileId: string }> {
  await delay(MOCK_DELAY_MS)
  return { fileId: `mock-file-${file.name}-${Date.now()}` }
}

export async function createSighting(request: CreateSightingRequest): Promise<Sighting> {
  await delay(MOCK_DELAY_MS)

  if (request.fileIds.length === 0) {
    throw new Error('사진을 1장 이상 첨부해주세요.')
  }

  const payload = toBackendPayload(request)
  console.log('[mock] 백엔드로 보낼 형태:', payload)

  return { id: `mock-sighting-${Date.now()}` }
}
