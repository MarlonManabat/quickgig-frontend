import * as React from "react";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);
  return (
    <div>
      <div className="flex border-b border-brand-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${
              active === t.id
                ? "border-brand-primary text-brand-foreground"
                : "border-transparent text-brand-muted"
            }`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{current?.content}</div>
    </div>
  );
}
