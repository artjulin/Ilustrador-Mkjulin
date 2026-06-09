document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAÇÃO DE PRIVACIDADE E ACESSO NA TELA DE AGENDAMENTO
    const areaLiberada = document.getElementById('area-liberada');
    const areaBloqueada = document.getElementById('area-bloqueada');

    if (areaLiberada && areaBloqueada) {
        const clienteLogado = localStorage.getItem('clienteLogado');
        if (clienteLogado === 'true') {
            areaLiberada.style.display = 'block';
            areaBloqueada.style.display = 'none';
        } else {
            areaLiberada.style.display = 'none';
            areaBloqueada.style.display = 'block';
        }
    }

    // 2. EXIBIR NOME DINÂMICO NA ÁREA DO CLIENTE
    const boasVindasTxt = document.getElementById('boas-vindas');
    if (boasVindasTxt) {
        const nomeCliente = localStorage.getItem('nomeCliente');
        if (nomeCliente) {
            boasVindasTxt.innerText = `Painel de ${nomeCliente}`;
        }
    }

    // 3. ENVIO DO FORMULÁRIO DE CADASTRO VIA AJAX/FETCH
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch('/api/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, whatsapp, senha })
                });

                const data = await response.json();

                if (data.success) {
                    // Armazena dados da sessão no navegador
                    localStorage.setItem('clienteLogado', 'true');
                    localStorage.setItem('nomeCliente', nome);
                    localStorage.setItem('emailCliente', email);

                    alert(data.message);
                    window.location.href = 'agendamento.html'; // Redireciona para o agendamento liberado
                } else {
                    alert(data.message || 'Erro ao realizar cadastro.');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

    // 4. ENVIO DO FORMULÁRIO DE AGENDAMENTO VIA AJAX/FETCH
    const formAgendamento = document.querySelector('#area-liberada form');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async (e) => {
            e.preventDefault();

            const estilo = document.getElementById('estilo').value;
            const detalhes = document.getElementById('detalhes').value;
            const prazo = document.getElementById('prazo').value;
            const emailCliente = localStorage.getItem('emailCliente');

            try {
                const response = await fetch('/api/agendamentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estilo, detalhes, prazo, emailCliente })
                });

                const data = await response.json();

                if (data.success) {
                    alert(`${data.message}\nSeu número de protocolo é: #${data.pedidoId}`);
                    window.location.href = 'clientes.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Erro ao agendar:', error);
                alert('Erro de rede ao processar agendamento.');
            }
        });
    }
});

// 5. FUNÇÃO DE LOGOUT
function fazerLogout() {
    localStorage.clear();
    alert('Sessão encerrada com sucesso!');
    window.location.href = 'portfolio.html';
}
