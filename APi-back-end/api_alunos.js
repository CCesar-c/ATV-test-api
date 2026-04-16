const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let alunos = [];


app.post('/alunos', (req, res) => {
  const { nome, dataNascimento } = req.body;


  // Validação
  if (!nome || !dataNascimento) {
    return res.status(400).json({
      erro: "Nome e data de nascimento são obrigatórios"
    });
  }


  // Converter data
  const dataNasc = new Date(dataNascimento);
  const hoje = new Date();


  if (isNaN(dataNasc)) {
    return res.status(400).json({
      erro: "Data de nascimento inválida"
    });
  }


  // Calcular idade
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const mes = hoje.getMonth() - dataNasc.getMonth();


  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }


  // Definir maioridade
  const maioridade = idade >= 18 ? "maior de idade" : "menor de idade";


  const aluno = {
    nome,
    dataNascimento,
    idade,
    maioridade
  };

  alunos.push(aluno);
  res.status(201).json(aluno);
});


app.get('/alunos', (req, res) => {
  res.json(alunos);
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
