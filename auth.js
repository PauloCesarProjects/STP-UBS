/**
 * Autenticação local e mensagens em tela para o STP-UBS
 */
function getUsuarioLogado() {
  const raw = sessionStorage.getItem("usuarioLogadoSTP");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Erro ao ler usuário logado:", err);
    return null;
  }
}

function showMessage(containerId, text, type = "info") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="message-box ${type}">${text}</div>`;
}

function clearMessage(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}

function renderLoginStatus() {
  const banner = document.getElementById("authBanner");
  const user = getUsuarioLogado();
  if (!banner) return;
  if (!user) {
    banner.style.display = "none";
    return;
  }
  banner.style.display = "block";
  banner.textContent = `Conectado como ${user.nome} (${user.registroTipo}/${user.registroValor})`;
}

function logout() {
  sessionStorage.removeItem("usuarioLogadoSTP");
  window.location.href = "index.html";
}

function renderHomeWelcome(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const user = getUsuarioLogado();
  if (user) {
    container.innerHTML = `
      <div class="message-box success">
        Bem-vindo, ${user.nome}! <button type="button" class="login-btn" id="logoutBtn" style="margin-left: 12px;">Sair</button>
      </div>`;
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
  } else {
    container.innerHTML = `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
        <a href="criarConta.html" class="login-btn">Criar conta</a>
        <a href="login.html" class="login-btn">Entrar</a>
      </div>`;
  }
}

function requireLogin(message) {
  const user = getUsuarioLogado();
  if (user) {
    return true;
  }
  const main = document.querySelector("main");
  if (main) {
    main.innerHTML = `
      <section class="content">
        <div class="message-box error">
          <h3>Acesso restrito</h3>
          <p>${message || "Você precisa fazer login para acessar esta página."}</p>
          <a class="login-btn" href="login.html">Ir para login</a>
        </div>
      </section>`;
  }
  return false;
}
