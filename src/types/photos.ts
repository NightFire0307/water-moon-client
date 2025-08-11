import type { ResponsePromise } from '@/types/common/apiResponse'
import type { PreSelectStatus } from './selection/preSelection'

export interface IPhoto {
  id: number
  fileName: string
  thumbnailUrl: string
  originalUrl: string
  mediumUrl: string
  isRecommend: boolean
  preSelectStatus: PreSelectStatus
  remark?: string
}

export type IPhotoResponse = ResponsePromise<{
  current: number
  list: IPhoto[]
  total: number
  pageSize: number
}>
