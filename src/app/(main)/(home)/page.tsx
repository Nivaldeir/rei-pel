import FormCreateSale from '@/components/form/form-create-sale'
import { authNextOptions } from '@/config/auth-config'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
export default async function Home() {
  const session = (await getServerSession(authNextOptions)) as any
  const [products, clients] = await Promise.all([
    db.product.findMany(),
    db.client.findMany({
      where: {
        userId: session.user.id,
      },
    }),
  ])

  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Vendas</p>
      </header>
      <div className="p-4">
        <FormCreateSale dbProducts={products} clients={clients} />
      </div>
    </>
  )
}
