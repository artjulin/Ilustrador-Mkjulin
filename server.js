const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));
const db = new sqlite3.Database('ilustrapro.db');
db.serialize(() => {
    // Usuários
    db.run(CREATE TABLE IF NOT EXISTS users ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id INTEGER PRIMARY KEY AUTOINCREMENT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username TEXT UNIQUE NOT NULL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password TEXT NOT NULL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nome TEXT NOT NULL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cpf TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role TEXT DEFAULT 'cliente', &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP &nbsp;&nbsp;&nbsp;&nbsp;));
    // Agendamentos
    db.run(CREATE TABLE IF NOT EXISTS agendamentos ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id INTEGER PRIMARY KEY AUTOINCREMENT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id INTEGER, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;servico TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;descricao TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data_preferencial TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pagamento TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valor REAL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status TEXT DEFAULT 'Pendente', &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;created_at DATETIME DEFAULT CURRENT_TIMESTAMP, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOREIGN KEY(user_id) REFERENCES users(id) &nbsp;&nbsp;&nbsp;&nbsp;));
    // Serviços (NOVO)
    db.run(CREATE TABLE IF NOT EXISTS servicos ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id INTEGER PRIMARY KEY AUTOINCREMENT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nome TEXT NOT NULL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;descricao TEXT, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preco REAL NOT NULL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ativo INTEGER DEFAULT 1 &nbsp;&nbsp;&nbsp;&nbsp;));
    // Serviços iniciais
    db.run(INSERT OR IGNORE INTO servicos (id, nome, descricao, preco) VALUES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1, 'Chibi / Cartoon', 'Ideal para fotos de perfil e presentes fofos', 50), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2, 'Anime Full Body', 'Ilustração completa do corpo', 120), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3, 'Concept Art', 'Arte conceitual detalhada', 200), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(4, 'Ilustração Infantil', 'Estilo fofo para crianças', 50), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5, 'Capa de Livro / Thumbnail', 'Capa profissional ou thumbnail', 150));
    // Admin padrão
    db.run(INSERT OR IGNORE INTO users (username, password, nome, role) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUES ('admin', '1234', 'Mkjulin', 'admin'));
    console.log("✅ Banco de dados atualizado!");
});
// ====================== ROTAS ======================
// Login e Cadastro (já existentes)
app.post('/api/register', (req, res) => {
    const { nome, username, password, cpf } = req.body;
    db.run("INSERT INTO users (nome, username, password, cpf, role) VALUES (?, ?, ?, ?, 'cliente')",
        [nome, username, password, cpf], function(err) {
            if (err) return res.json({ success: false, message: "E-mail já cadastrado" });
            res.json({ success: true });const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

// ====================== CONEXÃO COM MYSQL ======================
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',           // altere se necessário
    password: '',           // coloque a senha do seu MySQL
    database: 'ilustrapro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

console.log("✅ Conectado ao MySQL com sucesso!");

// ====================== ROTAS ======================

// Cadastro
app.post('/api/register', async (req, res) => {
    try {
        const { nome, username, password, cpf } = req.body;
        await db.execute(
            "INSERT INTO users (nome, username, password, cpf, role) VALUES (?, ?, ?, ?, 'cliente')",
            [nome, username, password, cpf]
        );
        res.json({ success: true, message: "Cadastro realizado com sucesso!" });
    } catch (err) {
        res.json({ success: false, message: "E-mail já cadastrado" });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.execute(
            "SELECT id, nome, username, role FROM users WHERE username = ? AND password = ?",
            [username, password]
        );

        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.json({ success: false, message: "Email ou senha incorretos" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Erro no servidor" });
    }
});

// Agendar
app.post('/api/agendar', async (req, res) => {
    try {
        const { user_id, servico, descricao, data_preferencial, pagamento, valor } = req.body;

        if (!user_id) {
            return res.json({ success: false, message: "Você precisa estar logado" });

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
// Agendar
app.post('/api/agendar', (req, res) => {
    const { user_id, servico, descricao, data_preferencial, pagamento, valor } = req.body;
    if (!user_id) return res.json({ success: false, message: "Você precisa estar logado" });
    db.run(INSERT INTO agendamentos (user_id, servico, descricao, data_preferencial, pagamento, valor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VALUES (?, ?, ?, ?, ?, ?),
        [user_id, servico, descricao, data_preferencial, pagamento, valor],
        function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true, id: this.lastID });
        });
});
// Agendamentos e Clientes
app.get('/api/agendamentos', (req, res) => {
    db.all(SELECT a.*, u.nome as cliente_nome FROM agendamentos a &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC, [], (err, rows) => res.json(rows));
});
app.get('/api/clientes', (req, res) => {
    db.all(SELECT id, nome, username, cpf, data_cadastro FROM users WHERE role = 'cliente' ORDER BY nome,
        [], (err, rows) => res.json(rows));
});
app.get('/api/meus-pedidos/:userId', (req, res) => {
    db.all("SELECT * FROM agendamentos WHERE user_id = ? ORDER BY created_at DESC",
        [req.params.userId], (err, rows) => res.json(rows));
});
// ====================== SERVIÇOS (NOVO) ======================
// Listar serviços
app.get('/api/servicos', (req, res) => {
    db.all("SELECT * FROM servicos WHERE ativo = 1 ORDER BY id", [], (err, rows) => res.json(rows));
});
// Atualizar serviço
app.put('/api/servicos/:id', (req, res) => {
    const { nome, descricao, preco } = req.body;
    db.run("UPDATE servicos SET nome = ?, descricao = ?, preco = ? WHERE id = ?",
        [nome, descricao, preco, req.params.id], function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        });
});
// Adicionar novo serviço
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
    console.log(🚀 Servidor rodando em http://localhost:${PORT});
    console.log(Admin → usuário: admin | senha: 1234);
});
