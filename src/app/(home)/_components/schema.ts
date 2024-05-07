import { z } from "zod";

export enum EnumPlan {
  table1 = "Tabela 01",
  table2 = "Tabela 02",
  table3 = "Tabela 03",
}

export const createOrder = z.object({
  date: z.date(),
  client: z.object({
    id: z.string(),
    code: z.string(),
    identification: z.string(),
    name: z.string(),
    stateRegistration: z.string(),
    classification: z.string(),
    tell: z.string(),
  }),
  conveyor: z.string(),
  observation: z.string(),
  planSell: z.string(),
  tablePrice: z.object({
    table: z.string(),
    name: z.string(),
  }),
  products: z.array(
    z.object({
      product: z.object({
        id: z.string(),
        code: z.string(),
        description: z.string(),
        apres: z.string(),
        ipi: z.string(),
        table1: z.number(),
        table2: z.number(),
        table3: z.number(),
      }),
      discount: z.number().min(0).max(100),
      quantity: z.number().min(1),
      table: z.string(),
    })
  ),
});
