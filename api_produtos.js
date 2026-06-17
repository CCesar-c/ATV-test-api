const express = require('express');
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let produtos = [];


app.post('/produtos', (req, res) => {
  const { nome, preco, validade } = req.body;
  produtos.push({ nome, preco, validade });
  res.json(produtos);
});


app.get('/produtos', (req, res) => {
  res.json(produtos);
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});