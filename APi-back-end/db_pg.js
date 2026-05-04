// Importamos o driver do Postgres
import pg from 'pg';
const { Pool } = pg;

// Criamos uma nova instância do Pool de conexões
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Biblioteca',
    password: 'senai',
    port: 5433,
});

export async function postar_livros(titulo, autor, ano_publicacao, disponivel, req, res) {
    try {
        const sql = 'insert into livros (titulo, autor, ano_publicacao, disponivel) values ($1, $2, $3, $4) returning *'
        const respons = await pool.query(sql, [titulo, autor, ano_publicacao, disponivel])
        res.json(respons.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao inserir livro' })
    }
}

export async function buscar_livros(req, res) {
    try {
        const sql = 'select * from livros'
        const respons = await pool.query(sql)
        res.json(respons.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar livros' })
    }
}

export async function buscar_livros_id(id, req, res) {  
    try {
        const sql = 'select * from livros where id = $1'
        const respons = await pool.query(sql, [id])
        res.json(respons.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar livro' })
    }
}
export async function atualizar_livros(id, titulo, autor, ano_publicacao, disponivel, req, res) {
    try {
        const sql = 'update livros set titulo = $1, autor = $2, ano_publicacao = $3, disponivel = $4 where id = $5 returning *'
        const respons = await pool.query(sql, [titulo, autor, ano_publicacao, disponivel, id])
        res.json(respons.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar livro' })
    }
}
export async function excluir_livros(id, req, res) {
    try {
        const sql = 'delete from livros where id = $1 returning *'
        const respons = await pool.query(sql, [id])
        res.json(respons.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao excluir livro' })
    }
}

export default pool;