const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let contatos = [];


app.post('/contatos', (req, res) => {
  contatos.push(req.body);
  res.json(contatos);
});


app.get('/contatos', (req, res) => {
  res.json(contatos);
});


app.post('/buscar', (req, res) => {
  const { nome } = req.body;
  const resultado = contatos.find(c => c.nome === nome);
  res.json(resultado || { mensagem: "Não encontrado" });
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});