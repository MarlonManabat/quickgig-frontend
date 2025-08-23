export default function Error500(){
  return (
    <main className="min-h-[60vh] flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
        <a href="/" className="px-4 py-2 rounded bg-black text-white">Back home</a>
      </div>
    </main>
  )
}
