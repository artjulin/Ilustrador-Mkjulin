const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

const db = new sqlite3.Database('ilustrapro.db');

// Criar tabelas
db.serialize(() => {
  // Usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    nome TEXT,
    role TEXT DEFAULT 'cliente'  -- 'admin' ou 'cliente'
  )`);

  // Clientes (pessoas que contratam)
  db.run(`CREATE TABLE IF NOT EXISTS clientes (...)`); // mantenha as anteriores

  // Inserir usuário admin padrão
  db.run(`INSERT OR IGNORE INTO users (username, password, nome, role) VALUES 
    ('admin', '1234', 'Ilustrador', 'admin')`);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", 
    [username, password], (err, user) => {
    if (user) {
      res.json({ success: true, user: { id: user.id, nome: user.nome, role: user.role } });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
