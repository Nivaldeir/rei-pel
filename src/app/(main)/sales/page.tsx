import { getServerSession } from 'next-auth/next'
import { authNextOptions } from '@/config/auth-config'
import Table from './_component/table'
import { db } from '@/lib/db'

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
        <p className="ml-3 uppercase">Produtos vendidos</p>
      </header>
      <section className="p-4 h-[80%] ">
        <Table data={productsSales} />
      </section>
    </>
  )
}
