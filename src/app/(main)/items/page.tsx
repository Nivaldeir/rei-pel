import { db } from "@/lib/db"
import { DataTable } from "./_components/data-table"
import { Product } from "@prisma/client"
import { randomUUID } from "crypto"

export default async function ItemsPage() {
  const products = await db.product.findMany()
  const handleUpdateOrCreate = async (data: Product) => {
    "use server"
    await db.product.upsert({
      where: { id: data.id ?? randomUUID() },
      update: {
        code: data.code,
        description: data.description,
        apres: data.apres,
        ipi: data.ipi,
        table1: data.table1,
        table2: data.table2,
        table3: data.table3,
        isActived: true,
      },
      create: {
        code: data.code,
        description: data.description,
        apres: data.apres,
        ipi: data.ipi,
        table1: data.table1,
        table2: data.table2,
        table3: data.table3,
        isActived: true,
      },
    })
  }
  const handleDelete = async (id: string) => {
    "use server"
    await db.product.update({
      where: { id }, data: {
        isActived: false
      }
    })
  }
  return <>
    <header className="px-6 py-3 space-y-6 border-b border-border w-full">
      <p className="ml-3 uppercase">Produtos</p>
    </header>
    <div className="p-4">
      <DataTable data={products} fnDelete={handleDelete} fnUpdate={handleUpdateOrCreate} />
    </div>
  </>
}