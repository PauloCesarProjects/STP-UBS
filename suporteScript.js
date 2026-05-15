/**
 * Suporte STP-UBS
 * Envia a mensagem do usuário para o e-mail de suporte via mailto
 */
const suporteForm = document.querySelector(".contact-form");

if (suporteForm) {
  suporteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage("messageBox");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
      return showMessage("messageBox", "Por favor, preencha todos os campos antes de enviar.", "error");
    }

    const assunto = encodeURIComponent(`Suporte STP-UBS - ${nome}`);
    const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`);
    const destino = "pcesardasilva095@gmail.com";
    const mailtoLink = `mailto:${destino}?subject=${assunto}&body=${corpo}`;

    showMessage("messageBox", "Abrindo seu cliente de e-mail... Verifique se o aplicativo de e-mail está configurado.", "success");
    window.location.href = mailtoLink;
  });
}
