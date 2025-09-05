import type { ResponsePromise } from '@/types/common/apiResponse'
import type { PreSelectStatus } from './selection/preSelection'

export interface IPhoto {
  id: number
  name: string
  ossKey: string
  ossUrlMedium: string
  ossUrlThumbnail: string
  preSelectStatus: PreSelectStatus
  expiresAt: number
  remark?: string
}

export type IPhotoResponse = ResponsePromise<{
  current: number
  list: IPhoto[]
  total: number
  pageSize: number
}>
