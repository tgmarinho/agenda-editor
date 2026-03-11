import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { saveDesignSchema, agendaConfigSchema } from '@/lib/validators';

export const designRouter = createTRPCRouter({
  save: publicProcedure
    .input(saveDesignSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.design.create({ data: input });
    }),

  update: publicProcedure
    .input(saveDesignSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.design.update({ where: { id }, data });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.design.findUnique({
        where: { id: input.id },
        include: { template: true, agendaConfig: { include: { mioloType: true, spiralColor: true } } },
      });
    }),

  saveConfig: publicProcedure
    .input(agendaConfigSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.agendaConfig.upsert({
        where: { designId: input.designId },
        create: input,
        update: input,
      });
    }),

  getMioloTypes: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.mioloType.findMany();
  }),

  getSpiralColors: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.spiralColor.findMany({ where: { isActive: true } });
  }),
});
