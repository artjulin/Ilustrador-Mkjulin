const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

let pedidos = []; // Armazenamento em memória (em produção use banco de dados)

// ==================== ROTAS ====================

// Salvar novo agendamento/pedido
app.post('/api/agendar', (req, res) => {
  const { nome, email, descricao, tipo } = req.body;
  
  const novoPedido = {
    id: Date.now(),
    nome: nome || "Cliente",
    email: email || "email@exemplo.com",
    descricao: descricao || "Sem descrição",
    tipo: tipo || "Ilustração Personalizada",
    status: "Pendente",
    data: new Date().toLocaleDateString('pt-BR'),
    timestamp: new Date()
  };
  
  pedidos.unshift(novoPedido); // Adiciona no topo
  console.log("✅ Novo pedido recebido:", novoPedido);
  
  res.json({ success: true, pedido: novoPedido });
});

// Listar todos os pedidos (para admin)
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// Listar pedidos de um cliente (simulado por email)
app.get('/api/meus-pedidos', (req, res) => {
  const email = req.query.email;
  if (email) {
    const meusPedidos = pedidos.filter(p => p.email === email);
    res.json(meusPedidos);
  } else {
    res.json(pedidos); // retorna todos se não filtrar
  }
});

// Chat (simulado)
app.post('/api/chat', (req, res) => {
  const { pedidoId, mensagem, remetente } = req.body;
  console.log(`💬 [${remetente}] Pedido #${pedidoId}: ${mensagem}`);
  res.json({ success: true, mensagem: "Mensagem enviada!" });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
