import AuthForm from '@/components/AuthForm'
export default function Page(){ return (
  <div className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
    <AuthForm mode="signup" />
  </div>
)}
