interface ProgressDotsProps {
  currentStep: number
  totalSteps: number
}

function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <span className="text-darkBlueGray-400 text-sm">当前进度</span>
      <div className="flex items-center space-x-1">
        {
          Array.from({ length: totalSteps }).map((_, idx) => (
            <div className={`w-2 h-2 rounded-full ${currentStep - 1 === idx ? 'bg-cyan-500' : 'bg-darkBlueGray-600'}`} key={`progress-dot-step-${idx + 1}`}></div>
          ))
        }
      </div>
      <span className="text-darkBlueGray-300 text-sm font-medium">{`${currentStep}/${totalSteps}`}</span>
    </div>
  )
}

export default ProgressDots
