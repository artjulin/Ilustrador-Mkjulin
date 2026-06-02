const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve HTML, CSS, JS

const db = new sqlite3.Database('ilustrapro.db');

// ====================== CRIAÇÃO DAS TABELAS ======================
db.serialize(() => {
  // Usuários (Admin + Clientes)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'cliente' CHECK(role IN ('admin', 'cliente'))
  )`);

  // Clientes (Informações complementares)
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    tipo TEXT,
    data_cadastro TEXT DEFAULT CURRENT_DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Agendamentos
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    servico TEXT,
    data TEXT,
    hora TEXT,
    valor REAL,
    status TEXT DEFAULT 'Pendente',
    FOREIGN KEY(cliente_id) REFERENCES clientes(id)
  )`);

  // Serviços
  db.run(`CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    descricao TEXT,
    preco REAL,
    tempo TEXT
  )`);

  // Inserir Admin padrão
  db.run(`INSERT OR IGNORE INTO users (username, password, nome, role) 
          VALUES ('admin', '1234', 'Ilustrador', 'admin')`);

  // Inserir alguns serviços iniciais
  db.run(`INSERT OR IGNORE INTO servicos (nome, descricao, preco, tempo) VALUES 
    ('Ilustração de Personagem', 'Personagem completo com fundo', 450, '5-7 dias'),
    ('Capa para Livro', 'Capa profissional para romance/fantasia', 650, '7-10 dias'),
    ('Arte para Redes Sociais', 'Post, stories ou banner', 180, '2-4 dias'),
    ('Logotipo', 'Logotipo completo + variações', 890, '10-15 dias')`);

  console.log("✅ Banco de dados carregado com sucesso!");
});

// ====================== ROTAS ======================

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT id, nome, role FROM users WHERE username = ? AND password = ?", 
    [username, password], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: "Erro interno" });
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Usuário ou senha incorretos" });
    }
  });
});

// Cadastro de Cliente
app.post('/api/register', (req, res) => {
  const { username, password, nome } = req.body;

  db.run("INSERT INTO users (username, password, nome, role) VALUES (?, ?, ?, 'cliente')",
    [username, password, nome], function(err) {
      if (err) {
        return res.json({ success: false, message: "E-mail já cadastrado" });
      }

      const userId = this.lastID;

      db.run("INSERT INTO clientes (user_id, nome, email) VALUES (?, ?, ?)",
        [userId, nome, username]);

      res.json({ success: true, message: "Cadastro realizado com sucesso!" });
    });
});

// Buscar todos os clientes (Admin)
app.get('/api/clientes', (req, res) => {
  db.all("SELECT * FROM clientes ORDER BY nome", [], (err, rows) => {
    res.json(rows);
  });
});

// Buscar agendamentos
app.get('/api/agendamentos', (req, res) => {
  db.all("SELECT * FROM agendamentos ORDER BY data DESC", [], (err, rows) => {
    res.json(rows);
  });
});

// Buscar serviços
app.get('/api/servicos', (req, res) => {
  db.all("SELECT * FROM servicos", [], (err, rows) => {
    res.json(rows);
  });
});

// ====================== INICIAR SERVIDOR ======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 IlustraPro rodando em http://localhost:${PORT}`);
  console.log(`Acesse primeiro: http://localhost:${PORT}/welcome.html`);
});
