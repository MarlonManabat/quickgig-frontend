# Design Theme

## Color Tokens
- `brand.DEFAULT` `#111111`
- `brand.accent` `#16A34A`
- `brand.subtle` `#6B7280`
- `brand.bg` `#F9FAFB`
- `brand.card` `#FFFFFF`
- `brand.border` `#E5E7EB`
- `brand.danger` `#DC2626`

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
- **Card**: `.card`
- **Banner**: `banner-info`, `banner-success`, `banner-error`
- **Empty**: title + subtitle + action node
- **Spinner**: simple inline spinner

## Usage
Import from `@/components/ui`. Example:
```tsx
import Button from '@/components/ui/Button';

<Button>Click me</Button>
```

To add new screens, wrap content in `container-page` and reuse primitives for structure and feedback.
