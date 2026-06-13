const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Banco em memória
let pedidos = [];
let mensagens = {};

// ===================== ROTAS =====================

// Agendamento → Salva e fica disponível para o Admin
app.post('/api/agendar', (req, res) => {
  const { nome, email, tipo, descricao } = req.body;

  const novoPedido = {
    id: Date.now(),
    nome: nome || "Cliente",
    email: email || "sem@email.com",
    tipo: tipo || "Ilustração",
    descricao: descricao || "Sem descrição",
    status: "Pendente",
    data: new Date().toLocaleDateString('pt-BR'),
    timestamp: new Date()
  };

  pedidos.unshift(novoPedido);
  console.log("✅ Novo agendamento recebido:", novoPedido);

  res.json({ 
    success: true, 
    message: "Agendamento enviado com sucesso! O administrador foi notificado." 
  });
});

// Listar todos os pedidos (Admin)
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// Meus Pedidos (Cliente)
app.get('/api/meus-pedidos', (req, res) => {
  const email = req.query.email;
  if (email) {
    const meus = pedidos.filter(p => p.email.toLowerCase() === email.toLowerCase());
    res.json(meus);
  } else {
    res.json(pedidos);
  }
});

// ===================== CHAT =====================
app.post('/api/mensagem', (req, res) => {
  const { pedidoId, remetente, mensagem } = req.body;

  if (!mensagens[pedidoId]) mensagens[pedidoId] = [];

  const novaMsg = {
    id: Date.now(),
    remetente,
    mensagem,
    data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  mensagens[pedidoId].push(novaMsg);
  res.json({ success: true });
});

app.get('/api/mensagens/:pedidoId', (req, res) => {
  res.json(mensagens[req.params.pedidoId] || []);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
