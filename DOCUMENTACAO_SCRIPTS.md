# 📝 Documentação Completa dos Scripts - STP-UBS

---

## 📚 Índice de Scripts

O STP-UBS usa **7 arquivos JavaScript** que trabalham juntos para gerenciar autenticação, dados de pacientes e visualização:

1. **auth.js** - Autenticação e funções gerais
2. **loginScript.js** - Página de login
3. **contaScript.js** - Criação de contas
4. **adicionarScript.js** - Cadastro de pacientes
5. **prioridadesScript.js** - Listagem de prioridades
6. **mapaPrioridades.js** - Mapa de calor geográfico
7. **suporteScript.js** - Formulário de suporte

---

## 🔐 SCRIPT 1: auth.js (Core de Autenticação)

### Propósito
Núcleo central do sistema de autenticação e funções auxiliares para toda a aplicação.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\auth.js`

### Funções Principais

#### 1️⃣ `getUsuarioLogado()`
```javascript
function getUsuarioLogado() {
  const raw = sessionStorage.getItem("usuarioLogadoSTP");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Erro ao ler usuário logado:", err);
    return null;
  }
}
```

**O que faz:**
- Recupera os dados do usuário logado da `sessionStorage`
- `sessionStorage` armazena dados apenas para a sessão atual (limpa ao fechar a aba)
- Retorna `null` se não houver usuário logado

**Dados retornados:**
```javascript
{
  nome: "Maria Silva",
  email: "maria@example.com",
  registroTipo: "CRM",  // ou COREM
  registroValor: "12345"
}
```

**Quando é usada:**
- No carregamento de cada página para verificar autenticação
- Para preencher o banner de status
- Para bloquear acesso a páginas protegidas

---

#### 2️⃣ `showMessage(containerId, text, type)`
```javascript
function showMessage(containerId, text, type = "info") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="message-box ${type}">${text}</div>`;
}
```

**O que faz:**
- Exibe mensagens na interface do usuário
- Aplica estilo CSS baseado no tipo

**Parâmetros:**
- `containerId` - ID do elemento HTML onde a mensagem aparece
- `text` - Texto a ser exibido
- `type` - Tipo: `"info"`, `"success"`, ou `"error"`

**Exemplo de uso:**
```javascript
showMessage("messageBox", "Bem-vindo ao STP-UBS!", "success");
```

**Renderização:**
- `info` → Cor neutra (informação)
- `success` → Verde (sucesso)
- `error` → Vermelho (erro)

---

#### 3️⃣ `clearMessage(containerId)`
```javascript
function clearMessage(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}
```

**O que faz:**
- Remove mensagens anteriores
- Limpa a área para nova mensagem
- Evita acúmulo de mensagens

**Quando é usada:**
- Antes de validar novo formulário
- Para "limpar a tela" entre requisições

---

#### 4️⃣ `renderLoginStatus()`
```javascript
function renderLoginStatus() {
  const banner = document.getElementById("authBanner");
  const user = getUsuarioLogado();
  if (!banner) return;
  if (!user) {
    banner.style.display = "none";
    return;
  }
  banner.style.display = "block";
  banner.textContent = `Conectado como ${user.nome} (${user.registroTipo}/${user.registroValor})`;
}
```

**O que faz:**
- Atualiza o banner de autenticação no topo da página
- Mostra nome e registro do usuário logado
- Esconde o banner se não houver usuário logado

**Exemplo de saída:**
```
Conectado como Maria Silva (CRM/12345)
```

**Quando é usada:**
- No carregamento de cada página
- Sempre que há mudança de autenticação

---

#### 5️⃣ `logout()`
```javascript
function logout() {
  sessionStorage.removeItem("usuarioLogadoSTP");
  window.location.href = "index.html";
}
```

**O que faz:**
- Remove dados do usuário da sessão
- Redireciona para página inicial
- Encerra a sessão do usuário

**Fluxo:**
1. Remove usuário da sessionStorage
2. Redireciona para index.html
3. Usuário é deslogado

---

#### 6️⃣ `renderHomeWelcome(containerId)`
```javascript
function renderHomeWelcome(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const user = getUsuarioLogado();
  if (user) {
    container.innerHTML = `
      <div class="message-box success">
        Bem-vindo, ${user.nome}! 
        <button type="button" class="login-btn" id="logoutBtn">Sair</button>
      </div>`;
    // Adiciona evento ao botão de logout...
  } else {
    container.innerHTML = `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="criarConta.html" class="login-btn">Criar conta</a>
        <a href="login.html" class="login-btn">Entrar</a>
      </div>`;
  }
}
```

