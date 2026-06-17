import express from 'express'

import pool from './db_clientes_pg.js';
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//clientes
app.get('/clientes', async (req, res) => {
    const response = await pool.query("select * from clientes")
    res.json(response.rows)
})
app.post('/clientes', async (req, res) => {
    const { nome, email } = req.body
    const sql = 'insert into clientes (id, nome,email) values (Default, $1, $2) returning *'
    const respons = await pool.query(sql, [nome, email])
    res.json(respons.rows)
})
app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params
    const { nome, email} = req.body
    const response = await pool.query("update clientes set nome = $1, email = $2 where id = $3 returning *", [nome, email, id])
    res.json(response.rows)
})
app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params
    const response = await pool.query("drop column from clientes where id = $1 returning *", [id])
    res.json(response.rows)
})


//pedidos
app.get('/pedidos', async (req, res) => {
    const response = await pool.query("select * from pedidos")
    res.json(response.rows)
})

app.post('/pedidos', async (req, res) => {
    const { produto, valor, status, cliente_id } = req.body
    const response = await pool.query("insert into pedidos (id, produto, valor, status, cliente_id) values (Default, $1, $2, $3, $4) returning *", [produto, valor, status, cliente_id])
    res.json(response.rows)
})

app.listen(3000, () => {
    console.log("Davi")
})