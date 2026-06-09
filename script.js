// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================

function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
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

// Login
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

// Cadastro
async function registerUser(nome, username, password) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, username, password })
        });
        const data = await response.json();
        
        if (data.success) {
            alert("✅ Cadastro realizado! Faça login agora.");
            window.location.href = 'cadastro.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao cadastrar");
    }
}

// Enviar Agendamento
async function enviarAgendamento(servico, descricao, data_preferencial) {
    const user = getCurrentUser();
    if (!user) return alert("Você precisa estar logado!");

    const valores = {
        "Chibi/Cartoon": 50,
        "Anime Full Body": 120,
        "Concept Art": 200
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
                valor: valores[servico] || 100
            })
        });
        
        const data = await response.json();
        if (data.success) {
            alert("🎉 Agendamento enviado com sucesso! ID: " + data.id);
            window.location.href = 'status-pedido.html';
        }
    } catch (error) {
        alert("Erro ao enviar agendamento");
    }
}

// Exemplo de uso no agendamento.html
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('agendamentoForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const servico = document.querySelector('[name="servico"]').value;
            const descricao = document.querySelector('[name="descricao"]').value;
            const data = document.querySelector('[name="data"]').value;

            await enviarAgendamento(servico, descricao, data);
        });
    }
});
