/**
 * Registro de contas STP-UBS
 * Valida CRM/COREM e persiste em localStorage como banco de dados local
 */
const contaForm = document.querySelector(".signup-form");
const messageBox = document.getElementById("messageBox");

document.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioLogado();
  if (usuario) {
    showMessage("messageBox", `Você já está logado como ${usuario.nome}.`, "success");
    if (contaForm) contaForm.style.display = "none";
  }
});

if (contaForm) {
  contaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage("messageBox");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const registro = document.getElementById("registro").value.trim();

    const registroInfo = parseRegistro(registro);
    if (!registroInfo) {
      return showMessage("messageBox", "Por favor, informe um CRM ou COREM válido. Ex.: CRM12345, COREM67890 ou CRM/SP 12345.", "error");
    }

    if (!nome || !email || !senha) {
      return showMessage("messageBox", "Preencha todos os campos obrigatórios antes de continuar.", "error");
    }

    if (!isValidEmail(email)) {
      return showMessage("messageBox", "Informe um e-mail válido.", "error");
    }

    if (senha.length < 6) {
      return showMessage("messageBox", "A senha deve ter pelo menos 6 caracteres.", "error");
    }

    const usuarios = JSON.parse(localStorage.getItem("usuariosSTP")) || [];

    const emailEmUso = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    const registroEmUso = usuarios.some(
      u => u.registroValor === registroInfo.valor && u.registroTipo === registroInfo.tipo
    );

    if (emailEmUso) {
      return showMessage("messageBox", "Este e-mail já está cadastrado. Faça login ou use outro e-mail.", "error");
    }

    if (registroEmUso) {
      return showMessage("messageBox", `Este registro ${registroInfo.tipo} já está cadastrado.`, "error");
    }

    const usuario = {
      nome,
      email,
      senha,
      registroTipo: registroInfo.tipo,
      registroValor: registroInfo.valor,
      registroOriginal: registroInfo.original,
      criadoEm: new Date().toISOString()
    };

    usuarios.push(usuario);
    localStorage.setItem("usuariosSTP", JSON.stringify(usuarios));

    showMessage("messageBox", "Conta criada com sucesso! Você pode entrar no sistema agora.", "success");
    this.reset();
  });
}

/**
 * Analisa o registro profissional informado pelo usuário
 * Aceita formatos CRM, COREM e variações com estado, hífen e espaços
 * @param {string} value - Texto do registro informado
 * @returns {Object|null} - Objeto com tipo, valor e original quando válido
 */
function parseRegistro(value) {
  if (!value) return null;
  const original = value.trim();
  const normalized = original.toUpperCase().replace(/\s+/g, " ");
  const pattern = /^(?:(CRM|COREM)(?:\/[A-Z]{2})?)\s*[-]?\s*([0-9]{3,})$/i;
  const match = normalized.match(pattern);
  if (match) {
    return { tipo: match[1].toUpperCase(), valor: match[2], original };
  }
  return null;
}

/**
 * Valida o formato básico de e-mail
 * @param {string} value - Endereço de e-mail a ser validado
 * @returns {boolean} - true se o e-mail tiver formato válido
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
