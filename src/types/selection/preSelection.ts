// 照片预选状态枚举
export enum PreSelectStatus {
  PENDING = 'pending', // 待处理
  SELECTED = 'selected', // 选中
  EXCLUDED = 'excluded', // 排除
}

export interface UpdatePreselectRequest {
  photos: {
    id: number
    status: PreSelectStatus
  }[]
}
