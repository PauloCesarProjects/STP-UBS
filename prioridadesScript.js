/**
 * Calcula a idade do paciente baseada na data de nascimento
 * @param {string} dataNascimento - Data no formato YYYY-MM-DD
 * @returns {number|string} - Idade em anos ou "-" se data inválida
 */
function calcularIdade(dataNascimento) {
  // Retorna traço se não houver data de nascimento
  if (!dataNascimento) return "-";

  // Cria objetos Date para data atual e nascimento
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  // Calcula diferença básica de anos
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  // Ajusta se ainda não fez aniversário este ano
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

/**
 * Converte prioridade médica em emoji visual intuitivo
 * Sistema de cores baseado em protocolos médicos de triagem
 * @param {string} cor - Prioridade: "vermelho", "laranja", "amarelo", "verde", "azul"
 * @returns {string} - Emoji correspondente à prioridade
 */
function iconePrioridade(cor) {
  switch(cor) {
    case "vermelho": return "🔴";  // Emergência máxima - atendimento imediato
    case "laranja": return "🟠";   // Urgência alta - atendimento rápido
    case "amarelo": return "🟡";   // Urgência média - atendimento programado
    case "verde": return "🟢";     // Urgência baixa - atendimento eletivo
    case "azul": return "🔵";      // Sem urgência - acompanhamento
    default: return "⚪ Não definida";  // Prioridade não classificada
  }
}

/**
 * Inicializa a interface da lista de pacientes quando a página carrega
 * Carrega dados do localStorage, ordena por prioridade e cria elementos interativos
 */
document.addEventListener("DOMContentLoaded", () => {
  // Carrega lista de pacientes do armazenamento local do navegador
  let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];

  // Referências aos elementos HTML da página
  const lista = document.getElementById("listaPacientes");
  const ficha = document.getElementById("fichaPaciente");

  // Ordem de prioridade médica (do mais urgente para menos urgente)
  const ordemPrioridade = ["vermelho", "laranja", "amarelo", "verde", "azul"];

  // Ordena pacientes pela prioridade médica usando índices do array
  pacientes.sort((a, b) => {
    const pa = ordemPrioridade.indexOf(a.prioridade || "");
    const pb = ordemPrioridade.indexOf(b.prioridade || "");
    return pa - pb;  // Ordem crescente: vermelho primeiro
  });

  // Mostra mensagem se nenhum paciente estiver cadastrado
  if (pacientes.length === 0) {
    lista.innerHTML = "<li>Nenhum paciente cadastrado ainda.</li>";
    return;
  }

  // Cria elemento de lista para cada paciente
  pacientes.forEach((p, index) => {
    const li = document.createElement("li");

    // HTML do item da lista com emoji de prioridade, nome e sintomas
    li.innerHTML = `
      <span>${iconePrioridade(p.prioridade)} ${p.nome} | Sintomas: ${p.sintomas}</span>
      <button class="delete-btn">Excluir</button>
    `;

    // Event listener para mostrar ficha completa ao clicar no nome
    li.querySelector("span").addEventListener("click", () => {
      ficha.style.display = "block";  // Torna ficha visível
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

    // Event listener para excluir paciente da lista
    li.querySelector(".delete-btn").addEventListener("click", () => {
      pacientes.splice(index, 1);  // Remove do array
      localStorage.setItem("prioridades", JSON.stringify(pacientes));  // Salva no localStorage
      li.remove();  // Remove da interface
      ficha.style.display = "none";  // Oculta ficha se estiver aberta
    });

    // Adiciona item à lista na página
    lista.appendChild(li);
  });
});