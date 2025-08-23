import { LANDING_URL } from '@lib/config'
export default function AppFooter(){
  return (
    <footer className="border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickGig • <a href={LANDING_URL} className="underline">Website</a>
      </div>
    </footer>
  )
}
