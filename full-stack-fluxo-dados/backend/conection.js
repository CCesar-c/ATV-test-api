import { Pool } from "pg";
// Configuração de conexão profissional com o Banco de Dados PostgreSQL
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'perfil',
    password: 'senai',
    port: 5433
});

