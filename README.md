# Dr Apple Kano — Mobile App

Expo SDK 57 + TypeScript + NativeWind port of the Dr Apple Phones Kano website
([AbdulEedah/original-dr-apple](https://github.com/AbdulEedah/original-dr-apple)), using the same
monochrome "Solène Fragrance" design, seed catalogue, swap pricing rules and WhatsApp checkout messages.

## Run it

```bash
npm install
npx expo start          # then press a (Android), i (iOS) or w (web), or scan the QR code with Expo Go
```

Other scripts: `npm run typecheck`, `npm run lint`, `npx expo-doctor`.

### Optional: Supabase

Copy `.env.example` to `.env` and fill in `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` to make the
Admin CMS image uploader store files in the `dr-apple-assets` bucket. Without them the app runs in demo mode:
all CMS edits persist on the device (AsyncStorage), just as the website persists them in localStorage.

## What's inside

| Website (Next.js)                         | App (Expo Router)                     |
| ----------------------------------------- | ------------------------------------- |
| `/` storefront                            | `src/app/index.tsx`                   |
| `/category/[slug]`                        | `src/app/category/[slug].tsx`         |
| `/admin/login`, `/admin`, `/admin/*`      | `src/app/admin/*.tsx`                 |
| `components/*` (Navbar, Hero, cards, modals, dock, footer) | `src/components/*`   |
| `lib/store.ts` (CMSStore)                 | `src/lib/store.tsx` (React context + AsyncStorage) |
| Swap valuation logic (in the modal)       | `src/lib/swap.ts`                     |

Mobile adaptations: `<select>` elements open a bottom-sheet picker, modals are bottom sheets, the admin sidebar is a
slide-out drawer, and wide admin tables scroll horizontally.

Demo admin logins: any email containing `admin@drapple` or `super` → Super Admin; `store` or `content` → Content Admin
(or use the Quick Demo buttons on the login screen).
