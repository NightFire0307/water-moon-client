import type { ResponsePromise } from '@/types/common/apiResponse'

interface IRefreshToken {
  accessToken: string
}

export type IRefreshTokenResponse = ResponsePromise<IRefreshToken>
