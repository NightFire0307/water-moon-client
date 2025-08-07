import type { ResponsePromise } from '@/types/common/apiResponse'

export interface IPhoto {
  id: number
  fileName: string
  thumbnailUrl: string
  originalUrl: string
  isRecommend: boolean
  remark?: string
}

export type IPhotoResponse = ResponsePromise<{
  current: number
  list: IPhoto[]
  total: number
  pageSize: number
}>
