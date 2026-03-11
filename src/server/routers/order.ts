import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { createOrderSchema } from '@/lib/validators';

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: calculate shipping, call Asaas for Pix
      return ctx.prisma.order.create({
        data: {
          ...input,
          userId: 'temp-user-id', // TODO: get from auth
          totalAmount: 0,
          shippingAmount: 0,
        },
      });
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.order.findMany({
      include: {
        design: { include: { template: true } },
        agendaConfig: { include: { mioloType: true, spiralColor: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: {
          design: { include: { template: true } },
          agendaConfig: { include: { mioloType: true, spiralColor: true } },
          address: true,
          user: true,
        },
      });
    }),

  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.enum(['PENDING_PAYMENT', 'PAID', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED']) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
