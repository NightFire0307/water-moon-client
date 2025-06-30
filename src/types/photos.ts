import type { ResponsePromise } from '@/types/common.ts'

export interface IPhoto {
  id: number
  file_name: string
  thumbnail_url: string
  original_url: string
  is_recommend: boolean
  remark?: string
}

export type IPhotoResponse = ResponsePromise<{
  current: number
  list: IPhoto[]
  total: number
  pageSize: number
}>