**O que faz:**
- Renderiza seção de bem-vinda na página inicial
- Se logado: Mostra mensagem + botão Sair
- Se não logado: Mostra botões Criar conta / Entrar

**Renderização dinâmica:**
```
[Usuário logado]
┌─────────────────────────────┐
│ Bem-vindo, Maria Silva! [X] │
└─────────────────────────────┘

[Usuário não logado]
┌──────────────┬──────────┐
│ Criar conta  │  Entrar  │
└──────────────┴──────────┘
```

---

#### 7️⃣ `requireLogin(message)`
```javascript
function requireLogin(message) {
  const user = getUsuarioLogado();
  if (user) {
    return true;
  }
  const main = document.querySelector("main");
  if (main) {
    main.innerHTML = `
      <section class="content">
        <div class="message-box error">
          <h3>Acesso restrito</h3>
          <p>${message || "Você precisa fazer login para acessar esta página."}</p>
          <a class="login-btn" href="login.html">Ir para login</a>
        </div>
      </section>`;
  }
  return false;
}
```

**O que faz:**
- Bloqueia páginas que exigem autenticação
- Se não há usuário logado, exibe mensagem de restrição
- Se há usuário, permite acesso (retorna true)

**Fluxo em páginas protegidas:**
```javascript
// No topo do adicionarScript.js, por exemplo:
if (!requireLogin()) {
  // O código abaixo não executa se não estiver logado
} else {
  // Código só executa se logado
}
```

**Proteção visual:**
```
╔════════════════════════════════╗
║    ACESSO RESTRITO             ║
║                                ║
║  Você precisa fazer login      ║
║  para acessar esta página.     ║
║                                ║
║  [Ir para login]               ║
╚════════════════════════════════╝
```

### Armazenamento de Dados

**sessionStorage vs localStorage:**
```
sessionStorage (auth.js)
├── "usuarioLogadoSTP" → Dados do usuário da sessão atual
└── Limpa ao fechar a aba ❌

localStorage (outros scripts)
├── "usuariosSTP" → Lista de todas as contas
├── "prioridades" → Lista de pacientes
└── Permanece até usuário limpar cache ✅
```

---

## 🔑 SCRIPT 2: loginScript.js (Página de Login)

### Propósito
Gerencia a página de login: valida credenciais e cria sessão do usuário.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\loginScript.js`

### Fluxo Completo do Login

```
1. Usuário preenche e-mail e senha
        ↓
2. Clica em "Entrar"
        ↓
3. Formulário dispara evento "submit"
        ↓
4. JavaScript valida os campos
        ↓
5. Busca no localStorage por usuário com esse e-mail
        ↓
6. Se encontrar: valida a senha
        ↓
7. Se correto: Salva dados na sessionStorage
        ↓
8. Mostra "Bem-vindo!" e redireciona
```

### Código Passo-a-Passo

#### Captura do Formulário
```javascript
const loginForm = document.querySelector(".login-form");
const messageBox = document.getElementById("messageBox");
```

**O que é:**
- `loginForm` = referência ao formulário HTML
- `messageBox` = onde exibir mensagens de erro/sucesso

#### Verificação de Usuário Já Logado
```javascript
document.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioLogado();
  if (usuario) {
    showMessage("messageBox", `Você já está logado como ${usuario.nome}.`, "success");
    if (loginForm) loginForm.style.display = "none";
  }
});
```

**Cenário:** Se usuário já está logado
- Mostra mensagem "Você já está logado como..."
- Esconde o formulário de login
- Evita re-login acidental

#### Event Listener do Formulário
```javascript
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();  // Evita recarregamento da página
    clearMessage("messageBox");  // Limpa mensagens anteriores
    
    // ... validações e processamento ...
  });
}
```

#### Validação de Campos Vazios
```javascript
const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value;

if (!email || !senha) {
  return showMessage("messageBox", "Preencha e-mail e senha para entrar.", "error");
}
```

**Validações:**
- E-mail não pode estar vazio
- Senha não pode estar vazia
- `.trim()` remove espaços em branco

#### Busca do Usuário
```javascript
const usuarios = JSON.parse(localStorage.getItem("usuariosSTP")) || [];
const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

