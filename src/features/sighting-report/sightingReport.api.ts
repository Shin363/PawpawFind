import type { CreateSightingRequest, Sighting } from './types'
import { toReportPayload, toFeaturePayloadsFromRequest } from './mappers'

const MOCK_DELAY_MS = 300

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function uploadPhoto(file: File): Promise<{ fileId: string }> {
  await delay(MOCK_DELAY_MS)
  return { fileId: `mock-photo-url-${file.name}-${Date.now()}` }
}

export interface StoredSighting extends CreateSightingRequest {
  id: string
  photoFiles: File[]
  createdAt: string
}

const mockSightingsStore: StoredSighting[] = []

export async function createSighting(
  request: CreateSightingRequest,
  photoFiles: File[],
): Promise<Sighting> {
  if (request.fileIds.length === 0) {
    throw new Error('사진을 1장 이상 첨부해주세요.')
  }

  const reportPayload = toReportPayload(request)
  const featurePayloads = toFeaturePayloadsFromRequest(request)

  await delay(MOCK_DELAY_MS)
  console.log('[mock] 1단계 POST /api/reports 로 보낼 형태:', reportPayload)
  console.log('[mock] 2단계 POST /api/report-photos 로 보낼 사진들:', request.fileIds)
  console.log('[mock] 3단계 POST /api/report-features 로 보낼 특징들:', featurePayloads)

  const id = `mock-sighting-${Date.now()}`
  const stored: StoredSighting = {
    ...request,
    id,
    photoFiles,
    createdAt: new Date().toISOString(),
  }
  mockSightingsStore.unshift(stored)

  return { id }
}

export async function getSightings(): Promise<StoredSighting[]> {
  await delay(200)
  return mockSightingsStore
}

export async function getSighting(id: string): Promise<StoredSighting | undefined> {
  await delay(200)
  return mockSightingsStore.find((s) => s.id === id)
}
