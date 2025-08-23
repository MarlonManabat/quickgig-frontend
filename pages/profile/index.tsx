import ProfileForm from '@/components/forms/ProfileForm'

export default function ProfilePage() {
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Complete your profile</h1>
      <ProfileForm />
    </main>
  )
}
