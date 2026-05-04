const express = require('express')
const pool = './db_pg.js';
const { postar_livros, buscar_livros, buscar_livros_id, atualizar_livros, excluir_livros } = require('./db_pg.js');

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.post('/livros', async (req, res) => {
    postar_livros(req.body.titulo, req.body.autor, req.body.ano_publicacao, req.body.disponivel, req, res)
})
app.get('/livros', async (req, res) => {
    buscar_livros(req, res)
})

app.get('/livros/:id', async (req, res) => {
    const { id } = req.params
    buscar_livros_id(id, req, res)
})
app.put('/livros/:id', async (req, res) => {
    const { id } = req.params
    const { titulo, autor, ano_publicacao, disponivel } = req.body
    atualizar_livros(id, titulo, autor, ano_publicacao, disponivel, req, res)
})

app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params
    excluir_livros(id, req, res)
})

app.listen(3000, () =>{
    console.log('http://localhost:3000/')
})