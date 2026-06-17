const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const md5 = require('md5');

let logins = [];


app.post('/login', (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = md5(senha);


    logins.push({ nome, email, senha: senhaCriptografada });


    res.json(logins);
});


app.get('/login', (req, res) => {
    res.json(logins);
});

app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});