import { z } from 'zod'

export const client = z.object({
  id: z.string({ required_error: 'ID é obrigatorio' }).optional(),
  code: z.string({ required_error: 'Codigo é obrigatorio' }).optional(),
  identification: z
    .string({ required_error: 'CPNJ/CPF é obrigatorio' })
    .optional(),
  name: z.string({ required_error: 'Nome é obrigatorio' }).optional(),
  stateRegistration: z
    .string({
      required_error: 'Registro nacional é obrigatorio',
    })
    .optional(),
  classification: z
    .string({ required_error: 'Classificacao é obrigatorio' })
    .optional(),
  tell: z.string({ required_error: 'Telefone é obrigatorio' }),
  razaoSocial: z.string().optional(),
  city: z.string({ required_error: 'Cidade é obrigatorio' }),
  state: z.string({ required_error: 'Estado é obrigatorio' }),
  email: z.string({ required_error: 'Estado é obrigatorio' }),
})
