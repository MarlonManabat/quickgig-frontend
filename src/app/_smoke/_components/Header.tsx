export default function Header() {
  return (
    <header className="p-4 flex gap-4">
      <a data-testid="nav-browse-jobs" data-cta="nav-browse-jobs" href="/browse-jobs">Browse jobs</a>
      <a data-testid="nav-my-applications" data-cta="nav-my-applications" href="/login?next=/applications">My Applications</a>
      <a data-testid="nav-post-job" data-cta="nav-post-job" href="/login?next=/post-job">Post a Job</a>
      <a data-testid="nav-tickets" data-cta="nav-tickets" href="/tickets/topup">Tickets</a>
      <a data-testid="nav-login" data-cta="nav-login" href="/login">Login</a>
      <button data-testid="nav-menu-button" onClick={() => {
        const m = document.getElementById('nav-menu');
        if (m) m.toggleAttribute('data-open');
      }}>Menu</button>
      <nav id="nav-menu" data-testid="nav-menu">
        <a data-testid="navm-browse-jobs" href="/browse-jobs">Browse jobs</a>
        <a data-testid="navm-my-applications" href="/login?next=/applications">My Applications</a>
        <a data-testid="navm-post-job" href="/login?next=/post-job">Post a Job</a>
        <a data-testid="navm-login" href="/login">Login</a>
      </nav>
    </header>
  );
}
