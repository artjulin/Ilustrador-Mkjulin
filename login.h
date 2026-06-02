<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IlustraPro - Entrar</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
  <style>
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0a1f 0%, #2a1b4a 100%);
    }

    .login-box {
      background: rgba(15, 10, 31, 0.95);
      border: 1px solid rgba(192, 38, 211, 0.3);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }

    .logo-login {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(90deg, #c026d3, #e879f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin-bottom: 25px;
    }

    .tabs {
      display: flex;
      background: #1f1633;
      border-radius: 12px;
      padding: 6px;
      margin-bottom: 30px;
    }

    .tab {
      flex: 1;
      padding: 12px;
      text-align: center;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: 0.3s;
    }

    .tab.active {
      background: #c026d3;
      color: white;
    }

    .input-group {
      margin-bottom: 18px;
    }

    .input-group label {
      display: block;
      margin-bottom: 8px;
      color: #c4b5fd;
    }

    .input-group input {
      width: 100%;
      padding: 15px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(192, 38, 211, 0.3);
      border-radius: 12px;
      color: white;
    }

    .btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }

    .btn-admin {
      background: linear-gradient(90deg, #7c3aed, #a855f7);
    }

    .btn-cliente {
      background: linear-gradient(90deg, #22c55e, #4ade80);
    }
  </style>
</head>
<body>

  <div class="login-container">
    <div class="login-box">
      <h1 class="logo-login">IlustraPro</h1>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab active" onclick="showSection(0)" id="tab1">👨‍🎨 Admin</div>
        <div class="tab" onclick="showSection(1)" id="tab2">👤 Cliente</div>
        <div class="tab" onclick="showSection(2)" id="tab3">📝 Cadastro</div>
      </div>

      <!-- ==================== LOGIN ADMIN ==================== -->
      <form id="adminForm">
        <h3 style="text-align:center; color:#c026d3; margin-bottom:20px;">Login do Administrador</h3>
        <div class="input-group">
          <label>Usuário</label>
          <input type="text" id="adminUser" value="admin" required>
        </div>
        <div class="input-group">
          <label>Senha</label>
          <input type="password" id="adminPass" value="1234" required>
        </div>
        <button type="submit" class="btn btn-admin">Entrar como Administrador</button>
      </form>

      <!-- ==================== LOGIN CLIENTE ==================== -->
      <form id="clienteForm" style="display: none;">
        <h3 style="text-align:center; color:#4ade80; margin-bottom:20px;">Login do Cliente</h3>
        <div class="input-group">
          <label>E-mail</label>
          <input type="email" id="clienteEmail" required>
        </div>
        <div class="input-group">
          <label>Senha</label>
          <input type="password" id="clientePass" required>
        </div>
        <button type="submit" class="btn btn-cliente">Entrar como Cliente</button>
      </form>

      <!-- ==================== CADASTRO CLIENTE ==================== -->
      <form id="cadastroForm" style="display: none;">
        <h3 style="text-align:center; color:#eab308; margin-bottom:20px;">Cadastro de Novo Cliente</h3>
        <div class="input-group">
          <label>Nome Completo</label>
          <input type="text" id="nomeCad" required>
        </div>
        <div class="input-group">
          <label>E-mail</label>
          <input type="email" id="emailCad" required>
        </div>
        <div class="input-group">
          <label>Telefone</label>
          <input type="tel" id="telefoneCad">
        </div>
        <div class="input-group">
          <label>Senha</label>
          <input type="password" id="senhaCad" required>
        </div>
        <button type="submit" class="btn" style="background: linear-gradient(90deg, #eab308, #f59e0b);">
          Criar Conta
        </button>
      </form>
    </div>
  </div>

  <script>
    function showSection(section) {
      document.getElementById('adminForm').style.display = section === 0 ? 'block' : 'none';
      document.getElementById('clienteForm').style.display = section === 1 ? 'block' : 'none';
      document.getElementById('cadastroForm').style.display = section === 2 ? 'block' : 'none';

      // Atualiza tabs
      for (let i = 1; i <= 3; i++) {
        document.getElementById(`tab${i}`).classList.toggle('active', i === section + 1);
      }
    }

    // Login Admin
    document.getElementById('adminForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('adminUser').value;
      const password = document.getElementById('adminPass').value;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success && data.user.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        alert("Acesso negado. Verifique suas credenciais de administrador.");
      }
    });

    // Login Cliente
    document.getElementById('clienteForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('clienteEmail').value;
      const password = document.getElementById('clientePass').value;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        alert("E-mail ou senha incorretos.");
      }
    });

    // Cadastro Cliente
    document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const novoUsuario = {
        username: document.getElementById('emailCad').value,
        password: document.getElementById('senhaCad').value,
        nome: document.getElementById('nomeCad').value,
        role: 'cliente'
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Cadastro realizado com sucesso! Agora faça login na aba 'Cliente'.");
        showSection(1); // Volta para login do cliente
      } else {
        alert(data.message || "Erro ao cadastrar.");
      }
    });

    // Inicia na aba Admin
    window.onload = () => showSection(0);
  </script>
</body>
</html>
