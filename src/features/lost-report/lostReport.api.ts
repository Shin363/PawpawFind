import type { CreateLostReportRequest, LostReport } from './types'
import { toBackendPayload } from './mappers'

const MOCK_DELAY_MS = 300

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function uploadPhoto(file: File): Promise<{ fileId: string }> {
  await delay(MOCK_DELAY_MS)
  return { fileId: `mock-file-${file.name}-${Date.now()}` }
}

// 사진 올리면 AI가 품종을 추정해서 알려줌 (표 2.2 요구사항)
export async function inferBreedFromPhoto(fileId: string): Promise<{ guessedBreed: string }> {
  await delay(MOCK_DELAY_MS)
  const mockBreeds = ['말티즈', '푸들', '코리안숏헤어', '진돗개', '믹스견']
  const index = fileId.length % mockBreeds.length
  return { guessedBreed: mockBreeds[index] }
}

export async function createLostReport(request: CreateLostReportRequest): Promise<LostReport> {
  await delay(MOCK_DELAY_MS)

  if (request.fileIds.length === 0) {
    throw new Error('사진을 1장 이상 등록해주세요.')
  }
  const payload = toBackendPayload(request)
  console.log('[mock] 백엔드로 보낼 형태:', payload)
  return { id: `mock-lost-${Date.now()}` }
}
