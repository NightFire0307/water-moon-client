import { Tour } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { guideSteps } from './GuideConfig'

function GuideManager() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const storageKey = `guide_shown_v1_${location.pathname.replace('/', '').replace('-', '_')}`

  const steps = useMemo(() => {
    return guideSteps[location.pathname.replace('/', '')] || []
  }, [location.pathname])

  function handleGuidClose() {
    setOpen(false)
    localStorage.setItem(storageKey, 'true')
  }

  useEffect(() => {
    if (steps.length > 0 && !localStorage.getItem(storageKey)) {
      setTimeout(() => {
        setOpen(true)
      }, 300)
    }
  }, [steps, storageKey])

  if (steps.length === 0)
    return null

  return <Tour open={open} steps={steps} onClose={handleGuidClose} />
}

export default GuideManager
