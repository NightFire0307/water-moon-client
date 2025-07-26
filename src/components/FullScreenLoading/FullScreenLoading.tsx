import { useFullScreenLoading } from "./useFullScreenLoading"

function FullScreenLoading() {
  const { loading } = useFullScreenLoading()

  return (
    <>
      {
        loading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkBlueGray-900/70 z-50 text-darkBlueGray-300 gap-8">
            <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
            <span>订单信息加载中...</span>
          </div>
        )
      }
    </>
  )
}

export default FullScreenLoading
