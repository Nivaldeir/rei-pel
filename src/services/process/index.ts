'use server'

import { ProductWithDetails } from '@/components/form/form-create-sale'
import { authNextOptions } from '@/config/auth-config'
import { CalculateDiscount } from '@/lib/utils'
import { Client } from '@prisma/client'
import axios from 'axios'
import { getServerSession } from 'next-auth/next'
import { db } from '../../lib/db'
import { createOrderCallisto } from '../callistor'
import { Generate } from '../pdf'
// import { generatePdf, sendFilePdf } from '../pdf'
import { sendProducts } from '../product'

type Props = {
  date: Date
  total: number
  client: Client
  table: 'table1' | 'table2' | 'table3'
  planSell: string
  observation: string
  transportant: string
  isNewClient: boolean
  products: ProductWithDetails[]
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
  // const { numeroPedido, codigoPedido, codigoPedidoEcommerce } =
  //   await createOrderCallisto({
  //     date,
  //     client,
  //     vendedor: session?.user?.representative!,
  //     observacaoPedido: observation ?? '',
  //     plano: planSell,
  //     transportadora: transportant,
  //     tabelaPreco: '1',
  //     orders,
  //   })
  Generate()
  // const nameFile = await generatePdf({
  //   client,
  //   user: session!.user!,
  //   date,
  //   products,
  //   observation,
  //   planSell,
  //   number: "151",
  //   transport: transportant,
  // })
  // const idFile = await sendFilePdf(nameFile)
  // const { ids, quantity } = await sendProducts({
  //   products,
  // })
  // const total = products
  //   .reduce((total, acc) => {
  //     return (
  //       total +
  //       CalculateDiscount({
  //         discount: acc.discount,
  //         quantity: acc.quantity,
  //         price: acc[acc.table],
  //       })
  //     )
  //   }, 0)
  //   .toLocaleString('pt-BR')
  // const bodyRequest = {
  //   workflow: {
  //     start_event: 'Event_12ayq4t',
  //     whats: '',
  //     property_values: [
  //       {
  //         id: 'a0c093e0-e54a-11ee-a9f2-5fe5357cab11',
  //         value: numeroPedido,
  //       },
  //       {
  //         id: 'ac7d7db0-e54a-11ee-a9f2-5fe5357cab11',
  //         value: date,
  //       },
  //       {
  //         id: 'b5576bd0-e54a-11ee-a9f2-5fe5357cab11',
  //         value: total.toString(),
  //       },
  //       {
  //         id: 'db4aff50-e54a-11ee-a9f2-5fe5357cab11',
  //         value: quantity,
  //       },
  //       {
  //         id: '2af91960-e54b-11ee-a9f2-5fe5357cab11',
  //         value: session.user.representative,
  //       },
  //       {
  //         id: 'd4a26cc0-ec74-11ee-bdc5-1f81834439d2',
  //         value: session.user.email,
  //       },
  //       {
  //         id: '1093bc50-e600-11ee-95f4-e74d3ca411fb',
  //         value: client.code,
  //       },
  //       {
  //         id: '8d161f80-f6a8-11ee-89fa-0f79806dd97c',
  //         value: client.razaoSocial,
  //       },
  //       { id: '27fdc580-4608-11ef-85ae-4b07c6bfe166', value: isNewClient },
  //       {
  //         id: '817acd60-e884-11ee-8384-6bbabc919fb2',
  //         value: client.identification,
  //       },
  //       {
  //         id: '8f40a370-e54b-11ee-a9f2-5fe5357cab11',
  //         value: planSell,
  //       },
  //       {
  //         id: '93a424a0-e54b-11ee-a9f2-5fe5357cab11',
  //         value: transportant,
  //       },
  //       {
  //         id: 'a8c08040-e54b-11ee-a9f2-5fe5357cab11',
  //         value: table,
  //       },
  //       {
  //         id: 'fd79f440-e54b-11ee-a9f2-5fe5357cab11',
  //         value: observation,
  //       },
  //       ...ids,
  //     ],
  //     documents: [
  //       {
  //         usage_id: 'a8eaad00-eabb-11ee-8422-572674897009',
  //         file_id: idFile,
  //       },
  //     ],
  //     test: false,
  //   },
  // }
  // const res = await axios({
  //   method: 'post',
  //   url: 'https://app-api.holmesdoc.io/v1/workflows/65f09b520e9ee4008b350546/start',
  //   data: bodyRequest,
  //   headers: {
  //     api_token: process.env.api_token!,
  //   },
  // })
  // await db.productSale.create({
  //   data: {
  //     codePedido: codigoPedido.toString(),
  //     codePedidoEcommerce: codigoPedidoEcommerce.toString(),
  //     numeroPedido,
  //     clientId: client.id,
  //     product: {
  //       createMany: {
  //         data: products.map((p) => ({
  //           id: p.id,
  //           code: p.code,
  //           description: p.description,
  //           price: parseFloat(p[p.table]) * p.quantity,
  //           quantity: p.quantity,
  //           discount: p.discount,
  //         })),
  //       },
  //     },
  //     user: {
  //       connect: {
  //         id: session.user.id,
  //       }
  //     },
  //     obs: observation ?? ' ',
  //     planSale: planSell,
  //     transport: transportant,
  //   },
  // })
  return {
    // numeroPedido: numeroPedido,
    numeroPedido: '123',
  }
}
