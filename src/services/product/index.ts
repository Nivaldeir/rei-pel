'use server'
import { ProductWithDetails } from '@/components/form/form-create-sale'
import axios from 'axios'
type Props = {
  products: ProductWithDetails[]
}
export async function sendProducts({ products }: Props) {
  const ids: string[] = []
  let quantity = 0
  await Promise.all(
    products.map(async (p) => {
      quantity += parseInt(p.quantity.toString())
      const body = {
        instance: {
          property_values: [
            {
              id: '5fabcca0-e2fa-11ee-9d33-e5c678bada4e',
              value: p.description,
            },
            {
              id: 'c52131b0-e7c3-11ee-bdb9-9de69f878f6d',
              value: 'REFID',
            },
            {
              id: '54ddfdc0-e2fa-11ee-9d33-e5c678bada4e',
              value: p.code,
            },
            {
              id: '93872d20-e553-11ee-b639-bd28db73935e',
              value: p.apres,
            },
            {
              id: 'be301e70-e2fa-11ee-9d33-e5c678bada4e',
              value: p.ipi,
            },
            {
              id: '2d3609a0-e883-11ee-8b7f-bbe56b8f1c80',
              value: p.quantity,
            },
            {
              id: '2652e270-e883-11ee-8b7f-bbe56b8f1c80',
              value: p[p.table],
            },
            {
              id: '51443b50-e883-11ee-8b7f-bbe56b8f1c80',
              value: p[p.table] * quantity,
            },
            {
              id: '8deddf10-eab9-11ee-88d8-f33532d96c4c',
              value: p.discount,
            },
          ],
        },
      }
      const res = await axios({
        method: 'post',
        url: 'https://app-api.holmesdoc.io/v1/admin/entities/65f492d021c45100a240198c/instances',
        data: body,
        headers: {
          api_token: process.env.api_token!,
        },
      })
      const id = await res.data.id
      ids.push(id)
    }),
  )
  return {
    ids: ids.map((i) => ({
      id: '60234230-e54d-11ee-a9f2-5fe5357cab11',
      value: i,
    })),
    quantity,
  }
}
