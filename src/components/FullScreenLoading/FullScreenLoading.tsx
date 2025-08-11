import { useFullScreenLoading } from './useFullScreenLoading'

function FullScreenLoading() {
  const { loadingState } = useFullScreenLoading()

  return (
    <>
      {
        loadingState.isLoading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkBlueGray-900/70 text-darkBlueGray-300 gap-8 z-[9999]">
            <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
            <span>{loadingState.message}</span>
          </div>
        )
      }
    </>
  )
}

export default FullScreenLoading
