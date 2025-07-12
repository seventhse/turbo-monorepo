# @vi-space/common-ui

`@vi-space/common-ui` is a collection of reusable UI components built on top of [shadcn-ui](https://ui.shadcn.com). It leverages Radix UI primitives, Tailwind CSS utility classes, and utility helpers from `@vi-space/utils` to provide a consistent and flexible design system.

## Technologies Used

- [shadcn-ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- React 19+
- TypeScript

## Installation

Install the package in your application (already linked via pnpm workspace):

```bash
pnpm install @vi-space/common-ui
```

## Usage

Import and use components in your React application:

```tsx
// Option 1: Import directly from the entry point
import { Button } from '@vi-space/common-ui'

// Option 2: Import from a specific path if needed
// import { Button } from '@vi-space/common-ui/ui/button'

export default function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
    </div>
  )
}
```

## Styling

### Using Tailwind CSS

To ensure proper styling, import the shared styles in your global stylesheet using Tailwind's `@import` syntax:

```css
@import "tailwindcss";
@import "@vi-space/common-ui/styles.css";
```

This imports all the necessary Tailwind CSS utilities used by the components.

### Importing Styles in TypeScript/JavaScript

If your build setup supports importing CSS directly (e.g., Vite, Next.js, webpack), you can import styles at the entry point of your app or component:

```ts
import '@vi-space/common-ui/styles.css'
```

This approach is convenient when you prefer to manage styles via JavaScript/TypeScript imports.

## Peer Dependencies

This package requires `react` and `react-dom` version 19 or higher to be installed in the host application.

---

For more information, visit the [shadcn-ui documentation](https://ui.shadcn.com).
