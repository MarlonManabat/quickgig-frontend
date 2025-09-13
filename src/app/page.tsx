// Server component: optionally redirect "/" to "/browse-jobs"; default shows landing.
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import LandingPage from './(marketing)/landing/page';

export default function Root() {
  if (process.env.NEXT_PUBLIC_REDIRECT_HOME_TO_BROWSE === '1') {
    redirect(ROUTES.browseJobs);
  }
  return <LandingPage />;
}
