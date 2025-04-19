import SignupForm from "@/app/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our pet adoption community
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
