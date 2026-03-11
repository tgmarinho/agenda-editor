import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  category: z.enum(['feminina', 'masculina', 'profissional', 'elegante']),
  thumbnailUrl: z.string().url(),
  fullImageUrl: z.string().url(),
  suggestedLayout: z.object({
    namePosition: z.object({
      x: z.number(),
      y: z.number(),
      fontSize: z.number(),
      fontFamily: z.string(),
      color: z.string(),
    }),
    logoPosition: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
    }),
  }),
  price: z.number().int().positive(),
  sortOrder: z.number().int().default(0),
});

export const saveDesignSchema = z.object({
  templateId: z.string(),
  editorState: z.any(),
  userImageUrl: z.string().url().optional(),
  previewImageUrl: z.string().optional(),
});

export const agendaConfigSchema = z.object({
  designId: z.string(),
  mioloTypeId: z.string(),
  daysPerPage: z.union([z.literal(1), z.literal(2)]),
  calendarPosition: z.enum(['lateral', 'footer']),
  mioloColor: z.string(),
  spiralColorId: z.string(),
});

export const createOrderSchema = z.object({
  designId: z.string(),
  agendaConfigId: z.string(),
  addressId: z.string(),
});
