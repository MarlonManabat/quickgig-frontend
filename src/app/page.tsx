// Server component: redirect "/" to the working product shell at "/browse-jobs".
import { permanentRedirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export default function Root() {
  permanentRedirect(ROUTES.browseJobs);
}
