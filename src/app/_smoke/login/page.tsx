import Header from "../_components/Header";
export default function Page() {
  return (
    <main className="p-6">
      <Header />
      <div data-testid="login-page">Login</div>
    </main>
  );
}
