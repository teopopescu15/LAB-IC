import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <LoginForm />
    </div>
  </div>
  ) 
}
