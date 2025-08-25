import type { GetServerSideProps } from 'next';
/** Forces SSR without doing anything at build time. Safe for any page. */
export const forceSSR: GetServerSideProps = async () => ({ props: {} });

