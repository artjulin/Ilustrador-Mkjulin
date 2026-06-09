const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); 

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

  // Clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    data_cadastro TEXT DEFAULT CURRENT_DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Agendamentos / Pedidos
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    servico TEXT,
    detalhes TEXT,
    data TEXT,
    status TEXT DEFAULT 'Aguardando Confirmação',
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Portfólio (Separado por Categoria: Digital ou Tradicional)
  db.run(`CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    imagem_url TEXT,
    tipo TEXT CHECK(tipo IN ('digital', 'tradicional'))
  )`);

  // Inserir Admin padrão
  db.run(`INSERT OR IGNORE INTO users (username, password, nome, role) 
          VALUES ('admin', '1234', 'Ilustrador', 'admin')`);

  // Dados iniciais de portfólio para demonstração
  db.run(`INSERT OR IGNORE INTO portfolio (titulo, imagem_url, tipo) VALUES 
    ('Estilo Anime / Mangá', 'cacadora.jpg', 'digital'),
    ('Estilo Cartoon', 'https://via.placeholder.com/300x260', 'digital'),
    ('Estudo de Anatomia Grafite', 'https://via.placeholder.com/300x260', 'tradicional'),
    ('Lineart Nanquim', 'hornet.jpg', 'tradicional')`);

  console.log("✅ Banco de dados reestruturado com sucesso!");
});

// ====================== ROTAS DA API ======================

// Autenticação / Login
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

// Sistema de Cadastro Dinâmico
app.post('/api/register', (req, res) => {
  const { username, password, nome, telefone } = req.body;

  db.run("INSERT INTO users (username, password, nome, role) VALUES (?, ?, ?, 'cliente')",
    [username, password, nome], function(err) {
      if (err) {
        return res.json({ success: false, message: "Este e-mail ou usuário já está em uso." });
      }
      const userId = this.lastID;
      db.run("INSERT INTO clientes (user_id, nome, email, telefone) VALUES (?, ?, ?, ?)",
        [userId, nome, username, telefone], (err) => {
          if (err) return res.json({ success: false, message: "Erro ao salvar dados do perfil." });
          res.json({ success: true, message: "Cadastro realizado com sucesso!" });
        });
    });
});

// Criar Agendamento / Pedido (Cliente)
app.post('/api/agendamentos', (req, res) => {
  const { user_id, servico, detalhes, data } = req.body;
  db.run("INSERT INTO agendamentos (user_id, servico, detalhes, data) VALUES (?, ?, ?, ?)",
    [user_id, servico, detalhes, data], function(err) {
      if (err) return res.status(500).json({ success: false, message: "Erro ao processar pedido." });
      res.json({ success: true, message: "Pedido enviado com sucesso!" });
    });
});

// Listar Pedidos de um Usuário Específico
app.get('/api/agendamentos/:user_id', (req, res) => {
  const userId = req.params.user_id;
  db.all("SELECT * FROM agendamentos WHERE user_id = ? ORDER BY data DESC", [userId], (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});

// Buscar itens do portfólio por tipo
app.get('/api/portfolio/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  db.all("SELECT * FROM portfolio WHERE tipo = ?", [tipo], (err, rows) => {
    res.json(rows);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
