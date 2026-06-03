/**
 * Autenticação local e mensagens em tela para o STP-UBS
 */
/**
 * Retorna os dados do usuário logado armazenados na sessão
 * @returns {Object|null} - Objeto do usuário ou null se não estiver logado
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

/**
 * Exibe uma mensagem na interface em um contêiner específico
 * @param {string} containerId - ID do elemento onde a mensagem será mostrada
 * @param {string} text - Texto da mensagem
 * @param {string} type - Tipo de mensagem: info, success, error
 */
function showMessage(containerId, text, type = "info") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="message-box ${type}">${text}</div>`;
}

/**
 * Limpa as mensagens exibidas em um contêiner de interface
 * @param {string} containerId - ID do elemento de mensagem
 */
function clearMessage(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}

/**
 * Atualiza o banner de autenticação com os dados do usuário logado
 * Caso não haja usuário logado, oculta a área de status
 */
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

/**
 * Encerra a sessão do usuário e redireciona para a página inicial
 */
function logout() {
  sessionStorage.removeItem("usuarioLogadoSTP");
  window.location.href = "index.html";
}

/**
 * Renderiza a área de boas-vindas na página inicial
 * Inclui botão de logout quando o usuário está autenticado
 * @param {string} containerId - ID do elemento que receberá o conteúdo
 */
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

/**
 * Bloqueia o acesso de páginas que exigem autenticação
 * Exibe mensagem de acesso restrito caso o usuário não esteja logado
 * @param {string} [message] - Mensagem customizada de bloqueio
 * @returns {boolean} - true se houver usuário logado, false caso contrário
 */
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

/**
 * Inicializa usuários padrão no primeiro carregamento do sistema
 * Cria usuário administrativo se a lista estiver vazia
 */
function initializeDefaultUsers() {
  try {
    // Verifica se já existe dados
    const usuariosExistentes = localStorage.getItem("usuariosSTP");
    
    // Se já existem usuários, não sobrescreve
    if (usuariosExistentes) {
      try {
        const parsed = JSON.parse(usuariosExistentes);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return;
        }
      } catch (e) {
        // Se houver erro ao parsear, continua e recria
      }
    }
    
    // Define usuário administrativo padrão
    const usuarios = [
      {
        nome: "Eduardo",
        email: "EduardoADM@gmail.com",
        senha: "adm232323",
        registroTipo: "CRM",
        registroValor: "123456",
        registroOriginal: "CRM/MG 123456",
        criadoEm: new Date().toISOString()
      }
    ];
    
    // Salva no localStorage
    localStorage.setItem("usuariosSTP", JSON.stringify(usuarios));
    
    // Log de confirmação
    const verificacao = localStorage.getItem("usuariosSTP");
    if (verificacao) {
      console.log("✅ Usuário padrão inicializado com sucesso!");
      console.log("📧 Email: EduardoADM@gmail.com");
      console.log("🔑 Senha: adm232323");
    }
  } catch (err) {
    console.error("⚠️ Erro ao inicializar usuário padrão:", err);
  }
}

// Executa IMEDIATAMENTE quando o script carrega
initializeDefaultUsers();

// Também tenta no DOMContentLoaded como backup
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeDefaultUsers);
}
