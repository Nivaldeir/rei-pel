import { z } from 'zod'

export const createSale = z.object({
  table: z.string(),
  code: z.string({ required_error: 'Code é obrigatorio' }),
  classification: z.string(),
  identification: z.string().optional(),
  name: z.string().optional(),
  razaoSocial: z.string().optional(),
  tell: z.string({ required_error: 'Telefone é obrigatorio' }),
  stateRegistration: z.string().optional(),
  state: z.string().optional(),
  city: z.string({ required_error: 'Cidade é obrigatorio' }),
  email: z.string({ required_error: 'Email é obrigatorio' }),
  isNewClient: z.boolean().optional().default(false),
  observation: z.string().optional(),
  conveyor: z.string({ required_error: 'Transporte é obrigatorio' }),
  planSell: z.string({ required_error: 'Condição é obrigatorio' }),
})