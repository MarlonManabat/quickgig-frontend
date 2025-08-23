export default function NotFound(){
  return (
    <main className="min-h-[60vh] flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
        <a href="/" className="px-4 py-2 rounded bg-black text-white">Go home</a>
      </div>
    </main>
  )
}
