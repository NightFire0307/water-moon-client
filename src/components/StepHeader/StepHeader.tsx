interface StepHeaderProps {
  stepNumber: number
  stepTitle: string
  stepDesc: string
}

export function StepHeader({ stepNumber, stepTitle, stepDesc }: StepHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* 步骤编号 */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
        <span className="text-white text-lg font-bold">{stepNumber}</span>
      </div>

      {/* 步骤信息 */}
      <div>
        <h1 className="text-white text-lg font-bold my-0">{stepTitle}</h1>
        <p className="text-darkBlueGray-300 text-sm">{stepDesc}</p>
      </div>
    </div>
  )
}
