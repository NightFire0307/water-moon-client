import { createContext, useState } from 'react'
import { Home } from './views/home/home.tsx'
import './App.css'

// 当前模式是否为预览模式上下文
export const PreviewModeContext = createContext(false)

function App() {
  const [previewMode, setPreviewMode] = useState(false)

  return (
    <PreviewModeContext.Provider value={previewMode}>
      <Home />
    </PreviewModeContext.Provider>
  )
}

export default App
