// Importa as dependências
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para parse de JSON
app.use(express.json());  // Atualizado para express.json()

// Raiz.
app.get('/', (req, res) => {
    res.send('Servidor rodando! Use /usuarios para ver os dados.');
});

// Rota para buscar usuários
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
            return;
        }
        res.json(results);
    });
});

app.get('/formulario', (req, res) => {
  	res.sendFile(path.join( '/home/jelastic/ROOT/', 'formulario.html'));
});
                      
                           
                         

// Nova rota para exibir e inserir dados
app.post('/novo-usuario', (req, res) => {
    const { nome, sobrenome, email } = req.body;
    if (!nome || !sobrenome || !email) {
        return res.status(400).json({ error: 'Nome Sobrenome e email são obrigatórios!' });
    }

    const sql = 'INSERT INTO usuarios (nome, sobrenome, email) VALUES (?, ?, ?)';
    db.query(sql, [nome, sobrenome, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao inserir usuário' });
        }
        res.status(201).json({ message: 'Usuário inserido com sucesso!', id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
