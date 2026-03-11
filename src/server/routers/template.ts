import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { createTemplateSchema } from '@/lib/validators';

export const templateRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.template.findMany({
        where: {
          ...(input?.category ? { category: input.category } : {}),
          ...(input?.isActive !== undefined ? { isActive: input.isActive } : { isActive: true }),
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const template = await ctx.prisma.template.findUnique({
        where: { slug: input.slug },
      });
      if (!template) throw new Error('Template not found');
      return template;
    }),

  create: publicProcedure
    .input(createTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.template.create({ data: input });
    }),

  update: publicProcedure
    .input(createTemplateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.template.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.template.delete({ where: { id: input.id } });
    }),
});
