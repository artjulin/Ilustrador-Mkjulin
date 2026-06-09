const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

const db = new sqlite3.Database('ilustrapro.db');

db.serialize(() => {
    // Tabelas melhoradas
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nome TEXT NOT NULL,
        role TEXT DEFAULT 'cliente'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        servico TEXT,
        descricao TEXT,
        data_preferencial TEXT,
        valor REAL,
        status TEXT DEFAULT 'Pendente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Admin padrão
    db.run(`INSERT OR IGNORE INTO users (username, password, nome, role) VALUES ('admin', '1234', 'Mkjulin', 'admin')`);
});

app.post('/api/register', (req, res) => {
    const { username, password, nome } = req.body;
    db.run("INSERT INTO users (username, password, nome) VALUES (?, ?, ?)", 
        [username, password, nome], function(err) {
        if (err) return res.json({success: false, message: "Usuário já existe"});
        res.json({success: true, message: "Cadastro realizado!"});
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT id, nome, role FROM users WHERE username = ? AND password = ?", 
        [username, password], (err, user) => {
        if (user) res.json({success: true, user});
        else res.json({success: false, message: "Credenciais inválidas"});
    });
});

app.post('/api/agendar', (req, res) => {
    const { user_id, servico, descricao, data_preferencial, valor } = req.body;
    db.run(`INSERT INTO agendamentos (user_id, servico, descricao, data_preferencial, valor) 
            VALUES (?, ?, ?, ?, ?)`,
        [user_id, servico, descricao, data_preferencial, valor],
        function(err) {
            if (err) return res.json({success: false});
            res.json({success: true, id: this.lastID});
        }
    );
});

app.get('/api/meus-pedidos/:userId', (req, res) => {
    db.all("SELECT * FROM agendamentos WHERE user_id = ? ORDER BY created_at DESC", 
        [req.params.userId], (err, rows) => {
        res.json(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
