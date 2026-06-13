const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

let pedidos = [];
let mensagens = {};

// ===================== ROTAS =====================

app.post('/api/agendar', (req, res) => {
  const { nome, email, tipo, descricao } = req.body;

  const novoPedido = {
    id: Date.now(),
    nome,
    email,
    tipo,
    descricao,
    status: "Pendente",
    data: new Date().toLocaleDateString('pt-BR'),
    linkFinal: null   // ← Novo campo para link da arte
  };

  pedidos.unshift(novoPedido);
  res.json({ success: true, message: "Agendamento recebido!" });
});

app.get('/api/pedidos', (req, res) => res.json(pedidos));
app.get('/api/meus-pedidos', (req, res) => {
  const email = req.query.email;
  const meus = email ? pedidos.filter(p => p.email.toLowerCase() === email.toLowerCase()) : pedidos;
  res.json(meus);
});

// Enviar encomenda final (Admin)
app.post('/api/entregar', (req, res) => {
  const { pedidoId, linkFinal } = req.body;
  
  const pedido = pedidos.find(p => p.id === parseInt(pedidoId));
  if (pedido) {
    pedido.linkFinal = linkFinal;
    pedido.status = "Entregue";
    res.json({ success: true, message: "Encomenda enviada ao cliente!" });
  } else {
    res.status(404).json({ success: false });
  }
});

// Chat
app.post('/api/mensagem', (req, res) => {
  const { pedidoId, remetente, mensagem } = req.body;
  if (!mensagens[pedidoId]) mensagens[pedidoId] = [];
  
  mensagens[pedidoId].push({
    id: Date.now(),
    remetente,
    mensagem,
    data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });
  res.json({ success: true });
});

app.get('/api/mensagens/:pedidoId', (req, res) => {
  res.json(mensagens[req.params.pedidoId] || []);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
