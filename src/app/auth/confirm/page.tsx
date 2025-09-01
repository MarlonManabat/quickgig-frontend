export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import ConfirmClient from './ConfirmClient';

export default function Confirm() {
  return <ConfirmClient />;
}
