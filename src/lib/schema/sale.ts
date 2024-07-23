import { z } from 'zod'

export const createSale = z.object({
  date: z.date(),
  tablePrice: z.object({
    table: z.enum(['table1', 'table2', 'table3']),
    name: z.string(),
  }),
  client: z.object({
    code: z.string(),
    classification: z.string().optional(),
    identification: z.string().optional(),
    name: z.string(),
    razaoSocial: z.string().optional(),
    tell: z.string(),
    stateRegistration: z.string().optional(),
    state: z.string().optional(),
    city: z.string(),
    email: z.string().email(),
  }),
  isNewClient: z.boolean().optional().default(false),
  products: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      description: z.string(),
      apres: z.string(),
      ipi: z.string(),
      table1: z.number(),
      table2: z.number(),
      table3: z.number(),
      discount: z.number(),
      quantity: z.number(),
      table: z.string(),
    }),
  ),
  observation: z.string().optional(),
  conveyor: z.string(),
  planSell: z.string(),
})
