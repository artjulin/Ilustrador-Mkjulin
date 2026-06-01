const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve os arquivos HTML, CSS, JS

const db = new sqlite3.Database('ilustrapro.db');

// Criar tabela de clientes
db.run(`CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  tipo TEXT,
  data_cadastro TEXT DEFAULT CURRENT_DATE
)`);

// Rotas
app.get('/api/clientes', (req, res) => {
  db.all("SELECT * FROM clientes ORDER BY nome", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/clientes', (req, res) => {
  const { nome, email, telefone, tipo } = req.body;
  db.run("INSERT INTO clientes (nome, email, telefone, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, telefone, tipo], function(err) {
    res.json({ id: this.lastID });
  });
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
  console.log('Acesse primeiro: http://localhost:3000/login.html');
});
