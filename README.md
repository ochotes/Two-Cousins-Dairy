# Two Cousins Dairy

Herd management for a small family dairy farm — one animal, one full history.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Convex](https://convex.dev) for the database, live queries, and file storage (cow photos)
- [Convex Auth](https://labs.convex.dev/auth) (email + password) for the single admin login
- [Motion](https://motion.dev) for the count-up counters, feed slide-ins, and flash highlights

## Getting started

```bash
npm install
npx convex dev    # first run links/creates the Convex project and watches functions
npm run dev        # in a second terminal
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

## Admin account

There is no public sign-up — this is a single-admin app.

- **First-time setup:** create the one login by running
  ```bash
  npx convex run seed:seedAdmin '{"email":"you@example.com","password":"a-strong-password"}'
  ```
- **Changing your password day-to-day:** once signed in, use "Change
  Password" in the sidebar — it asks for your current password first.
- **Locked out / forgot it:** reset it from the CLI without needing the old
  one:
  ```bash
  npx convex run seed:forceSetPassword '{"email":"you@example.com","password":"a-new-password"}'
  ```

## Assets

`src/app/icon.jpg` (browser tab icon) and `public/cow.jpg` (login page)
are cropped from ["Jersey cow, close-up"](https://www.flickr.com/photos/87434398@N00/188474595/)
by Jared and Corin, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jersey_cow,_close-up.jpg),
licensed [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). Swap
either file for your own photo whenever you like — no license concerns once removed.

## Project layout

- `convex/schema.ts` — cows, vaccinations, heatEvents, calvings, activityLog
- `convex/*.ts` — queries/mutations, one file per domain area
- `src/app/(app)/` — authenticated pages behind the sidebar (Dashboard, Herd, Vaccinations, Breeding, Archive)
- `src/app/login/` — the sign-in page
- `src/components/` — UI primitives, layout, and page-level components
- `src/proxy.ts` — route protection (Convex Auth + Next.js middleware/proxy)
