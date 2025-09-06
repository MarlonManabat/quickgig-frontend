import Header from "../_components/Header";
export default function Page() {
  return (
    <main className="p-6 space-y-3">
      <Header />
      <input placeholder="Job title" />
      <textarea placeholder="Describe the work" />
      <select data-testid="select-region">
        <option>Region A</option><option>Region B</option>
      </select>
      <select data-testid="select-city">
        <option>City A</option><option>City B</option>
      </select>
      <button data-testid="publish-button">Publish</button>
    </main>
  );
}
