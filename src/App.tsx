import { createContext, useState } from 'react'
import './App.css'

// 当前模式是否为预览模式上下文
export const PreviewModeContext = createContext(false)

function App() {
  const [previewMode, setPreviewMode] = useState(false)

  return (
    <PreviewModeContext.Provider value={previewMode}>

    </PreviewModeContext.Provider>
  )
}

export default App
