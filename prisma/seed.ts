import { db } from '@/lib/db'
import excelToJson from 'convert-excel-to-json'
const output = excelToJson({
  sourceFile: 'prisma/base1.xlsx',
  columnToKey: {
    A: 'code',
    B: 'identification',
    C: 'name',
    D: 'razaoSocial',
    E: 'stateRegistration',
    F: 'classification',
    G: 'tell',
    J: 'city/state',
  },
}).Planilha1 as {
  code: string
  identification: string
  name: string
  stateRegistration: string
  razaoSocial: string
  classification: string
  tell: string
  'city/state': string
}[]

const product = excelToJson({
  sourceFile: 'prisma/pedidos.xls',
  columnToKey: {
    A: 'code',
    B: 'description',
    C: 'apres',
    D: 'ipi',
    G: 'table1',
    H: 'table2',
    I: 'table3',
  },
})['Planilha de Produtos'] as {
  code: number
  description: string
  apres: string
  ipi: number
  table1: number
  table2: number
  table3: number
}[]
const code = [
  '404',
  '451',
  '921',
  '1571',
  '1852',
  '2328',
  '3854',
  '4172',
  '5684',
  '7005',
  '7228',
  '7591',
  '8085',
  '8243',
  '8352',
  '8560',
  '8561',
  '8667',
  '8668',
  '9074',
  '9186',
  '9270',
  '9346',
  '9374',
  '9388',
  '9404',
  '9499',
  '9523',
  '9553',
  '9650',
  '9777',
  '9904',
  '9905',
  '9989',
  '10012',
  '10089',
  '10306',
  '10312',
  '10372',
  '10389',
  '10491',
  '10542',
  '10575',
  '10590',
  '10770',
  '10837',
  '9260',
  '9261',
  '10919',
  '10928',
  '9342',
  '11023',
  '11024',
  '11197',
  '9719',
  '11441',
  '3957',
  '11460',
  '11544',
  '11820',
  '11856',
  '11961',
  '538',
  '2342',
  '2726',
  '9294',
  '9811',
  '11396',
  '11368',
]
async function main() {
  const data = await db.user.create({
    data: {
      city: 'SP',
      code: '0001',
      email: 'admin@admin.com.br',
      password: '123',
      representative: 'Nivaldeir',
      isAdmin: true,
    },
  })
  const clients = output
    .filter((e) => e.stateRegistration && e.tell && e['city/state'])
    .map((e) => {
      return {
        classification: e.classification,
        identification: e.identification,
        name: e.name,
        razaoSocial: e.razaoSocial,
        stateRegistration: e.stateRegistration,
        tell: e.tell,
        city: e['city/state'].split('/')[0],
        state: e['city/state'].split('/')[1].trim(),
        code: e.code.toString(),
        userId: data.id,
      }
    })
    .filter((e) => {
      if (code.includes(e.code.toString())) {
        console.log(e.code)
        return true
      }
    })
  const client = await db.client.createMany({
    data: clients,
  })
  const result = product
    .filter((e) => e.code && e.apres && e.table1)
    .map((e) => ({
      code: e.code.toString(),
      description: e.description,
      apres: e.apres,
      ipi: e.ipi.toString(),
      table1: e.table1,
      table2: e.table2,
      table3: e.table3,
    }))

  await db.product.createMany({
    data: result,
  })
}

main()
