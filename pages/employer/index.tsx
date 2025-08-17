import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: { destination: '/employer/jobs', permanent: false },
  };
};

export default function EmployerIndex() {
  return null;
}
