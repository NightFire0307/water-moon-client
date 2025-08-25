export interface UpdateProductSelectRequest {
  items: {
    orderProductId: number
    photos: {
      id: number
      remark?: string
    }[]
  }[]
}