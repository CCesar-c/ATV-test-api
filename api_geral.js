const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let filmes = [
    { id: 0, titulo: "Star Wars", genero: "Ficcão" },
    { id: 1, titulo: "Matrix", genero: "Ficcão" },
    { id: 2, titulo: "Matrix 2", genero: "Ficcão" },
    { id: 3, titulo: "Matrix 3", genero: "Ficcão" },
    { id: 4, titulo: "Matrix 4", genero: "Ficcão" },
    { id: 5, titulo: "Matrix 5", genero: "Ficcão" },
    { id: 6, titulo: "Matrix 6", genero: "Ficcão" },
    { id: 7, titulo: "Matrix 7", genero: "Ficcão" },
    { id: 8, titulo: "Matrix 8", genero: "Ficcão" },
    { id: 9, titulo: "Matrix 9", genero: "Ficcão" },
    { id: 10, titulo: "Matrix 10", genero: "Ficcão" },
    { id: 11, titulo: "Rio", genero: "fantasia" },
    { id: 12, titulo: "Rio 2", genero: "fantasia" }
];

let clientes = [
    { id: 0, nome: "Joaquim", email: "j@j.com" }
]

app.get('/filmes', (req, res) => {
    const { id } = req.body;
    id > filmes.length && res.status(404).json({ erro: "Filme nao encontrado" });
    id < 0 && res.status(404).json({ erro: "Filme nao encontrado" });
    res.json(filmes[id]);
});

app.get('/filmes/genero', (req, res) => {
    const { nome } = req.body;
    const filme = filmes.filter(f => f.genero === nome);
    res.json(filme);
})

app.post('/clientes', (req, res) => {
    const { nome, email } = req.body;
    const resultado = Boolean(clientes.filter(c => c.email == email).length > 0);
    for (let index = 0; index < clientes.length; index++) {
        if (resultado) {
            console.log("o cliente nao tem email == " + resultado);
            res.status(400).json({ erro: "Email ja cadastrado" });
        }else{
            clientes.push({id: clientes.length, nome, email });
            res.json(clientes);
        }
    }
})

app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const resultado = clientes.filter(c => c.id == id);
    if (resultado.length == 0) {
        res.status(404).json({ erro: "Cliente nao encontrado" });
    }else{
        res.json(clientes[id]);
    }
    
})

app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});