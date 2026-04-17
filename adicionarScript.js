document.querySelector(".signup-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const endereco = document.getElementById("endereco").value;

  // Geocodifica o endereço e salva coordenadas
  fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(endereco + ", Caratinga, Brasil")}`)
    .then(res => res.json())
    .then(data => {
      let lat = null, lon = null;
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      }

      const paciente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("data-nascimento").value,
        telefone: document.getElementById("telefone").value,
        endereco: endereco,
        sintomas: document.getElementById("sintomas").value,
        prioridade: document.getElementById("prioridade").value,
        lat: lat,
        lon: lon
      };

      let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
      pacientes.push(paciente);

      localStorage.setItem("prioridades", JSON.stringify(pacientes));

      alert("Paciente cadastrado com sucesso!");
      this.reset();
    })
    .catch(err => {
      console.error("Erro ao geocodificar:", err);
      alert("Paciente cadastrado, mas não foi possível localizar o endereço no mapa.");
    });
});
