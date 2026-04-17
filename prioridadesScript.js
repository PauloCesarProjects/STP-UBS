function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "-";
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function iconePrioridade(cor) {
  switch(cor) {
    case "vermelho": return "🔴";
    case "laranja": return "🟠";
    case "amarelo": return "🟡";
    case "verde": return "🟢";
    case "azul": return "🔵";
    default: return "⚪ Não definida";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
  const lista = document.getElementById("listaPacientes");
  const ficha = document.getElementById("fichaPaciente");

  const ordemPrioridade = ["vermelho", "laranja", "amarelo", "verde", "azul"];

  // Ordena pela prioridade
  pacientes.sort((a, b) => {
    const pa = ordemPrioridade.indexOf(a.prioridade || "");
    const pb = ordemPrioridade.indexOf(b.prioridade || "");
    return pa - pb;
  });

  if (pacientes.length === 0) {
    lista.innerHTML = "<li>Nenhum paciente cadastrado ainda.</li>";
    return;
  }

  pacientes.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${iconePrioridade(p.prioridade)} ${p.nome} | Sintomas: ${p.sintomas}</span>
      <button class="delete-btn">Excluir</button>
    `;

    // Mostrar ficha completa
    li.querySelector("span").addEventListener("click", () => {
      ficha.style.display = "block";
      ficha.innerHTML = `
        <h3>Ficha do Paciente</h3>
        <p><strong>Nome:</strong> ${p.nome}</p>
        <p><strong>CPF:</strong> ${p.cpf}</p>
        <p><strong>Idade:</strong> ${calcularIdade(p.nascimento)} anos</p>
        <p><strong>Telefone:</strong> ${p.telefone}</p>
        <p><strong>Endereço:</strong> ${p.endereco}</p>
        <p><strong>Sintomas:</strong> ${p.sintomas}</p>
        <p><strong>Prioridade:</strong> ${iconePrioridade(p.prioridade)} ${p.prioridade || "Não definida"}</p>
      `;
    });

    // Excluir paciente
    li.querySelector(".delete-btn").addEventListener("click", () => {
      pacientes.splice(index, 1);
      localStorage.setItem("prioridades", JSON.stringify(pacientes));
      li.remove();
      ficha.style.display = "none";
    });

    lista.appendChild(li);
  });
});