import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'davi_comercio',
    password: 'senai',
    port: 5433
})

export default pool;