if (!usuario) {
  return showMessage("messageBox", "Usuário não encontrado.", "error");
}
```

**Lógica:**
1. Carrega lista de usuários do localStorage
2. Busca usuário com e-mail correspondente
3. Comparação case-insensitive (maiúscula/minúscula)
4. Se não encontrar → mostra erro

#### Validação de Senha
```javascript
if (usuario.senha !== senha) {
  return showMessage("messageBox", "Senha incorreta.", "error");
}
```

**Segurança Observação:**
> ⚠️ Em produção, senhas devem ser hasheadas (MD5, bcrypt), não armazenadas em texto puro!

#### Criação da Sessão
```javascript
sessionStorage.setItem("usuarioLogadoSTP", JSON.stringify({
  nome: usuario.nome,
  email: usuario.email,
  registroTipo: usuario.registroTipo,
  registroValor: usuario.registroValor
}));
```

**O que ocorre:**
- Cria objeto com dados do usuário
- Converte para JSON
- Armazena na sessionStorage
- Dados disponíveis até fechar a aba

#### Redirecionamento
```javascript
showMessage("messageBox", `Bem-vindo(a), ${usuario.nome}!...`, "success");
setTimeout(() => {
  window.location.href = "index.html";
}, 1200);
```

**Sequência:**
1. Mostra mensagem de sucesso
2. Aguarda 1.2 segundos
3. Redireciona para index.html
4. Usuário vê o efeito visual

### Diagrama de Decisão

```
┌─────────────────┐
│ Formulário      │
│ Preenchido      │
└────────┬────────┘
         ↓
    ┌────────────────────┐
    │ E-mail vazio?      │ → ❌ Erro
    └────────┬───────────┘
             ↓ Não
    ┌────────────────────┐
    │ E-mail existe?     │ ← Busca em localStorage
    └────────┬───────────┘
             ↓ Sim
    ┌────────────────────┐
    │ Senha correta?     │
    └────────┬───────────┘
             ↓ Sim
    ┌────────────────────┐
    │ Criar sessão       │ → ✅ Login bem-sucedido
    └────────────────────┘
```

---

## 👤 SCRIPT 3: contaScript.js (Criar Conta)

### Propósito
Permite que profissionais de saúde criem contas no sistema.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\contaScript.js`

### Fluxo de Criação de Conta

```
1. Profissional preenche formulário
   ├─ Nome completo
   ├─ E-mail
   ├─ Senha
   └─ CRM ou COREM
        ↓
2. JavaScript valida cada campo
        ↓
3. Verifica se CRM/COREM é válido
        ↓
4. Verifica se e-mail não está em uso
        ↓
5. Verifica se CRM/COREM não está em uso
        ↓
6. Se tudo ok: Salva no localStorage
        ↓
7. Mostra "Conta criada com sucesso!"
```

### Validações Principais

#### 1️⃣ Validação de CRM/COREM

```javascript
function parseRegistro(value) {
  if (!value) return null;
  const original = value.trim();
  const normalized = original.toUpperCase().replace(/\s+/g, " ");
  const pattern = /^(?:(CRM|COREM)(?:\/[A-Z]{2})?)\s*[-]?\s*([0-9]{3,})$/i;
  const match = normalized.match(pattern);
  if (match) {
    return { tipo: match[1].toUpperCase(), valor: match[2], original };
  }
  return null;
}
```

**Formatos aceitos:**
```
✅ CRM12345
✅ CRM/SP 12345
✅ CRM-SP-12345
✅ COREM67890
✅ COREM/RJ 67890

❌ 12345 (sem CRM/COREM)
❌ CR123 (sigla incompleta)
❌ CRM ABC (sem números)
```

**Exemplo de parse:**
```javascript
parseRegistro("CRM/SP 12345")
// Retorna:
{
  tipo: "CRM",
  valor: "12345",
  original: "CRM/SP 12345"
}
```

#### 2️⃣ Validação de E-mail

```javascript
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

**Padrão:**
- Algo @ Algo . Algo
- Sem espaços
- Deve ter ponto no domínio

**Exemplos:**
```
✅ maria@saude.com
✅ joao.silva@ubs.gov.br

❌ mariadasilva (sem @)
❌ maria@ (sem domínio)
❌ maria@com (sem .com)
```

#### 3️⃣ Validação de Senha

```javascript
if (senha.length < 6) {
  return showMessage("messageBox", "A senha deve ter pelo menos 6 caracteres.", "error");
}
```

**Requisitos:**
- Mínimo 6 caracteres
- Sem requisitos de complexidade (letras, números, símbolos)

#### 4️⃣ Verificação de Duplicatas

```javascript
const usuarios = JSON.parse(localStorage.getItem("usuariosSTP")) || [];

