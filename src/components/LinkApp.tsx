import Link from 'next/link';
import { toAppPath } from '@/lib/urls';
type Props = React.ComponentProps<typeof Link> & { href: string };
export default function LinkApp({ href, ...rest }: Props) {
  return <Link href={toAppPath(href)} {...rest} />;
}
