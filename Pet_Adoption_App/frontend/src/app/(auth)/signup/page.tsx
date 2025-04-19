import SignupForm from "@/app/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Create your account</h2>
            </div>
            <SignupForm/>
    </div>
    </div>
  )
}
