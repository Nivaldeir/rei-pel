<<<<<<< HEAD
import { getServerSession } from 'next-auth/next'
import { authNextOptions } from '@/config/auth-config'
import Table from './_component/table'
import { db } from '@/lib/db'
import { createSale } from '@/lib/schema/sale'
import { z } from 'zod'
import { sendProcess } from '@/services/process'
import { Client } from '@prisma/client'
import { ProductWithDetails } from '@/components/form/form-create-sale'
type UpdateProducts = {
  id: string
} & ProductWithDetails

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

export default async function SalesPage() {
  const { user } = (await getServerSession(authNextOptions)) as {
    user: { id: string }
  }
  const productsSales = await db.productSale.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: true,
      client: true,
    },
  })


  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Historico de pedidos</p>
      </header>
      <section className="p-4"> 
        <Table data={productsSales} />
      </section> 
    </>
  )
}
=======
import { getServerSession } from 'next-auth/next'
import { authNextOptions } from '@/config/auth-config'
import Table from './_component/table'
import { db } from '@/lib/db'
import { createSale } from '@/lib/schema/sale'
import { z } from 'zod'
import { sendProcess } from '@/services/process'
import { Client } from '@prisma/client'
import { ProductWithDetails } from '@/components/form/form-create-sale'
type UpdateProducts = {
  id: string
} & ProductWithDetails

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

export default async function SalesPage() {
  const { user } = (await getServerSession(authNextOptions)) as {
    user: { id: string }
  }
  const productsSales = await db.productSale.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: true,
      client: true,
    },
  })


  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Historico de pedidos</p>
      </header>
      <section className="p-4"> 
        <Table data={productsSales} />
      </section> 
    </>
  )
}
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
