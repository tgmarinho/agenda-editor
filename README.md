# Agenda Editor

Web app to design and order custom planner ("agenda") covers, then configure the planner interior and pay with Pix, all in one flow.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![tRPC](https://img.shields.io/badge/tRPC-11-2596BE?logo=trpc)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Fabric.js](https://img.shields.io/badge/Fabric.js-5-FF6F61)

## What it does

The app works like a focused, "simplified Canva" for planners. A customer picks a cover template, personalizes it, sets up the planner interior, sees a preview, and buys, without going back and forth with a designer.

- **Cover catalog.** Browse templates filtered by category (feminine, masculine, professional, elegant). Templates, prices, and active state live in the database.
- **Cover editor (Fabric.js).** Pick a template as a locked background, upload a logo and move or resize it, add the customer name as editable text, change font and color, and undo/redo edits.
- **Decorative fonts.** Loads several Google Fonts for the name (Great Vibes, Dancing Script, and more) on demand.
- **Print export.** Exports the cover to a high resolution PNG sized for print.
- **Planner interior configurator.** Choose the interior type (Commercial, Classic, Legal), days per page (1 or 2), calendar position (side or footer), paper color, and spiral color. Available colors change with the interior type.
- **3D preview.** Animated flipbook preview (react-pageflip) that shows the custom cover and lets you flip through pages, with swipe on mobile.
- **Checkout with Pix.** Login and sign up, shipping address form, and a Pix charge created through the Asaas payment API with QR code and copy-and-paste code.
- **Order tracking.** Customer pages for "my designs" and "my orders" with an order status flow (pending payment, paid, in production, shipped, delivered, cancelled).
- **Admin area.** List orders by status and manage templates.
- **Email.** Transactional email through Resend.

> Note: this is an in-progress project. Some pieces are scaffolded (for example, the Asaas webhook handler logs events but does not process them yet). See `docs/` and `RESUMO_IMPLEMENTACAO.md` for the current sprint status.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Canvas editor | Fabric.js, html2canvas |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI |
| State | Zustand, TanStack Query |
| API | tRPC v11 |
| ORM / database | Prisma 5 + PostgreSQL (Supabase) |
| Auth and storage | Supabase Auth, Supabase Storage |
| Payments | Asaas (Pix) |
| Email | Resend |
| 3D preview | react-pageflip |

There is no Python service in this project. The only Python files live under `.agents/skills/`, which is agent tooling and not part of the app.

## Run locally

This repo uses **pnpm**.

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local and fill in the credentials
#    DATABASE_URL, DIRECT_URL
#    NEXT_PUBLIC_SUPABASE_URL and Supabase keys
#    ASAAS_API_KEY (and optional ASAAS_BASE_URL, defaults to sandbox)
#    RESEND_API_KEY

# 3. Run the database migrations
pnpm prisma migrate dev

# 4. Seed the database (templates, interior types, spiral colors)
pnpm prisma db seed

# 5. Start the dev server
pnpm dev
```

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # eslint
```

## Project layout

```
src/
  app/            App Router routes (public, auth, dashboard, admin, api)
  features/       editor, agenda-config, preview
  server/         tRPC routers and services (asaas, email)
  components/     UI and feature components (shadcn/ui in components/ui)
  lib/            prisma, supabase, trpc, validators
  store/          Zustand stores
prisma/           schema, migrations, seed
docs/             PRD, plan, tasks, and sales material
```
