const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar dados de formulários e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (CSS, JS, Imagens) a partir da pasta raiz ou 'public'
app.use(express.static(path.join(__dirname)));

// Bancos de dados simulados em memória (Arrays)
const usuarios = [];
const agendamentos = [];

/* ==========================================================================
   ROTAS DE NAVEGAÇÃO (SERVIR HTML)
   ========================================================================== */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio.html'));
});

app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio.html'));
});

app.get('/agendamento', (req, res) => {
    res.sendFile(path.join(__dirname, 'agendamento.html'));
});

app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'clientes.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastro.html'));
});

/* ==========================================================================
   ROTAS DA API (SISTEMA DE CLIENTES E AGENDAMENTO)
   ========================================================================== */

// Rota para cadastrar um novo cliente
app.post('/api/cadastro', (req, res) => {
    const { nome, email, whatsapp, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios." });
    }

    // Verifica se o e-mail já existe
    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
        return res.status(400).json({ success: false, message: "Este e-mail já está cadastrado." });
    }

    const novoUsuario = { id: usuarios.length + 1, nome, email, whatsapp, senha };
    usuarios.push(novoUsuario);

    console.log(`[Sucesso] Novo cliente cadastrado: ${nome} (${email})`);
    
    return res.json({ success: true, message: "Cadastro realizado com sucesso!", cliente: { nome, email } });
});

// Rota para criar um agendamento (Protegida logicamente)
app.post('/api/agendamentos', (req, res) => {
    const { estilo, detalhes, prazo, emailCliente } = req.body;

    if (!estilo || !detalhes || !prazo) {
        return res.status(400).json({ success: false, message: "Campos do agendamento incompletos." });
    }

    const novoAgendamento = {
        id: agendamentos.length + 1,
        estilo,
        detalhes,
        prazo,
        cliente: emailCliente || "Anônimo (LocalStorage)",
        status: "Aguardando Aprovação",
        dataSolicitacao: new Date().toLocaleDateString('pt-BR')
    };

    agendamentos.push(novoAgendamento);
    console.log(`[Novo Agendamento] Pedido #${novoAgendamento.id} recebido.`);

    return res.json({ success: true, message: "Agendamento registrado na fila com sucesso!", pedidoId: novoAgendamento.id });
});

// Rota para buscar agendamentos de um cliente específico
app.get('/api/meus-pedidos', (req, res) => {
    const email = req.query.email;
    const pedidosFiltrados = agendamentos.filter(p => p.cliente === email);
    res.json(pedidosFiltrados);
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Servidor rodando em: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