const emailEmUso = usuarios.some(u => 
  u.email.toLowerCase() === email.toLowerCase()
);

const registroEmUso = usuarios.some(u => 
  u.registroValor === registroInfo.valor && 
  u.registroTipo === registroInfo.tipo
);
```

**O que verifica:**
- E-mail já foi cadastrado?
- CRM/COREM já foi cadastrado?
- Se sim: mostra erro correspondente

### Estrutura do Usuário Armazenado

```javascript
{
  nome: "Maria Silva",
  email: "maria@example.com",
  senha: "123456",  // ⚠️ Texto puro (melhorar em produção!)
  registroTipo: "CRM",
  registroValor: "12345",
  registroOriginal: "CRM/SP 12345",
  criadoEm: "2026-06-03T10:30:00.000Z"
}
```

### Armazenamento

```javascript
const usuario = {
  nome, email, senha, registroTipo, registroValor, 
  registroOriginal, criadoEm
};

usuarios.push(usuario);
localStorage.setItem("usuariosSTP", JSON.stringify(usuarios));
```

**Resultado:**
- Novo usuário adicionado ao array
- Array inteiro salvo em localStorage
- Próximo login poderá validar contra essa conta

### Checklist de Validação

```
├─ Campo: Nome
│  └─ Preenchido? ✓
│
├─ Campo: E-mail
│  ├─ Preenchido? ✓
│  ├─ Formato válido? ✓
│  └─ Não está em uso? ✓
│
├─ Campo: Senha
│  ├─ Preenchido? ✓
│  └─ Mínimo 6 caracteres? ✓
│
└─ Campo: CRM/COREM
   ├─ Preenchido? ✓
   ├─ Formato válido? ✓
   └─ Não está em uso? ✓
```

---

## ➕ SCRIPT 4: adicionarScript.js (Cadastro de Pacientes)

### Propósito
Gerencia o cadastro de novos pacientes com geocodificação automática.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\adicionarScript.js`

### Fluxo Completo

```
1. Profissional preenche dados do paciente
   ├─ Nome, CPF, Data, Telefone
   ├─ Endereço (importante!)
   ├─ Sintomas
   └─ Prioridade (Vermelho a Azul)
        ↓
2. Clica em "Cadastrar Paciente"
        ↓
3. Validações locais
   ├─ CPF é válido?
   └─ Campos obrigatórios preenchidos?
        ↓
4. GEOCODIFICAÇÃO (endereço → coordenadas GPS)
   ├─ Envia endereço para API Nominatim
   ├─ Aguarda resposta com lat/lon
   └─ Se falhar: paciente cadastrado sem coordenadas
        ↓
5. Cria objeto paciente
        ↓
6. Salva em localStorage
        ↓
7. Reseta formulário
        ↓
8. Mensagem de sucesso
```

### Validação de CPF

```javascript
function isValidCPF(cpf) {
  if (!cpf) return false;
  cpf = cpf.replace(/\D/g, "");  // Remove caracteres não-dígitos
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;  // Rejeita "11111111111"

  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base.charAt(i), 10) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.substring(0, 9));
  const digito2 = calcularDigito(cpf.substring(0, 10));

  return digito1 === parseInt(cpf.charAt(9), 10) && 
         digito2 === parseInt(cpf.charAt(10), 10);
}
```

**Como funciona:**
1. Remove caracteres não-numéricos
2. Verifica se tem 11 dígitos
3. Rejeita CPFs repetidos (111.111.111-11)
4. Valida primeiro dígito verificador
5. Valida segundo dígito verificador

**Exemplos:**
```
✅ 123.456.789-09 (válido)
❌ 111.111.111-11 (repetido)
❌ 123.456.789-00 (dígitos inválidos)
```

### Geocodificação (Endereço → Coordenadas)

```javascript
const endereco = document.getElementById("endereco").value;

fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(endereco + ", Caratinga, Brasil")}`)
  .then(res => res.json())
  .then(data => {
    let lat = null, lon = null;
    
    if (data && data.length > 0) {
      lat = parseFloat(data[0].lat);
      lon = parseFloat(data[0].lon);
    }
    
    // ... cria paciente com coordenadas ...
  })
  .catch(err => {
    console.error("Erro ao geocodificar:", err);
    showMessage("messageBox", "Paciente cadastrado, mas sem localização no mapa.", "error");
  });
