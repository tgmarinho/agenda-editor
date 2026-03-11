import { createTRPCRouter } from '@/server/trpc';
import { templateRouter } from '@/server/routers/template';
import { designRouter } from '@/server/routers/design';
import { orderRouter } from '@/server/routers/order';

export const appRouter = createTRPCRouter({
  template: templateRouter,
  design: designRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
