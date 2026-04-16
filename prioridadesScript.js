function calcularIdade(dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    }

    document.addEventListener("DOMContentLoaded", () => {
      let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
      const lista = document.getElementById("listaPacientes");
      const ficha = document.getElementById("fichaPaciente");

      if (pacientes.length === 0) {
        lista.innerHTML = "<li>Nenhum paciente cadastrado ainda.</li>";
      } else {
        pacientes.forEach((p, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <span>${p.nome} | Sintomas: ${p.sintomas}</span>
            <button class="delete-btn">Excluir</button>
          `;

          // Clique para mostrar ficha completa
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
            `;
          });

          // Botão de excluir paciente
          li.querySelector(".delete-btn").addEventListener("click", () => {
            pacientes.splice(index, 1);
            localStorage.setItem("prioridades", JSON.stringify(pacientes));
            li.remove();
            ficha.style.display = "none";
          });

          lista.appendChild(li);
        });
      }
    });