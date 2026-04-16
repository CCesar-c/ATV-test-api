const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let receitas = [];


app.post('/receitas', (req, res) => {
  const { nome, ingredientes, modo } = req.body;
  receitas.push({ nome, ingredientes, modo });
  res.json(receitas);
});


app.get('/receitas', (req, res) => {
  res.json(receitas);
});



app.listen(3001, () => {
console.log('Servidor rodando em http://localhost:3001');
});
