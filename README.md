# Dr Apple Kano — Mobile App

Expo SDK 57 + TypeScript + NativeWind shopping app for Dr Apple Phones, Farm Centre Kano. It shares the website's
catalogue, swap pricing rules and WhatsApp ordering
([AbdulEedah/original-dr-apple](https://github.com/AbdulEedah/original-dr-apple)), redesigned as a native mobile app.

## Run it

```bash
npm install
npx expo start          # press a (Android) or i (iOS), or scan the QR code with Expo Go
```

Checks: `npm run typecheck`, `npm run lint`, `npx expo-doctor`.

### Optional: Supabase

Fill in `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env` (see `.env.example`) so photo uploads
in the staff dashboard go to the `dr-apple-assets` bucket. Without them the app runs in demo mode and keeps all edits
on the device.

## App structure

| Screen | File |
| --- | --- |
| Home — banner, categories, featured, best value | `src/app/(tabs)/index.tsx` |
| Shop — search, category filters, sort, grid | `src/app/(tabs)/shop.tsx` |
| Swap — trade-in estimate and WhatsApp booking | `src/app/(tabs)/swap.tsx` |
| Store — contact, directions, how swapping works | `src/app/(tabs)/store.tsx` |
| Product page | `src/app/product/[id].tsx` |
| Staff dashboard (sign in, products, storefront, swap content, media, team) | `src/app/admin/*` |

Shared pieces: `src/components/ui` (design system: buttons, fields, lists, sheets, toasts), `src/lib/store.tsx`
(catalogue + CMS state), `src/lib/swap.ts` (trade-in pricing), `src/lib/catalog.ts` (categories, stock, sorting).

Design tokens (colours, type scale) live in `tailwind.config.js` and `src/components/ui/theme.ts`.
Shadows and press states: use `style={shadows.*}` and `active:` classes — NativeWind drops `Pressable` style
functions when `className` is set, and remounts views whose `shadow-*` class toggles.

Demo staff accounts: tap **Super Admin** or **Content Admin** on the sign-in screen (Store tab → Staff sign in).
