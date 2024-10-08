"use server"
import { ProductWithDetails } from '@/@types/products'
import FormCreateSale from '@/components/form/form-create-sale'
import { authNextOptions } from '@/config/auth-config'
import { db } from '@/lib/db'
import { createSale } from '@/lib/schema/sale'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
export default async function Home() {
  const session = (await getServerSession(authNextOptions)) as any
  const [products, clients] = await Promise.all([
    db.product.findMany({
      where: {
        isActived: true
      }
    }),
    db.client.findMany({
      where: {
        userId: session?.user.id,
      },
    }),
  ])
  const handleSaveOrder = async (data: z.infer<typeof createSale> & { products: ProductWithDetails[] }, id?: string | null) => {
    "use server"
    try {
      if (id) {
        await db.productSale.delete({ where: { id: id } })
      }
    } catch (error) {
      console.log("handleSaveOrder", error)
    }
    return await db.productSale.create({
      data: {
        planSale: data.planSell,
        transport: data.conveyor,
        obs: data.observation,
        clientId: data.code,
        userId: session?.user.id,
        product: {
          createMany: {
            data: data.products.map(p => ({ code: p.code, description: p.description, discount: parseFloat(p.discount.toString()), price: p[p.table] as number, quantity: parseFloat(p.quantity.toString()), productId: p.id }))
          }
        }
      }
    })
  }
  const handleGetById = async (id: string) => {
    'use server'
    return db.productSale.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        product: {
          include: {
            product: true
          }
        }
      }
    })
  }
  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Vendas</p>
      </header>
      <div className="p-4">
        <FormCreateSale dbProducts={products} fnGetById={handleGetById} clients={clients} fnSave={handleSaveOrder} />
      </div>
    </>
  )
}
