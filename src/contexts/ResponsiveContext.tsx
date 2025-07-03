import { createContext, type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'

interface ResponsiveContextType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const ResponsiveContext = createContext <ResponsiveContextType> ({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
})

export const useResponsive = () => useContext(ResponsiveContext)

export const ResponsiveProvider: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })

  const value = useMemo(
    () => ({ isMobile, isTablet, isDesktop }),
    [isMobile, isTablet, isDesktop],
  )

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  )
}
