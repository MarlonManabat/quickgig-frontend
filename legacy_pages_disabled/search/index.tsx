import { useEffect } from "react";
import { focusFromQuery } from "@/utils/focusTarget";

export default function SearchPage() {
  useEffect(() => {
    focusFromQuery("focus", { search: "#search-input" });
  }, []);

  return (
    <main className="p-4">
      <input id="search-input" data-testid="search" />
    </main>
  );
}
