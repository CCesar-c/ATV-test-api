const express = require('express');
const md5 = require('md5');

const app = express();

// Middlewares esenciales para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let logins = [];

// Crear usuario (POST)
app.post('/login', (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Validación básica
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const senhaCriptografada = md5(senha);
    logins.push({ nome, email, senha: senhaCriptografada });
    res.json(logins);
});

// Listar usuarios (GET)
app.get('/login', (req, res) => {
    res.json(logins);
});

// Actualizar usuario (PUT)
app.put('/login', (req, res) => {
    const { nome, email, senha } = req.body;
    
    const usuario = logins.find((t) => t.email === email);
    
    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualiza los datos y encripta la nueva contraseña
    usuario.nome = nome || usuario.nome;
    if (senha) {
        usuario.senha = md5(senha);
    }

    res.json(logins);
});

// Eliminar usuario (DELETE)
app.delete('/login', (req, res) => {
    const { email } = req.body;
    
    const index = logins.findIndex(u => u.email === email);
    
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    logins.splice(index, 1);
    res.json(logins);
});

// Iniciar servidor
app.listen(3001, () => {
    console.log("Servidor rodando em http://localhost:3001");
});
