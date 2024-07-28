'use server'
import { FormSettings } from "@/components/form/form-settings";
import { authNextOptions } from "@/config/auth-config";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { createHash } from "crypto";

export default async function Settings() {
  const session = (await getServerSession(authNextOptions)) as any
  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  })
  const fnUpdate = async (data: any) => {
    "use server"
    try {
      let hash
      if (data.password != user?.password) {
        hash = createHash('sha256')
          .update(data.password)
          .digest('hex')
      } else {
        hash = user?.password
      }
      let password = hash ?? null
      await db.user.update({
        where: { id: user!.id },
        data: { ...user, ...data, password }
      })
      return true
    } catch (error) {
      return error
    }
  }
  return <>
    <header className="px-6 py-3 space-y-6 border-b border-border w-full">
      <p className="ml-3 uppercase">Configurações, <strong>Nivaldeir</strong></p>
    </header>
    <div className="p-4">
      {
        user &&
        <FormSettings data={user} fnUpdate={fnUpdate} />
      }
    </div>
  </>
}