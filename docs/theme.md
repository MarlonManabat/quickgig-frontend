# Design Theme

## Color Tokens
- `brand.DEFAULT` `#111827` – primary text
- `brand.bg` `#ffffff` – app background
- `brand.surface` `#f9fafb` – cards/surfaces
- `brand.accent` `#2563eb` – primary action
- `brand.accent-hover` `#1e40af`
- `brand.border` `#e5e7eb` – dividers
- `brand.subtle` `#6b7280` – muted text
- `brand.success` `#10b981`
- `brand.warning` `#f59e0b`
- `brand.danger` `#ef4444`
- `brand.info` `#3b82f6`

## Spacing
Use `container-page` for page padding. Components and sections rely on Tailwind spacing utilities with multiples of `4`.

## Typography
- `h1` `text-3xl` `font-bold`
- `h2` `text-2xl` `font-semibold`
- `h3` `text-xl` `font-semibold`
- Paragraphs `text-[15px]` `leading-6`

## Component Primitives
- **Button**: `.btn-*` variants (`primary`, `secondary`, `danger`)
- **Input**: `.input` with optional `as="textarea"`
- **Card**: `.card` using `bg-brand-surface` and `border-brand-border`
- **Banner**: `banner-info`, `banner-success`, `banner-error` map to feedback tokens
- **Empty**: title + subtitle + action node
- **Spinner**: simple inline spinner

## Usage
Import from `@/components/ui`. Example:
```tsx
import Button from '@/components/ui/Button';

<Button>Click me</Button>
```

To add new screens, wrap content in `container-page` and reuse primitives for structure and feedback.
