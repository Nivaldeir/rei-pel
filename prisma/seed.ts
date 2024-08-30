import { db } from '@/lib/db'
import excelToJson from 'convert-excel-to-json'
const base = excelToJson({
  sourceFile: 'prisma/base.xls',
  columnToKey: {
    A: 'Código',
    B: 'CNPJ/CPF',
    C: 'Nome',
    D: 'Razão Social',
    E: 'Inscrição Estadual',
    F: 'Classificação',
    G: 'Telefone Principal',
    H: 'Tipo',
    I: 'Representante',
    J: 'Cidade / Estado',
  },
})['relatório de clientes'].filter((e, idx) => idx != 0) as User[]

type User = {
  Código: string
  'CNPJ/CPF': string
  Nome: string
  'Razão Social': string
  'Inscrição Estadual': string
  Classificação: string
  'Telefone Principal': string
  Tipo: string
  Representante: string
  'Cidade / Estado': string
}

// const product = excelToJson({
//   sourceFile: 'prisma/pedidos.xls',
//   columnToKey: {
//     A: 'code',
//     B: 'description',
//     C: 'apres',
//     D: 'ipi',
//     G: 'table1',
//     H: 'table2',
//     I: 'table3',
//   },
// })['Planilha de Produtos'] as {
//   code: number
//   description: string
//   apres: string
//   ipi: number
//   table1: number
//   table2: number
//   table3: number
// }[]
const passwordDefault =
  '35a9e381b1a27567549b5f8a6f783c167ebf809f1c4d6a9e367240484d8ce281'
async function main() {
  const users = base.reduce((acc: { [key: string]: any }, user: User) => {
    if (acc[user.Representante]?.name) {
      acc[user.Representante] = {
        ...acc[user.Representante],
        clients: [
          ...acc[user.Representante].clients, // Corrected line
          {
            code: user.Código,
            stateRegistrarion: user['Inscrição Estadual'],
            identification: user['CNPJ/CPF'],
            name: user?.Nome,
            razaoSocial: user?.Classificação,
            city: user['Cidade / Estado']?.split('/')[0],
            state: user['Cidade / Estado']?.split('/')[1],
            tell: user['Telefone Principal'],
          },
        ],
      };
    } else {
      acc[user.Representante] = {
        name: user.Representante,
        clients: [
          {
            code: user.Código,
            stateRegistrarion: user['Inscrição Estadual'],
            identification: user['CNPJ/CPF'],
            name: user?.Nome,
            razaoSocial: user?.Classificação,
            city: user['Cidade / Estado']?.split('/')[0],
            state: user['Cidade / Estado']?.split('/')[1],
            tell: user['Telefone Principal'],
          },
        ],
      };
    }
    return acc;
  }, {});
  console.log(users)
  // const users =
  // const data = await db.user.create({
  //   data: {
  //     city: 'PB',
  //     code: '97',
  //     email: 'hudsonrepresentacoes1@hotmail.com',
  //     password: '123',
  //     representative: 'Hudson Medeiros',
  //     isAdmin: false,
  //   },
  // })
  // const clients = output
  //   .filter((e) => e.stateRegistration && e.tell && e['city/state'])
  //   .map((e) => {
  //     return {
  //       classification: e.classification,
  //       identification: e.identification,
  //       name: e.name,
  //       razaoSocial: e.razaoSocial,
  //       stateRegistration: e.stateRegistration,
  //       tell: e.tell,
  //       city: e['city/state'].split('/')[0],
  //       state: e['city/state'].split('/')[1].trim(),
  //       code: e.code.toString(),
  //       userId: data.id,
  //     }
  //   })
  //   .filter((e) => {
  //     if (code.includes(e.code.toString())) {
  //       console.log(e.code)
  //       return true
  //     }
  //   })
  // const client = await db.client.createMany({
  //   data: clients,
  // })
  // const result = product
  //   .filter((e) => e.code && e.apres && e.table1)
  //   .map((e) => ({
  //     code: e.code.toString(),
  //     description: e.description,
  //     apres: e.apres,
  //     ipi: e.ipi.toString(),
  //     table1: e.table1,
  //     table2: e.table2,
  //     table3: e.table3,
  //   }))
  // await db.product.createMany({
  //   data: result,
  // })
}

main()
