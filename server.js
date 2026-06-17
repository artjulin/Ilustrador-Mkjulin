const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve HTML, CSS e JS

const db = new sqlite3.Database('ilustrapro.db');

// ====================== BANCO DE DADOS ======================
db.serialize(() => {
    // Tabela de Usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nome TEXT NOT NULL,
        role TEXT DEFAULT 'cliente',
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Agendamentos
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        servico TEXT,
        descricao TEXT,
        data_preferencial TEXT,
        pagamento TEXT,
        valor REAL,
        status TEXT DEFAULT 'Pendente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Admin padrão
    db.run(`INSERT OR IGNORE INTO users (username, password, nome, role) 
            VALUES ('admin', '1234', 'Mkjulin', 'admin')`);

    console.log("✅ Banco de dados carregado com sucesso!");
});

// ====================== ROTAS ======================

// Cadastro
app.post('/api/register', (req, res) => {
    const { nome, username, password } = req.body;
    db.run("INSERT INTO users (nome, username, password, role) VALUES (?, ?, ?, 'cliente')",
        [nome, username, password], function(err) {
            if (err) return res.json({ success: false, message: "Usuário já existe" });
            res.json({ success: true, message: "Cadastro realizado com sucesso!" });
        });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT id, nome, username, role FROM users WHERE username = ? AND password = ?",
        [username, password], (err, user) => {
            if (user) res.json({ success: true, user });
            else res.json({ success: false, message: "Usuário ou senha incorretos" });
        });
});

// Fazer Agendamento
app.post('/api/agendar', (req, res) => {
    const { user_id, servico, descricao, data_preferencial, pagamento, valor } = req.body;
    
    if (!user_id) return res.json({ success: false, message: "Você precisa estar logado" });

    db.run(`INSERT INTO agendamentos (user_id, servico, descricao, data_preferencial, pagamento, valor) 
            VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, servico, descricao, data_preferencial, pagamento, valor],
        function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true, id: this.lastID });
        });
});

// Todos os Agendamentos (para Admin)
app.get('/api/agendamentos', (req, res) => {
    db.all(`SELECT a.*, u.nome as cliente_nome 
            FROM agendamentos a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.created_at DESC`, 
        [], (err, rows) => res.json(rows));
});

// Todos os Clientes (para Admin)
app.get('/api/clientes', (req, res) => {
    db.all(`SELECT id, nome, username, data_cadastro 
            FROM users 
            WHERE role = 'cliente' 
            ORDER BY nome`, 
        [], (err, rows) => res.json(rows));
});

// Meus Pedidos (para o Cliente)
app.get('/api/meus-pedidos/:userId', (req, res) => {
    db.all("SELECT * FROM agendamentos WHERE user_id = ? ORDER BY created_at DESC",
        [req.params.userId], (err, rows) => res.json(rows));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Admin Login → usuário: admin | senha: 1234`);
});
