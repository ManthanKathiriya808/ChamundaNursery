# Modern UI Library Integration Guide

This project already uses Tailwind-style utility classes and Framer Motion. To add richer, accessible interactions and consistent components, here are two solid options and how to integrate them quickly.

## Option A: Radix UI (Recommended)

Radix UI provides headless, accessible primitives (dialogs, dropdowns, tooltips, etc.) that work great with Vite + Tailwind.

### Install core packages

```bash
npm i @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-accordion
```

Add others later as needed: `@radix-ui/react-toast`, `@radix-ui/react-popover`, `@radix-ui/react-hover-card`, etc.

### Add Tailwind animations (optional but recommended)

```bash
npm i tailwindcss-animate
```

In `tailwind.config.js`, include the plugin and keyframes used by Radix examples:

```js
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'overlay-show': { from: { opacity: 0 }, to: { opacity: 1 } },
        'content-show': { from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.98)' }, to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } },
      },
      animation: {
        'overlay-show': 'overlay-show 150ms ease-out',
        'content-show': 'content-show 180ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### Example: Dialog + DropdownMenu

Create a `ui` folder `src/components/lib` and drop small wrappers to keep styling consistent.

```jsx
// src/components/lib/Dialog.jsx
import * as Dialog from '@radix-ui/react-dialog'

export function AppDialog({ trigger, title, children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 animate-overlay-show" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-xl bg-white p-4 shadow-premium animate-content-show">
          {title && <Dialog.Title className="font-display text-lg">{title}</Dialog.Title>}
          <div className="mt-2">{children}</div>
          <Dialog.Close className="mt-4 inline-flex rounded-md border px-3 py-1.5 hover:bg-neutral-100">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

```jsx
// src/components/lib/Dropdown.jsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export function AppDropdown({ trigger, items = [] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={6} className="rounded-lg border border-neutral-200 bg-white shadow-premium p-1">
          {items.map((item, i) => (
            <DropdownMenu.Item key={i} className="px-3 py-2 rounded-md hover:bg-softGray/60 cursor-pointer">
              {item}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

Use anywhere:

```jsx
import { AppDialog } from '../components/lib/Dialog'
import { AppDropdown } from '../components/lib/Dropdown'
import { Button } from '../components/ui/Button' // optional

<AppDialog title="Care Tips" trigger={<button className="btn">Open</button>}>
  <p>Water weekly; bright, indirect light.</p>
  <a href="/care" className="link">Learn more</a>
</AppDialog>

<AppDropdown trigger={<button className="btn">Menu</button>} items={[
  'Profile', 'Orders', 'Logout',
]} />
```

### Why Radix UI here

- Headless primitives keep our Tailwind aesthetic intact.
- Accessibility is baked-in (focus management, ARIA, keyboard nav).
- Easy to animate with Framer Motion or CSS.

## Option B: shadcn/ui

shadcn/ui offers pre-styled React components built on Radix and Tailwind. It ships as copyable source files you own.

### Initialize

shadcn/ui is framework-agnostic; the CLI is often used in Next.js, but you can copy components manually into Vite.

1. Install peer deps if not already present:

```bash
npm i class-variance-authority tailwind-variants tailwindcss-animate
```

2. Create a `src/components/ui` directory and add the `Button`, `Input`, `Dialog`, `Sheet` components from the shadcn/ui website (copy-paste code). Adjust imports to `.jsx`.

3. Add a `lib/utils.js` with a `cn` utility:

```js
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
```

4. Align Tailwind config (same as Radix section) and ensure `content` paths include `src/**/*.{js,jsx}`.

### Usage

```jsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Chamunda Tips</DialogTitle>
    <p>Use well-draining soil; avoid overwatering.</p>
  </DialogContent>
</Dialog>
```

### Notes

- shadcn/ui examples are TS-first; convert to `.jsx` by removing types.
- Keep our palette by mapping shadcn `bg-primary`, `text-muted-foreground` to existing Tailwind classes.
- Use lucide-react icons in shadcn components for consistency.

## Rollout Plan

1. Start with shared primitives: `Dialog`, `Dropdown`, `Tooltip`.
2. Replace ad-hoc sheets/menus in Header with Radix/shadcn equivalents.
3. Gradually adopt Button/Input across pages for uniform states.
4. Add `Toast` for feedback on add-to-cart, save, and errors.

## Accessibility Checklist

- Ensure every interactive element has `focus-visible` styles.
- Provide `aria-label` or descriptive text for icon-only buttons.
- Confirm keyboard navigation paths for menus, dialogs, tabs, accordions.
- Respect `prefers-reduced-motion` with Motion variants already present.

---

Questions or prefer a different library (Mantine, MUI, Headless UI)? We can adapt the plan to match your preferences.