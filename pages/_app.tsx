import type { AppProps } from 'next/app'
import Nav from '@/components/Nav'
import '../app/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  )
}
