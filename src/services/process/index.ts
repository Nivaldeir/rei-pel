'use server'

import { ProductWithDetails } from '@/components/form/form-create-sale'
import { authNextOptions } from '@/config/auth-config'
import { CalculateDiscount } from '@/lib/utils'
import { Client } from '@prisma/client'
import axios from 'axios'
import { getServerSession } from 'next-auth/next'
import { db } from '../../lib/db'
import { createOrderCallisto } from '../callistor'
import { generatePdf } from '../pdf'
import { sendProducts } from './product'

type Props = {
  date: Date
  client: Omit<Client, 'userId'>
  table: 'table1' | 'table2' | 'table3'
  planSell: string
  observation: string
  transportant: string
  isNewClient: boolean
  products: ProductWithDetails[]
  id: string | null
}
export async function sendProcess({
  client,
  date,
  observation,
  planSell,
  products,
  table,
  isNewClient,
  transportant,
  id,
}: Props) {
  const session = (await getServerSession(authNextOptions)) as any
  const orders = products.map((p) => ({
    codigoProduto: p.code,
    quantidade: p.quantity,
    valor: p[p.table as 'table1' | 'table2' | 'table3'],
    bonificado: 'N',
    descontoPerc: p.discount,
  })) as [
    {
      codigoProduto: string
      quantidade: number
      valor: number
      bonificado: string
      descontoPerc: number
    },
  ]
  const { numeroPedido, codigoPedido, codigoPedidoEcommerce } =
    await createOrderCallisto({
      date,
      client,
      vendedor: session?.user?.representative!,
      observacaoPedido: observation ?? '',
      plano: planSell,
      transportadora: transportant,
      tabelaPreco: '1',
      orders,
    })
  const idFile = await generatePdf({
    client,
    user: session!.user!,
    date,
    products,
    observation,
    planSell,
    number: numeroPedido,
    transport: transportant,
  })
  const { ids, quantity } = await sendProducts({
    products,
  })
  const total = products.reduce((total, acc) => {
    return (
      total +
      CalculateDiscount({
        discount: acc.discount,
        quantity: acc.quantity,
        price: acc[acc.table],
      })
    )
  }, 0)
  const bodyRequest = {
    workflow: {
      start_event: 'Event_12ayq4t',
      whats: '',
      property_values: [
        {
          id: 'a0c093e0-e54a-11ee-a9f2-5fe5357cab11',
          value: numeroPedido,
        },
        {
          id: 'ac7d7db0-e54a-11ee-a9f2-5fe5357cab11',
          value: date,
        },
        {
          id: 'b5576bd0-e54a-11ee-a9f2-5fe5357cab11',
          value: total.toString(),
        },
        {
          id: 'db4aff50-e54a-11ee-a9f2-5fe5357cab11',
          value: quantity,
        },
        {
          id: '2af91960-e54b-11ee-a9f2-5fe5357cab11',
          value: session.user.representative,
        },
        {
          id: 'd4a26cc0-ec74-11ee-bdc5-1f81834439d2',
          value: session.user.email,
        },
        {
          id: '1093bc50-e600-11ee-95f4-e74d3ca411fb',
          value: client.code,
        },
        {
          id: '8d161f80-f6a8-11ee-89fa-0f79806dd97c',
          value: client.razaoSocial,
        },
        {
          id: '27fdc580-4608-11ef-85ae-4b07c6bfe166',
          value: isNewClient ? 'Sim' : 'Nao',
        },
        {
          id: '817acd60-e884-11ee-8384-6bbabc919fb2',
          value: client.identification,
        },
        {
          id: '8f40a370-e54b-11ee-a9f2-5fe5357cab11',
          value: planSell,
        },
        {
          id: '93a424a0-e54b-11ee-a9f2-5fe5357cab11',
          value: transportant,
        },
        {
          id: 'a8c08040-e54b-11ee-a9f2-5fe5357cab11',
          value: table,
        },
        {
          id: 'fd79f440-e54b-11ee-a9f2-5fe5357cab11',
          value: observation,
        },
        {
          "id": "3ef54230-60c1-11ef-ac4c-7d3713976fb8",
          "value": numeroPedido
        },
        ...ids,
      ],
      documents: [
        {
          usage_id: 'a8eaad00-eabb-11ee-8422-572674897009',
          file_id: idFile,
        },
      ],
      test: false,
    },
  }
  await axios({
    method: 'post',
    url: 'https://app-api.holmesdoc.io/v1/workflows/65f09b520e9ee4008b350546/start',
    data: bodyRequest,
    headers: {
      api_token: process.env.api_token!,
    },
  })

  if (id) {
    try {
      await db.productSale.delete({
        where: { id },
      })
    } catch (error) {}
  }
  console.log({
    codePedido: codigoPedido.toString(),
    codePedidoEcommerce: codigoPedidoEcommerce.toString(),
    numeroPedido: numeroPedido.toString(),
  })
  try {
    await db.productSale.create({
      data: {
        codePedido: codigoPedido.toString(),
        codePedidoEcommerce: codigoPedidoEcommerce.toString(),
        numeroPedido: numeroPedido.toString(),
        clientId: client.code,
        status: 'FINISH',
        product: {
          createMany: {
            data: products.map((p) => ({
              code: p.code,
              description: p.description,
              price: parseFloat(p[p.table]) * p.quantity,
              quantity: parseInt(p.quantity.toString()),
              discount: p.discount,
              productId: p.id,
            })),
          },
        },
        userId: session.user.id,
        obs: observation,
        planSale: planSell,
        transport: transportant,
      },
    })
  } catch (error: any) {
    console.log(error.message)
  }
  return {
    numeroPedido: numeroPedido,
  }
}
