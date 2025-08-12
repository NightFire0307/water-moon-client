import type { FC } from 'react'
import PreSelect from '@/components/PreSelect/PreSelect'
import { useAutoSync } from '@/hooks/useAutoSync'

import { syncPreSelectedPhotos } from '@/services/photoSyncService'

const PreSelectPage: FC = () => {
  useAutoSync(syncPreSelectedPhotos, { delay: 30 })

  return (
    <PreSelect />
  )
}

export default PreSelectPage
