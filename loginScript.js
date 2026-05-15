/**
 * Autenticação local STP-UBS
 * Verifica e-mail e senha usando contas salvas em localStorage
 */
const loginForm = document.querySelector(".login-form");
const messageBox = document.getElementById("messageBox");

document.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioLogado();
  if (usuario) {
    showMessage("messageBox", `Você já está logado como ${usuario.nome}.`, "success");
    if (loginForm) loginForm.style.display = "none";
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage("messageBox");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      return showMessage("messageBox", "Preencha e-mail e senha para entrar.", "error");
    }

    const usuarios = JSON.parse(localStorage.getItem("usuariosSTP")) || [];
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!usuario) {
      return showMessage("messageBox", "Usuário não encontrado. Verifique seu e-mail ou crie uma conta.", "error");
    }

    if (usuario.senha !== senha) {
      return showMessage("messageBox", "Senha incorreta. Tente novamente.", "error");
    }

    sessionStorage.setItem("usuarioLogadoSTP", JSON.stringify({
      nome: usuario.nome,
      email: usuario.email,
      registroTipo: usuario.registroTipo,
      registroValor: usuario.registroValor
    }));

    showMessage("messageBox", `Bem-vindo(a), ${usuario.nome}! Redirecionando para o sistema...`, "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  });
}
