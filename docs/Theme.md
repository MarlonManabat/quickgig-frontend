# Design Theme

## Color Tokens

| Token              | Value     | Usage              |
| ------------------ | --------- | ------------------ |
| `brand.primary`    | `#0ea5a3` | links & highlights |
| `brand.accent`     | `#facc15` | call to action     |
| `brand.muted`      | `#475569` | secondary text     |
| `brand.foreground` | `#0f172a` | base text color    |
| `surface.base`     | `#ffffff` | app background     |
| `surface.raised`   | `#f9fafb` | cards/sections     |

## Radii & Shadows

- `rounded-xl` `1rem`
- `rounded-2xl` `1.25rem`
- `shadow-soft` `0 8px 24px rgba(0,0,0,.08)`

## Typography

Default font stack: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`.

## UI Kit Components

All components live under `components/ui` and use the tokens above.

- `Button` – variants `primary`, `outline`, `subtle`, `destructive`
- `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Label`
- `Card`, `Badge`, `Tabs`, `Modal`, `Toast`
- `Table`, `EmptyState`, `Pagination`, `StatCard`

Example usage:

```tsx
import Button from "@/components/ui/Button";

<Button>Click me</Button>;
```

Use `Container` component for page gutters (`variant="form"` for ~700px forms).
