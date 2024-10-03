import sql from "mssql";

const config = {
  user: 'tatica',                 // Substitua pelo seu usuário do SQL Server
  password: 'tatica2024@@',        // Substitua pela sua senha
  server: process.env.IP_CALLISTOR!,        // IP do servidor SQL Server
  port: 1433,                      // Porta correta (1433)
  database: 'TREINAMENTO',         // Nome do banco de dados (adicione o nome correto)
  options: {
    encrypt: false,                // Desative se o SSL não for necessário, igual à configuração da interface
    trustServerCertificate: true,  // Ignora certificado se for o caso
  },
};

export async function connectToDB() {
  try {
    const pool = await sql.connect(config);
    console.log("Conectado ao SQL Server!");
    return pool;
  } catch (err) {
    console.error("Erro ao conectar ao SQL Server:", err);
    throw err;
  }
}