```

**O que acontece:**

1. **Requisição à API Nominatim**
   - Envia endereço para OpenStreetMap
   - Pede formato JSON
   - Busca melhor resultado (limit=1)

2. **Resposta da API**
   - Se encontrar: retorna array com resultado
   - Latitude e longitude extraídas
   - Coordenadas convertidas para número (parseFloat)

3. **Paciente sem coordenadas**
   - Se geocodificação falhar
   - Paciente ainda é cadastrado
   - Apenas não aparece no mapa

**Exemplo de Resposta da API:**
```json
[
  {
    "lat": "-19.7907",
    "lon": "-42.1392",
    "display_name": "Caratinga, Minas Gerais, Brasil"
  }
]
```

### Objeto Paciente Criado

```javascript
const paciente = {
  nome: "João Silva",
  cpf: "12345678901",
  nascimento: "1980-05-15",
  telefone: "(31) 98765-4321",
  endereco: "Rua das Flores, 123, Centro",
  sintomas: "Dor no peito, formigamento",
  prioridade: "vermelho",
  lat: -19.7907,      // Latitude (pode ser null)
  lon: -42.1392       // Longitude (pode ser null)
};
```

### Armazenamento em localStorage

```javascript
let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
pacientes.push(paciente);
localStorage.setItem("prioridades", JSON.stringify(pacientes));
this.reset();  // Limpa formulário
```

**Sequência:**
1. Carrega lista existente (ou cria array vazio)
2. Adiciona novo paciente
3. Salva no localStorage
4. Limpa campos do formulário

### Estrutura Final em localStorage

```javascript
localStorage.getItem("prioridades")
// Retorna JSON como string:
"[
  {nome: "João", ..., lat: -19.7907, lon: -42.1392},
  {nome: "Maria", ..., lat: -19.8123, lon: -42.1556},
  ...
]"
```

---

## 📊 SCRIPT 5: prioridadesScript.js (Lista de Pacientes)

### Propósito
Exibe lista de pacientes ordenados por prioridade com opções de visualizar ficha ou remover.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\prioridadesScript.js`

### Funcionalidades Utilitárias

#### Calcular Idade

```javascript
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "-";
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;  // Ainda não fez aniversário este ano
  }
  return idade;
}
```

**Exemplo:**
```
Data nascimento: 1980-05-15
Data atual: 2026-06-03
Idade calculada: 46 anos
```

#### Ícone de Prioridade

```javascript
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
```

**Mapeamento de cores:**
```
Armazenado em BD    Exibido para Usuário
─────────────────────────────────────────
"vermelho"     →    🔴 Vermelho
"laranja"      →    🟠 Laranja
"amarelo"      →    🟡 Amarelo
"verde"        →    🟢 Verde
"azul"         →    🔵 Azul
```

### Fluxo de Renderização

#### 1. Verificação de Autenticação

```javascript
document.addEventListener("DOMContentLoaded", () => {
  if (!requireLogin()) return;  // Bloqueia se não estiver logado
  renderLoginStatus();          // Mostra quem está logado
  // ... resto do código ...
});
```

#### 2. Carregamento de Dados

```javascript
let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];
const lista = document.getElementById("listaPacientes");
const ficha = document.getElementById("fichaPaciente");
```

#### 3. Ordenação por Prioridade

```javascript
const ordemPrioridade = ["vermelho", "laranja", "amarelo", "verde", "azul"];

pacientes.sort((a, b) => {
  const pa = ordemPrioridade.indexOf(a.prioridade || "");
  const pb = ordemPrioridade.indexOf(b.prioridade || "");
  return pa - pb;  // Ordem crescente: vermelho primeiro
});
```

**Exemplo de ordenação:**
```
Antes da ordenação:
1. Ana (verde)
2. João (vermelho)
3. Maria (amarelo)

Depois:
1. João (vermelho)      ← Emergência (atender primeiro)
2. Maria (amarelo)      ← Urgente
3. Ana (verde)          ← Pouco urgente
```

#### 4. Verificação de Lista Vazia

```javascript
if (pacientes.length === 0) {
  lista.innerHTML = "<li>Nenhum paciente cadastrado ainda.</li>";
  return;
}
```

#### 5. Renderização de Cada Paciente

