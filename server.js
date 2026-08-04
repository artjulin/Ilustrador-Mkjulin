const express = require('express');
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
        }

        const [result] = await db.execute(
            `INSERT INTO agendamentos (user_id, servico, descricao, data_preferencial, pagamento, valor)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, servico, descricao, data_preferencial, pagamento, valor]
        );

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.json({ success: false, message: "Erro ao salvar agendamento" });
    }
});

// Todos os agendamentos (Admin)
app.get('/api/agendamentos', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.*, u.nome as cliente_nome
            FROM agendamentos a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

// Todos os clientes (Admin)
app.get('/api/clientes', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT id, nome, username, cpf, data_cadastro
            FROM users
            WHERE role = 'cliente'
            ORDER BY nome
        `);
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

// Meus Pedidos
app.get('/api/meus-pedidos/:userId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM agendamentos WHERE user_id = ? ORDER BY created_at DESC",
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

// ====================== SERVIÇOS ======================

// Listar serviços
app.get('/api/servicos', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM servicos WHERE ativo = 1 ORDER BY id");
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

// Atualizar serviço
app.put('/api/servicos/:id', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;
        await db.execute(
            "UPDATE servicos SET nome = ?, descricao = ?, preco = ? WHERE id = ?",
            [nome, descricao, preco, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

// Adicionar novo serviço
app.post('/api/servicos', async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;
        const [result] = await db.execute(
            "INSERT INTO servicos (nome, descricao, preco) VALUES (?, ?, ?)",
            [nome, descricao, preco]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.json({ success: false });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Admin → usuário: admin | senha: 1234`);
});
