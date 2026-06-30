const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { pool } = require('./conection.js')

const app = express();
app.use(cors());
app.use(express.json());

// Disponibiliza a pasta de uploads publicamente através do navegador para servir as mídias
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração granular e robusta do motor de armazenamento (Storage Engine) do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define a pasta local de destino para os arquivos
    },
    filename: (req, file, cb) => {
        // Geração de um sufixo numérico aleatório único para evitar sobreposição de ficheiros homônimos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rota POST para criação de perfil com recebimento de múltiplos ficheiros e campos distintos
app.post('/perfil', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'curriculo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { nome } = req.body;

        // Captura cirúrgica dos caminhos gerados pelo Multer se os arquivos existirem na requisição
        const fotoPath = req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : null;
        const curriculoPath = req.files['curriculo'] ? `/uploads/${req.files['curriculo'][0].filename}` : null;

        const result = await pool.query(
            'INSERT INTO perfis (nome, foto_url, curriculo_url) VALUES ($1, $2, $3) RETURNING *',
            [nome, fotoPath, curriculoPath]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro crítico interno ao salvar o perfil.');
    }
});

// Rota GET de consulta estruturada para listagem de todos os perfis registrados
app.get('/perfis', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM perfis ORDER BY id DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar a lista de perfis do banco.');
    }
});

app.listen(3001, () => console.log('Servidor Backend rodando perfeitamente na porta 3001'));