'use server'
import ClienForm, { Client } from '@/components/form/form-client-create'
import { getServerSession } from 'next-auth/next'
import { authNextOptions } from '@/config/auth-config'
import { db } from '@/lib/db'
import Table from './_components/table'

export default async function ClientPage() {
  const session = (await getServerSession(authNextOptions)) as any
  const dbClients = await db.client.findMany({
    where: {
      userId: session.user.id,
    },
  })
  async function create(props: Client) {
    'use server'
    try {
      await db.client.create({
        data: {
          ...props,
          userId: session.user.id,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <header className="px-6 py-3 space-y-6 border-b border-border w-full">
        <p className="ml-3 uppercase">Clientes</p>
      </header>
      <section className="p-4 gap-4 flex flex-col">
        <div className="w-full justify-end">
          <ClienForm onCreate={create} />
        </div>
        <div className="w-full">
          <Table data={dbClients} />
        </div>
      </section>
    </>
  )
}
