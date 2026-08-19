// ==================== SISTEMA DE AUTENTICAÇÃO ====================

function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function logout() {
    if (confirm("Deseja realmente sair da conta?")) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Verificar se usuário está logado
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = 'cadastro.html';
        return false;
    }
    return user;
}

function requireLogin() {
    return checkAuth();
}

// ==================== LOGIN ====================
async function loginUser(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
            saveUser(data.user);
            alert("✅ Login realizado com sucesso!");
            window.location.href = 'index.html';
        } else {
            alert(data.message || "Erro ao fazer login");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor");
    }
}

// ==================== CADASTRO ====================
async function registerUser(nome, username, password, cpf = '') {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, username, password, cpf })
        });
        const data = await response.json();

        if (data.success) {
            alert("✅ Cadastro realizado! Faça login agora.");
            // Se estiver na página de cadastro, volta para o formulário de login
            if (typeof showLogin === 'function') {
                showLogin();
            } else {
                window.location.href = 'cadastro.html';
            }
        } else {
            alert(data.message || "Erro ao cadastrar");
        }
    } catch (error) {
        alert("Erro ao cadastrar");
    }
}

// ==================== AGENDAMENTO ====================
async function enviarAgendamento(servico, descricao, data_preferencial, pagamento = 'PIX') {
    const user = getCurrentUser();
    if (!user) return alert("Você precisa estar logado!");

    const valores = {
        "Chibi/Cartoon": 50,
        "Anime Full Body": 120,
        "Concept Art": 200,
        "Ilustração Infantil": 50,
        "Capa de Livro / Thumbnail": 150
    };

    try {
        const response = await fetch('/api/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                servico,
                descricao,
                data_preferencial,
                pagamento,
                valor: valores[servico] || 100
            })
        });

        const data = await response.json();
        if (data.success) {
            alert("🎉 Agendamento enviado com sucesso! ID: " + data.id);
            window.location.href = 'status-pedido.html';
        } else {
            alert(data.message || "Erro ao enviar agendamento");
        }
    } catch (error) {
        alert("Erro ao enviar agendamento");
    }
}

// ==================== ATUALIZAR NAVBAR ====================
function updateNavbar() {
    const user = getCurrentUser();
    const userBtn = document.getElementById('userBtn');
    const cadastroLink = document.getElementById('cadastroLink');

    if (!userBtn) return;

    if (user) {
        if (cadastroLink) cadastroLink.style.display = 'none';
        userBtn.innerHTML = `👤 ${user.nome.split(" ")[0]} ▼`;
        userBtn.onclick = () => logout();
    } else {
        if (cadastroLink) cadastroLink.style.display = 'list-item';
        userBtn.textContent = "👤 Entrar";
        userBtn.onclick = () => window.location.href = 'cadastro.html';
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    // Suporte automático ao formulário de agendamento (se existir)
    const form = document.getElementById('agendamentoForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const servico = document.querySelector('[name="servico"]')?.value;
            const descricao = document.querySelector('[name="descricao"]')?.value;
            const data = document.querySelector('[name="data_preferencial"]')?.value || document.querySelector('[name="data"]')?.value;
            const pagamento = document.querySelector('[name="pagamento"]')?.value || 'PIX';

            if (!servico || !descricao || !data) {
                return alert("Preencha todos os campos obrigatórios");
            }

            await enviarAgendamento(servico, descricao, data, pagamento);
        });
    }
});
