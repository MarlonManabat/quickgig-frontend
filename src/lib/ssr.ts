import type { GetServerSideProps } from 'next'

export const forceSSR: GetServerSideProps = async () => ({ props: {} })

