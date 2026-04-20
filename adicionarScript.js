/**
 * Sistema de Cadastro de Pacientes STP-UBS
 * Processa formulário de cadastro com geocodificação automática
 * Integra dados do paciente com localização geográfica em tempo real
 */

/**
 * Event Listener para submissão do formulário de cadastro
 * Executa validação, geocodificação e persistência dos dados
 * @param {Event} e - Evento de submissão do formulário
 */
document.querySelector(".signup-form").addEventListener("submit", function(e) {
  // Previne o comportamento padrão do formulário (recarregamento da página)
  // Permite processamento personalizado dos dados
  e.preventDefault();

  // Captura o valor do campo de endereço para geocodificação
  const endereco = document.getElementById("endereco").value;

  // ===================================================================================
  // GEOCODIFICAÇÃO: CONVERSÃO ENDEREÇO → COORDENADAS GPS
  // ===================================================================================

  /**
   * Requisição HTTP para API Nominatim (OpenStreetMap)
   * Converte endereço textual em coordenadas geográficas
   * Essencial para visualização no mapa de prioridades
   */
  fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(endereco + ", Caratinga, Brasil")}`)

    // Primeiro .then(): Processa resposta HTTP da API
    .then(res => res.json())

    // Segundo .then(): Processa dados da geocodificação e cadastra paciente
    .then(data => {
      // Inicializa coordenadas como null (fallback para geocodificação falha)
      let lat = null, lon = null;

      // Verifica se API retornou resultados válidos
      if (data && data.length > 0) {
        // Converte strings de latitude/longitude para números
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      }

      // =================================================================================
      // CRIAÇÃO DO OBJETO PACIENTE
      // =================================================================================

      /**
       * Monta objeto estruturado com todos os dados do paciente
       * Estrutura padronizada para consistência no sistema
       * Inclui dados pessoais, médicos e geográficos
       */
      const paciente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("data-nascimento").value,
        telefone: document.getElementById("telefone").value,
        endereco: endereco,
        sintomas: document.getElementById("sintomas").value,
        prioridade: document.getElementById("prioridade").value,
        lat: lat,  // Coordenada latitude (pode ser null)
        lon: lon   // Coordenada longitude (pode ser null)
      };

      // =================================================================================
      // PERSISTÊNCIA DE DADOS NO LOCALSTORAGE
      // =================================================================================

      // Carrega lista existente de pacientes ou cria array vazio
      let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];

      // Adiciona novo paciente ao final da lista
      pacientes.push(paciente);

      // Salva lista atualizada no localStorage do navegador
      // JSON.stringify converte objeto JavaScript em string JSON
      localStorage.setItem("prioridades", JSON.stringify(pacientes));

      // Reseta todos os campos do formulário para próximo cadastro
      this.reset();
    })

    // =================================================================================
    // TRATAMENTO DE ERROS NA GEOCODIFICAÇÃO
    // =================================================================================

    /**
     * Captura qualquer erro na cadeia de Promises
     * Executado se geocodificação falhar por qualquer motivo
     * Paciente ainda é cadastrado, mas sem coordenadas geográficas
     */
    .catch(err => {
      // Registra erro detalhado no console para debugging
      console.error("Erro ao geocodificar:", err);

      // Feedback ao usuário sobre falha na geocodificação
      // Paciente é cadastrado mesmo sem localização no mapa
      alert("Paciente cadastrado, mas não foi possível localizar o endereço no mapa.");
    });
});