```javascript
pacientes.forEach((p, index) => {
  const li = document.createElement("li");
  
  li.innerHTML = `
    <span>${iconePrioridade(p.prioridade)} ${p.nome} | Sintomas: ${p.sintomas}</span>
    <button class="delete-btn">Excluir</button>
  `;
  
  // ... event listeners ...
  
  lista.appendChild(li);
});
```

**HTML Gerado:**
```html
<li>
  <span>🔴 João Silva | Sintomas: Dor no peito</span>
  <button class="delete-btn">Excluir</button>
</li>
```

### Event Listeners

#### Clique para Ver Ficha

```javascript
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
    <p><strong>Prioridade:</strong> ${iconePrioridade(p.prioridade)} ${p.prioridade}</p>
  `;
});
```

**Informações exibidas na ficha:**
- Nome completo
- CPF
- Idade calculada automaticamente
- Telefone para contato
- Endereço
- Descrição de sintomas
- Prioridade com ícone

#### Clique para Excluir

```javascript
li.querySelector(".delete-btn").addEventListener("click", () => {
  pacientes.splice(index, 1);  // Remove do array
  localStorage.setItem("prioridades", JSON.stringify(pacientes));  // Salva
  li.remove();  // Remove da tela
  ficha.style.display = "none";  // Fecha ficha se aberta
});
```

**Fluxo de exclusão:**
1. Remove paciente do array (índice)
2. Atualiza localStorage
3. Remove elemento HTML da tela
4. Oculta ficha se estava visível

### Exemplos de Saída

**Lista de Pacientes:**
```
🔴 João Silva | Sintomas: Dor no peito [Excluir]
🟠 Maria Santos | Sintomas: Febre alta [Excluir]
🟡 Pedro Lima | Sintomas: Ferimento [Excluir]
```

**Ficha Expandida:**
```
╔════════════════════════════════╗
║   Ficha do Paciente             ║
├────────────────────────────────┤
║ Nome: João Silva                ║
║ CPF: 123.456.789-01             ║
║ Idade: 45 anos                  ║
║ Telefone: (31) 98765-4321       ║
║ Endereço: Rua das Flores, 123   ║
║ Sintomas: Dor no peito,         ║
║           formigamento no braço ║
║ Prioridade: 🔴 Vermelho         ║
╚════════════════════════════════╝
```

---

## 🗺️ SCRIPT 6: mapaPrioridades.js (Mapa de Calor)

### Propósito
Visualiza pacientes em mapa interativo com marcadores coloridos por prioridade.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\mapaPrioridades.js`

### Bibliotecas Utilizadas

