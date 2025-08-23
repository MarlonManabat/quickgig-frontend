export default function AppFooter(){
  return (
    <footer className="border-t mt-10" aria-label="Footer">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickGig •{' '}
        <a href="https://quickgig.ph" className="underline">Visit website</a>
      </div>
    </footer>
  )
}
