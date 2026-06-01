// Menu ativo
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Função para formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Exemplo de dados mockados
const mockClientes = [
    { id: 1, nome: "Ana Clara", email: "ana@email.com", telefone: "(41) 98765-4321" },
    { id: 2, nome: "João Mendes", email: "joao@email.com", telefone: "(41) 99876-5432" }
];

// Função para carregar clientes (usada na página clientes.html)
function loadClientes() {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = mockClientes.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
                <button class="btn" onclick="alert('Abrindo perfil de ${cliente.nome}')">Ver</button>
            </td>
        </tr>
    `).join('');
}
