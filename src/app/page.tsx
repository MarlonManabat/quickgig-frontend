// Server component: redirect "/" to the working product shell at "/browse-jobs".
import { redirect } from 'next/navigation';

export default function Root() {
  redirect('/browse-jobs');
}
