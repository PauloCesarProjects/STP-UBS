/**
 * Autenticação local STP-UBS
 * Verifica e-mail e senha usando contas salvas em localStorage
 */

// Captura o formulário de login e a área de mensagens na tela
const loginForm = document.querySelector(".login-form");
const messageBox = document.getElementById("messageBox");

// Se já houver usuário logado, exibe a mensagem e esconde o formulário
document.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioLogado();
  if (usuario) {
    showMessage("messageBox", `Você já está logado como ${usuario.nome}.`, "success");
    if (loginForm) loginForm.style.display = "none";
  }
});

// Executa a validação quando o usuário envia o formulário de login
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    // Evita o envio automático do formulário e o reload da página
    e.preventDefault();

    // Limpa mensagens anteriores antes de validar novamente
    clearMessage("messageBox");

    // Captura valores dos campos de e-mail e senha
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Verifica se o usuário preencheu ambos os campos
    if (!email || !senha) {
      return showMessage("messageBox", "Preencha e-mail e senha para entrar.", "error");
    }

    // Busca a lista de contas registradas no localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuariosSTP")) || [];

    // Procura a conta que tenha o mesmo e-mail informado
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Se não existir conta com o e-mail informado, mostra erro
    if (!usuario) {
      return showMessage("messageBox", "Usuário não encontrado. Verifique seu e-mail ou crie uma conta.", "error");
    }

    // Verifica se a senha informada confere com a conta encontrada
    if (usuario.senha !== senha) {
      return showMessage("messageBox", "Senha incorreta. Tente novamente.", "error");
    }

    // Salva os dados do usuário logado apenas na sessão atual
    sessionStorage.setItem("usuarioLogadoSTP", JSON.stringify({
      nome: usuario.nome,
      email: usuario.email,
      registroTipo: usuario.registroTipo,
      registroValor: usuario.registroValor
    }));

    // Mostra mensagem de sucesso e redireciona para a página inicial
    showMessage("messageBox", `Bem-vindo(a), ${usuario.nome}! Redirecionando para o sistema...`, "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  });
}
