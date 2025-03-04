export interface Response<T> {
  code: number
  msg: string
  data: T
}

export type ResponsePromise<T> = Promise<Response<T>>
