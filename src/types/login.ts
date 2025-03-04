import type { ResponsePromise } from '@/types/common.ts'

interface IRefreshToken {
  access_token: string
}

export type IRefreshTokenResponse = ResponsePromise<IRefreshToken>
