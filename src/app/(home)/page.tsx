import { db } from "@/services/database";
import { FormHome } from "./_components/form";
import { getServerSession } from "next-auth";
import { authNextOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authNextOptions);
  const [products, clients] = await Promise.all([
    db.product.findMany(),
    db.client.findMany(),
  ]);
  return <FormHome products={products} clients={clients} />;
}
