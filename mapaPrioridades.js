
/**
 * Sistema de Visualização Geográfica de Pacientes STP-UBS
 * Renderiza mapa interativo com localização dos pacientes por prioridade médica
 * Utiliza Leaflet.js para mapas e OpenStreetMap para tiles base
 */

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o mapa Leaflet centrado em Caratinga-MG com zoom nível 13
  // Coordenadas aproximadas do centro de Caratinga
  const map = L.map('map').setView([-19.7907, -42.1392], 13);

  // Adiciona a camada de tiles do OpenStreetMap ao mapa
  // Tiles gratuitos fornecidos pela comunidade OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Carrega a lista de pacientes armazenada no localStorage do navegador
  let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];

  /**
   * Converte prioridade médica em cor para visualização no mapa
   * Sistema de cores padronizado para identificação visual rápida
   * @param {string} cor - Prioridade: "vermelho", "laranja", "amarelo", "verde", "azul"
   * @returns {string} - Nome da cor CSS correspondente
   */
  function corPrioridade(cor) {
    switch(cor) {
      case "vermelho": return "red";      // Emergência máxima
      case "laranja": return "orange";    // Urgência alta
      case "amarelo": return "yellow";    // Urgência média
      case "verde": return "green";       // Urgência baixa
      case "azul": return "blue";         // Sem urgência
      default: return "gray";             // Não classificada
    }
  }

  // Itera sobre cada paciente para criar marcadores no mapa
  pacientes.forEach(p => {
    // Verifica se o paciente possui coordenadas GPS válidas
    if (p.lat && p.lon) {
      // Cria marcador circular colorido baseado na prioridade médica
      // CircleMarker é ideal para pontos sem ícone específico
      const marker = L.circleMarker([p.lat, p.lon], {
        radius: 8,                    // Tamanho do círculo em pixels
        fillColor: corPrioridade(p.prioridade),  // Cor de preenchimento
        color: corPrioridade(p.prioridade),      // Cor da borda
        weight: 2,                    // Espessura da borda
        opacity: 1,                   // Opacidade da borda
        fillOpacity: 0.8              // Opacidade do preenchimento
      }).addTo(map);  // Adiciona o marcador ao mapa

      // Cria popup informativo que aparece ao clicar no marcador
      // HTML formatado com informações essenciais do paciente
      marker.bindPopup(`
        <strong>${p.nome}</strong><br>
        Sintomas: ${p.sintomas}<br>
        Prioridade: ${p.prioridade}
      `);
    } else {
      // Loga aviso no console para pacientes sem coordenadas geográficas
      // Útil para debug e identificação de problemas na geocodificação
      console.warn("Paciente sem coordenadas:", p.nome, p.endereco);
    }
  });
});
