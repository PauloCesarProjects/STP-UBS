document.querySelector(".signup-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const paciente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    nascimento: document.getElementById("data-nascimento").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
    sintomas: document.getElementById("sintomas").value
  };

  // Recupera lista existente ou cria nova
  let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
  pacientes.push(paciente);

  // Salva no localStorage
  localStorage.setItem("prioridades", JSON.stringify(pacientes));

  this.reset();
});