#### Leaflet.js
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
```

- Biblioteca profissional de mapas interativos
- Código aberto (Open Source)
- Leve e rápida

#### OpenStreetMap
- Fornecedor de tiles (imagens do mapa)
- Gratuito e sem autenticação
- Aberto e comunitário

### Inicialização do Mapa

```javascript
document.addEventListener("DOMContentLoaded", () => {
  if (!requireLogin()) return;
  renderLoginStatus();
  
  const map = L.map('map').setView([-19.7907, -42.1392], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
});
```

**Parâmetros:**
- `L.map('map')` - Elemento HTML com ID "map"
- `.setView([-19.7907, -42.1392], 13)` 
  - Latitude, Longitude de Caratinga
  - Zoom nível 13 (detalhe médio)

**Zoom levels:**
```
1-2   → Mundo inteiro
4-6   → Continente
10-12 → Cidade
15-18 → Rua, detalhe
19+   → Edifício individual
```

### Função de Conversão de Cor

```javascript
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
```

**Mapeamento:**
```
"vermelho"  →  "red"      (#FF0000)
"laranja"   →  "orange"   (#FFA500)
"amarelo"   →  "yellow"   (#FFFF00)
"verde"     →  "green"    (#008000)
"azul"      →  "blue"     (#0000FF)
```

### Renderização de Marcadores

```javascript
let pacientes = JSON.parse(localStorage.getItem("prioridades")) || [];

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
```

**Propriedades de Estilo:**
- `radius` → Tamanho do círculo (pixels)
- `fillColor` → Cor de preenchimento
- `weight` → Espessura da borda
- `opacity` → Opacidade da borda (0-1)
- `fillOpacity` → Opacidade do preenchimento

**Popup ao Clicar:**
```
┌──────────────────────┐
│ João Silva           │
│ Sintomas: Dor peito  │
│ Prioridade: vermelho │
└──────────────────────┘
```

### Exemplo Visual do Mapa

```
        N
        ↑
    ╔═══════════════════╗
    ║  🔴 🔴 🟠         ║  Legenda:
    ║    🟡  🟢         ║  🔴 Emergência
    ║      🔵           ║  🟠 Muito urgente
    ║                   ║  🟡 Urgente
    ║  Caratinga-MG     ║  🟢 Pouco urgente
    ║                   ║  🔵 Não urgente
    ╚═══════════════════╝
        ← W        E →
        S
        ↓
```

### Interatividade

**Usuário pode:**
- Clicar e arrastar para mover
- Rolar mouse para zoom
- Clicar em marcador para ver popup
- Uso em mobile: pinch para zoom

### Tratamento de Erros

```javascript
} else {
  console.warn("Paciente sem coordenadas:", p.nome, p.endereco);
}
```

**Por que isso ocorre:**
- Geocodificação falhou no cadastro
- Endereço inválido ou muito genérico
- Erro na API Nominatim

**Comportamento:**
- Paciente ainda existe no sistema
- Apenas não aparece no mapa
- Erro registrado no console para debug

---

## 💬 SCRIPT 7: suporteScript.js (Formulário de Suporte)

### Propósito
Permite usuários enviarem mensagens de suporte via e-mail.

### Localização
`c:\Users\Paulo César\Documents\STP-UBS\suporteScript.js`

### Fluxo de Suporte

```
1. Usuário acessa página "Fale com o STP-UBS"
        ↓
2. Preenche formulário:
   ├─ Nome
   ├─ E-mail
   └─ Mensagem
        ↓
3. Clica em "Enviar"
        ↓
4. JavaScript valida campos
        ↓
5. Cria link mailto (esquema de protocolo)
        ↓
6. Abre cliente de e-mail do sistema
        ↓
7. E-mail pré-preenchido com dados
        ↓
8. Usuário revisa e envia
```

### Captura do Formulário

```javascript
const suporteForm = document.querySelector(".contact-form");

if (suporteForm) {
  suporteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage("messageBox");
    
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    
    // Validações...
  });
}
```

### Validação de Campos

```javascript
if (!nome || !email || !mensagem) {
  return showMessage("messageBox", "Por favor, preencha todos os campos antes de enviar.", "error");
}
```

**Requisitos:**
- Todos os campos obrigatórios
- `.trim()` remove espaços em branco

### Construção do Link mailto

```javascript
const assunto = encodeURIComponent(`Suporte STP-UBS - ${nome}`);
const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`);
const destino = "pcesardasilva095@gmail.com";
const mailtoLink = `mailto:${destino}?subject=${assunto}&body=${corpo}`;
```

**Componentes:**
- `mailto:` → Protocolo de e-mail
- `destino` → E-mail que receberá
- `subject` → Assunto (pré-preenchido)
- `body` → Corpo da mensagem (pré-preenchido)

**Codificação:**
- `encodeURIComponent()` converte caracteres especiais
- Espaços viram `%20`
- Quebras de linha viram `%0A`

### Exemplo de URL Gerada

```
mailto:pcesardasilva095@gmail.com?subject=Suporte%20STP-UBS%20-%20Maria&body=Nome%3A%20Maria%0AE-mail%3A%20maria%40email.com%0A%0AMensagem%3A%0ASeu%20sistema%20est%C3%A1%20lindo%21
```

**Decodificado:**
```
mailto:pcesardasilva095@gmail.com?
  subject=Suporte STP-UBS - Maria
  &body=Nome: Maria
        E-mail: maria@email.com
        
        Mensagem:
        Seu sistema está lindo!
```

### Abertura do Cliente de E-mail

```javascript
showMessage("messageBox", "Abrindo seu cliente de e-mail...", "success");
window.location.href = mailtoLink;
```

**O que ocorre:**
1. Mostra mensagem "Abrindo seu cliente..."
2. Navega para URL `mailto:`
3. Sistema operacional intercepta protocolo
4. Abre cliente de e-mail padrão
5. E-mail pré-preenchido aparece

### Clientes de E-mail Suportados

```
Desktop:
├─ Outlook
├─ Thunderbird
├─ Apple Mail
├─ Windows Mail
└─ Gmail (web)

Web:
├─ Gmail
├─ Outlook.com
└─ Yahoo Mail
```

### Limitações

⚠️ **Problemas potenciais:**
1. Usuário pode não ter cliente de e-mail configurado
2. Webmail pode não processar mailto
3. Comprimento do URL tem limite (~2000 caracteres)
4. Sem confirmação de entrega

### Exemplo de Mensagem Enviada

```
De: maria@email.com
Para: pcesardasilva095@gmail.com
Assunto: Suporte STP-UBS - Maria

Nome: Maria Silva
E-mail: maria@email.com

Mensagem:
O sistema está funcionando muito bem! 
Gostaria de sugerir uma funcionalidade 
de relatórios mensais de pacientes.
```

---

## 📊 Tabela Comparativa de Scripts

| Script | Função | Autenticação | LocalStorage |
|--------|--------|--------------|--------------|
| auth.js | Core/funções gerais | Gerencia sessionStorage | Lê localStorage |
| loginScript.js | Login | Cria sessionStorage | Lê usuários |
| contaScript.js | Criar conta | Sem requisito | Escreve usuários |
| adicionarScript.js | Cadastra pacientes | Requer login | Escreve pacientes |
| prioridadesScript.js | Lista pacientes | Requer login | Lê pacientes |
| mapaPrioridades.js | Mapa visual | Requer login | Lê pacientes |
| suporteScript.js | Contato | Sem requisito | Não usa |

---

## 🔄 Fluxo Completo de Dados

```
USUARIO NOVO
    ↓
criarConta.html + contaScript.js
    ├─ Valida CRM/COREM
    ├─ Valida E-mail
    └─ Salva em localStorage["usuariosSTP"]
    ↓
LOGIN
    ↓
login.html + loginScript.js
    ├─ Busca em localStorage["usuariosSTP"]
    ├─ Valida senha
    └─ Cria sessionStorage["usuarioLogadoSTP"]
    ↓
CADASTRAR PACIENTE
    ↓
adicionarScript.js
    ├─ Valida CPF
    ├─ Geocodifica endereço (API Nominatim)
    └─ Salva em localStorage["prioridades"]
    ↓
VISUALIZAR PRIORIDADES
    ↓
prioridadesScript.js
    ├─ Lê localStorage["prioridades"]
    ├─ Ordena por urgência
    └─ Renderiza lista
    ↓
VISUALIZAR MAPA
    ↓
mapaPrioridades.js
    ├─ Lê localStorage["prioridades"]
    ├─ Inicializa Leaflet
    └─ Renderiza marcadores com Leaflet
    ↓
ENVIAR SUPORTE
    ↓
suporteScript.js
    └─ Abre cliente de e-mail com mailto
```

---

## 🛡️ Segurança - Observações Importantes

### ⚠️ Problemas em Produção

```javascript
// ❌ NÃO FAZER (código atual)
usuario.senha = "123456"  // Texto puro armazenado!
localStorage.setItem(...)  // Qualquer um com acesso pode ler!

// ✅ FAZER (melhorias necessárias)
usuario.senha = bcrypt.hash("123456")  // Hash criptográfico
https://                               // HTTPS apenas
sessionStorage                         // Mais seguro que localStorage
```

### Dados Sensíveis Armazenados

```
localStorage (⚠️ Visível):
├─ E-mails de usuários
├─ Senhas em texto puro ❌
├─ CPF de pacientes
└─ Endereços residenciais

sessionStorage (✅ Melhor):
└─ Dados de autenticação (apenas sessão atual)
```

### Recomendações de Segurança

1. **Hash de Senhas** - Use bcrypt, PBKDF2 ou similar
2. **HTTPS** - Criptografe dados em trânsito
3. **Backend** - Mova lógica sensível para servidor
4. **Tokens JWT** - Em vez de dados na sessão
5. **GDPR/LGPD** - Proteção de dados pessoais
6. **Auditoria** - Registre acessos e modificações

---

## 🎓 Resumo de Aprendizados

| Conceito | Arquivo | Explicação |
|----------|---------|-----------|
| Autenticação | auth.js | Como gerenciar login/logout |
| Validação | contaScript.js | Checar CRM, e-mail, senha |
| Geocodificação | adicionarScript.js | Endereço → Coordenadas GPS |
| Geolocalização | mapaPrioridades.js | Visualizar em mapa interativo |
| Persistência | Todos | localStorage vs sessionStorage |
| API | adicionarScript.js | Como usar APIs externas (Nominatim) |
| Promises | adicionarScript.js | Operações assíncronas com .then() |
| DOM | Todos | Manipular HTML com JavaScript |
| Event Listeners | Todos | Responder a cliques, submissões |

---

**Documentação completa dos scripts criada! 📚**
