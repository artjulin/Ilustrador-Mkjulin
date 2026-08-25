
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));
const db = new sqlite3.Database('ilustrapro.db');
// ====================== BANCO DE DADOS (SEGURO) ======================
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nome TEXT NOT NULL,
        cpf TEXT,
        role TEXT DEFAULT 'cliente',
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        servico TEXT,
        descricao TEXT,
        data_preferencial TEXT,
        pagamento TEXT,
        valor REAL,
        status TEXT DEFAULT 'Pendente',
        feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        ativo INTEGER DEFAULT 1
    )`);
    db.run(`ALTER TABLE agendamentos ADD COLUMN feedback TEXT`, (err) => {});
    db.run(`INSERT OR IGNORE INTO users (username, password, nome, role)
            VALUES ('admin', '1234', 'Mkjulin', 'admin')`);
    db.get("SELECT COUNT(*) as total FROM servicos", (err, row) => {
        if (row && row.total === 0) {
            db.run(`INSERT INTO servicos (nome, descricao, preco) VALUES
                ('Chibi / Cartoon', 'Ideal para fotos de perfil e presentes fofos', 50),
                ('Anime Full Body', 'Ilustração completa do corpo', 120),
                ('Concept Art', 'Arte conceitual detalhada', 200),
                ('Ilustração Infantil', 'Estilo fofo para crianças', 50),
                ('Capa de Livro / Thumbnail', 'Capa profissional ou thumbnail', 150)`);
        }
    });
    console.log("✅ Banco de dados carregado (dados preservados)!");
});
// ====================== ROTAS ======================
app.post('/api/register', (req, res) => {
    const { nome, username, password, cpf } = req.body;
    db.run("INSERT INTO users (nome, username, password, cpf, role) VALUES (?, ?, ?, ?, 'cliente')",
        [nome, username, password, cpf], function(err) {
            if (err) return res.json({ success: false, message: "E-mail já cadastrado" });
            res.json({ success: true });
        });
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT id, nome, username, role FROM users WHERE username = ? AND password = ?",
        [username, password], (err, user) => {
            if (user) res.json({ success: true, user });
            else res.json({ success: false, message: "Email ou senha incorretos" });
        });
});
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
app.get('/api/agendamentos', (req, res) => {
    db.all(`SELECT a.*, u.nome as cliente_nome, u.cpf as cliente_cpf, u.username as cliente_email
            FROM agendamentos a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC`,
        [], (err, rows) => res.json(rows));
});
app.get('/api/clientes', (req, res) => {
    db.all(`SELECT id, nome, username, cpf, data_cadastro FROM users WHERE role = 'cliente' ORDER BY nome`,
        [], (err, rows) => res.json(rows));
});
app.get('/api/meus-pedidos/:userId', (req, res) => {
    db.all("SELECT * FROM agendamentos WHERE user_id = ? ORDER BY created_at DESC",
        [req.params.userId], (err, rows) => res.json(rows));
});
app.put('/api/agendamentos/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE agendamentos SET status = ? WHERE id = ?",
        [status, req.params.id], function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        });
});
app.put('/api/agendamentos/:id/feedback', (req, res) => {
    const { feedback } = req.body;
    db.run("UPDATE agendamentos SET feedback = ? WHERE id = ?",
        [feedback, req.params.id], function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        });
});
app.get('/api/servicos', (req, res) => {
    db.all("SELECT * FROM servicos WHERE ativo = 1 ORDER BY id", [], (err, rows) => res.json(rows));
});
app.put('/api/servicos/:id', (req, res) => {
    const { nome, descricao, preco } = req.body;
    db.run("UPDATE servicos SET nome = ?, descricao = ?, preco = ? WHERE id = ?",
        [nome, descricao, preco, req.params.id], function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        });
});
app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco } = req.body;
    db.run("INSERT INTO servicos (nome, descricao, preco) VALUES (?, ?, ?)",
        [nome, descricao, preco], function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true, id: this.lastID });
        });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Admin → usuário: admin | senha: 1234`);
});
