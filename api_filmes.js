const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let filmes = [];


app.post('/filmes', (req, res) => {
    const { titulo, genero, ano } = req.body;
    filmes.push({ titulo, genero, ano });
    res.json(filmes);
});


app.get('/filmes', (req, res) => {
    res.json(filmes);
});


app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});