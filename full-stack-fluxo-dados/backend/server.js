const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Módulo nativo necessário para o Desafio 3 (remover arquivos do disco)
const { pool } = require('./conection.js');
const { log } = require('console');

const app = express();
app.use(cors());
app.use(express.json());

// Disponibiliza a pasta de uploads publicamente através do navegador para servir as mídias
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração granular e robusta do motor de armazenamento (Storage Engine) do Multer
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        // Geração de um sufixo numérico aleatório único para evitar sobreposição de ficheiros homônimos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define a pasta local de destino para os arquivos
    }
});

// Filtro rigoroso de MIME-Type para segurança do servidor (Desafio 1)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'foto') {
        // Permite estritamente apenas imagens JPEG e PNG
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('A foto de perfil precisa ser exclusivamente do tipo JPEG ou PNG.'), false);
        }
    } else if (file.fieldname === 'curriculo') {
        // Permite estritamente apenas documentos PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('O currículo precisa ser exclusivamente um arquivo PDF.'), false);
        }
    } else {
        cb(new Error('Campo de arquivo não identificado.'), false);
    }
};

// Configuração dos campos, limites e filtros do Multer (Desafio 1)
const uploadFields = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: (1024 * 1024 * 2) } // Limite estrito de 2MB por arquivo
}).fields([
    { name: 'foto', maxCount: 1 }, 
    { name: 'curriculo', maxCount: 1 }
]);

// Variável global para rastrear o último erro (Usa-se let para permitir reatribuição)
let novoErro = null;

// Rota GET de diagnóstico para checar se houve erro no upload anterior
app.get("/error", (req, res) => {
    if (novoErro == null) {
        return res.json({ message: "Nenhum erro registrado." });
    } else {
        return res.json({ error: novoErro.message });
    }
});

// Rota POST para criação de perfil com recebimento de múltiplos ficheiros e campos distintos
app.post('/perfil', (req, res) => {
    // Executa o Multer manualmente para capturar erros de tamanho/tipo cirurgicamente
    uploadFields(req, res, async function (err) {
        if (err) {
            // Se o arquivo for maior que 2MB ou falhar no fileFilter
            novoErro = new Error(`Erro de validação: ${err.message}`);
            console.error(novoErro);
            return res.status(400).json({ error: novoErro.message });
        }

        // Se o upload deu certo, limpamos o erro global
        novoErro = null;

        try {
            const { nome } = req.body;

            // Captura cirúrgica dos caminhos gerados pelo Multer se os arquivos existirem na requisição
            const fotoPath = req.files && req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : null;
            const curriculoPath = req.files && req.files['curriculo'] ? `/uploads/${req.files['curriculo'][0].filename}` : null;

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

// Rota DELETE para remoção lógica do banco e física do armazenamento local (Desafio 3)
app.delete('/perfil/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Localiza as referências dos arquivos no banco antes de deletar a linha
        const busca = await pool.query('SELECT foto_url, curriculo_url FROM perfis WHERE id = $1', [id]);
        
        if (busca.rows.length === 0) {
            return res.status(404).json({ error: "Perfil não encontrado." });
        }

        const perfil = busca.rows[0];

        // Função interna auxiliar para remover o arquivo do HD de forma segura
        const excluirArquivoFisico = (caminhoRelativo) => {
            if (!caminhoRelativo) return;
            
            // Monta o caminho absoluto correto baseado na raiz do projeto backend
            const caminhoAbsoluto = path.join(__dirname, caminhoRelativo);

            // Verifica de forma síncrona se o arquivo realmente existe no disco antes de apagá-lo
            if (fs.existsSync(caminhoAbsoluto)) {
                fs.unlinkSync(caminhoAbsoluto);
            }
        };

        // 2. Executa a remoção física dos arquivos associados na pasta uploads/
        excluirArquivoFisico(perfil.foto_url);
        excluirArquivoFisico(perfil.curriculo_url);

        // 3. Deleta o registro definitivamente da tabela do PostgreSQL
        await pool.query('DELETE FROM perfis WHERE id = $1', [id]);

        res.json({ message: "Perfil e seus respectivos arquivos físicos deletados com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro crítico interno ao tentar excluir o perfil.');
    }
});

app.listen(3001, () => console.log('Servidor Backend rodando perfeitamente na porta 3001'));
