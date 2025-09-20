import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Hindi nakita ang page.</h1>
      <p className="text-muted-foreground">Baka nailipat ang link o natanggal na ang gig.</p>
      <Button asChild>
        <a href="/browse-jobs">Bumalik sa Browse Jobs</a>
      </Button>
    </div>
  );
}
