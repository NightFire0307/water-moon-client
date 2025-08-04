import type { ResponsePromise } from '@/types/common.ts'

interface IRefreshToken {
  accessToken: string
}

export type IRefreshTokenResponse = ResponsePromise<IRefreshToken>
