
document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([-19.7907, -42.1392], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];

  function corPrioridade(cor) {
    switch(cor) {
      case "vermelho": return "red";
      case "laranja": return "orange";
      case "amarelo": return "yellow";
      case "verde": return "green";
      case "azul": return "blue";
      default: return "gray";
    }
  }

  pacientes.forEach(p => {
    if (p.lat && p.lon) {
      const marker = L.circleMarker([p.lat, p.lon], {
        radius: 8,
        fillColor: corPrioridade(p.prioridade),
        color: corPrioridade(p.prioridade),
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(`
        <strong>${p.nome}</strong><br>
        Sintomas: ${p.sintomas}<br>
        Prioridade: ${p.prioridade}
      `);
    } else {
      console.warn("Paciente sem coordenadas:", p.nome, p.endereco);
    }
  });
});
