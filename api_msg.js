const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let mensagens = [];


app.post('/mensagens', (req, res) => {
  const { nome, texto } = req.body;
  mensagens.push({ nome, texto });
  res.json(mensagens);
});


app.get('/mensagens', (req, res) => {
  res.json(mensagens);
});


// PUT usando texto antigo >> atualiza para texto novo
app.put('/mensagens', (req, res) => {
  const { textoAntigo, textoNovo } = req.body;


  const mensagem = mensagens.find((m) => m.texto === textoAntigo);


  if (!mensagem) {
    return res.status(404).json({ erro: 'Texto não encontrado' });
  }


  mensagem.texto = textoNovo;


  res.json(mensagem);
});


app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
