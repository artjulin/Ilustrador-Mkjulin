const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

let pedidos = [];
let mensagens = {}; // { pedidoId: [ {remetente, mensagem, data} ] }

// ===================== ROTAS =====================

app.post('/api/agendar', (req, res) => { /* ... mesmo código anterior */ });

app.get('/api/pedidos', (req, res) => res.json(pedidos));
app.get('/api/meus-pedidos', (req, res) => { /* ... mesmo código anterior */ });

// ==================== CHAT ====================
app.post('/api/mensagem', (req, res) => {
  const { pedidoId, remetente, mensagem } = req.body;
  
  if (!mensagens[pedidoId]) mensagens[pedidoId] = [];
  
  const novaMsg = {
    id: Date.now(),
    remetente, // 'cliente' ou 'admin'
    mensagem,
    data: new Date().toLocaleTimeString('pt-BR')
  };
  
  mensagens[pedidoId].push(novaMsg);
  console.log(`💬 Nova mensagem no pedido #${pedidoId} de ${remetente}`);
  
  res.json({ success: true, mensagem: novaMsg });
});

app.get('/api/mensagens/:pedidoId', (req, res) => {
  const pedidoId = req.params.pedidoId;
  res.json(mensagens[pedidoId] || []);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
