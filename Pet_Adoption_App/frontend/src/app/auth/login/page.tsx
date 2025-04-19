import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Sign in to your account</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}