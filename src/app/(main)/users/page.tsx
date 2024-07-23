'use server'
import { authNextOptions } from '@/config/auth-config'
import { getServerSession } from 'next-auth/next'
import { DataTable } from './_components/data-table'
import { db } from '@/lib/db'
export default async function Users() {
  const session = (await getServerSession(authNextOptions)) as any
  const users = await db.user.findMany({
    where: {
      NOT: {
        id: session.user.id,
      },
    },
    include: {
      clients: true,
    },
  })

  const handleUpdate = async (prevId: string, nextId: string) => {
    'use server'
    const result = await db.client.updateMany({
      data: {
        userId: nextId,
      },
      where: {
        userId: prevId,
      },
    })
    console.log(result)
  }

  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Usuarios</p>
      </header>
      <div className="p-4">
        <DataTable data={users} users={users} fnUpdate={handleUpdate} />
      </div>
    </>
  )
}
