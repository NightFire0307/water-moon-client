import { LoginForm } from './components/login-form.tsx'

export function Login() {
  return (
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              欢迎使用在线选片服务
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              请登录以开始挑选您的完美照片
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">捕捉精彩瞬间</h1>
            <p className="text-xl">轻松挑选，永久珍藏</p>
          </div>
        </div>
      </div>
    </div>
  )
}
