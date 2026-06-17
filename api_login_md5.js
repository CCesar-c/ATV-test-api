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

// tem problema
/* onst md5 = require('md5');
const express = require('express');


const app = express();


app.use(express.urlencoded({ extended: true }));
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


app.put('/login', (req, res) => {
    const { nome, email, senha } = req.body;
    const nova_tarefa = logins.find((t) => t.email === email);


    nova_tarefa.nome = nome;
    nova_tarefa.senha = senha;
    res.json(logins);


})


app.delete('/login', (req, res) => {
    const { email } = req.body;


    var index = logins.findIndex(u => u.email === email);
    logins.splice(index, 1);
    res.json(logins)
})


app.listen(3001, () => {
    console.log("http://localhost:3001/");
})
*/