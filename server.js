const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve todos os arquivos HTML, CSS, JS

const db = new sqlite3.Database('ilustrapro.db');

// ====================== CRIAÇÃO DAS TABELAS ======================
db.serialize(() => {
  // Tabela de Usuários (Admin + Clientes)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'cliente' CHECK(role IN ('admin', 'cliente'))
  )`);

  // Tabela de Clientes (Informações adicionais)
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

  // Tabela de Agendamentos
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

  // Tabela de Serviços
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

  console.log("✅ Banco de dados inicializado!");
});

// ====================== ROTAS ======================

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT id, nome, role FROM users WHERE username = ? AND password = ?", 
    [username, password], (err, user) => {
    if (err) return res.status(500).json({ success: false });
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Usuário ou senha incorretos" });
    }
  });
});

// Cadastro (Apenas Cliente)
app.post('/api/register', (req, res) => {
  const { username, password, nome, role = 'cliente' } = req.body;

  db.run("INSERT INTO users (username, password, nome, role) VALUES (?, ?, ?, ?)",
    [username, password, nome, role], function(err) {
      if (err) {
        return res.json({ success: false, message: "E-mail já cadastrado" });
      }

      const userId = this.lastID;

      // Cadastrar também na tabela clientes
      db.run("INSERT INTO clientes (user_id, nome, email) VALUES (?, ?, ?)",
        [userId, nome, username]);

      res.json({ success: true, message: "Cadastro realizado com sucesso!" });
    });
});

// ====================== ROTAS PARA CLIENTES ======================
app.get('/api/clientes', (req, res) => {
  db.all("SELECT * FROM clientes ORDER BY nome", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/clientes', (req, res) => {
  const { nome, email, telefone, tipo } = req.body;
  db.run("INSERT INTO clientes (nome, email, telefone, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, telefone, tipo], (err) => {
      res.json({ success: !err });
    });
});

// ====================== ROTAS PARA AGENDAMENTOS ======================
app.get('/api/agendamentos', (req, res) => {
  db.all("SELECT * FROM agendamentos ORDER BY data DESC", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/agendamentos', (req, res) => {
  const { cliente, servico, data, hora, valor, status } = req.body;
  db.run(`INSERT INTO agendamentos (cliente_id, servico, data, hora, valor, status) 
          VALUES ((SELECT id FROM clientes WHERE nome = ? LIMIT 1), ?, ?, ?, ?, ?)`,
    [cliente, servico, data, hora, valor, status || 'Pendente'], (err) => {
      res.json({ success: !err });
    });
});

// ====================== INICIAR SERVIDOR ======================
app.listen(3000, () => {
  console.log('🚀 IlustraPro rodando em http://localhost:3000');
  console.log('Acesse: http://localhost:3000/login.html');
});
