import { connectToDB } from "@/config/sql-server";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type ResponseData = {
  message: string
}

export async function POST(request: Request
) {
  try {
    const output = await request.json();
    let codePed = 68681490;
    let product = output["properties"].PRODUTOS.split(" - ")[0];
    const pool = await connectToDB();
    
    const result = await pool.request().query(`
      SELECT * 
      FROM Ped p
      JOIN PedItem pi ON pi.cdPed = p.cdPed
      WHERE p.nPed = '${codePed}'
    `);
    const item = result.recordset.filter((e) => e["apelido"] == product)[0];
    
    await pool.request().query(`
      UPDATE pi
      SET pi.qtItem = 3, pi.qtEntregar = 3, pi.qtFaturar = 3
      FROM PedItem pi
      JOIN Ped p ON pi.cdPed = p.cdPed
      WHERE p.nPed = '${codePed}' AND pi.apelido = '${item.apelido}';
    `);
    return NextResponse.json({ error: false, body: output }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
