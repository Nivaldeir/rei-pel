import { z } from 'zod'

export const LoginUser = z.object({
  email: z.string().email('Obrigatorio'),
  password: z.string().min(1, 'Obrigatorio'),
})
