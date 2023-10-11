const form = document.getElementById("identificacao_cpf");
let conteudoPopup = document.querySelector(".cpf_popup_conteudo");
const teclaNormal = document.querySelectorAll(`[class*="tecla_ativa"]`);
let teclaEsc = document.querySelector(".tecla_esc");
let teclaEnter = document.querySelector(".tecla_enter");
let cpf = document.getElementById("cpf_cliente");
let situacaoCadastro = document.getElementById("cliente_cadastro");
let pedido = {};
localStorage.removeItem("dadosCliente");
acao = "clientes";

function receberResposta(acao,pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `https://mercadoalves-mercado.azuremicroservices.io/${acao}?${queryParams}`;
  return fetch(url, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição. Status: ${response.status}`);
    }
    return response.json().catch(() => response.text());
  })
  .then(data => {
    if (data) {
      return data;
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    throw new Error('Erro ao processar a resposta do servidor');
  });
}

function iniciaVenda(cpf, cliente) {
  localStorage.setItem("dadosCliente", JSON.stringify([cpf, cliente]));
  localStorage.setItem("tabela_token", JSON.stringify(0));
  location.href = 'nova-venda.html';
}

function sairTela() {
  conteudoPopup.classList.remove("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.add("funcao_esconder");
  });
  teclaEsc.classList.remove("funcao_esconder");
  teclaEnter.classList.remove("funcao_esconder");
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      sairPopup();
    }
    if (event.key === "Enter") {
      location.href = 'tela-principal.html';
    }
  });
}

function sairPopup() {
  conteudoPopup.classList.add("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.remove("funcao_esconder");
  });
  teclaEsc.classList.add("funcao_esconder");
  teclaEnter.classList.add("funcao_esconder");
}

function localizaCliente() {
  if (!cpf.value) cpf.value = "000";
    const pedido = {
      cpf: cpf.value
    };
    acao = acao + "/localiza-cliente";
    receberResposta(acao,pedido)
      .then(cliente => {
        if (cliente.nome != "usuario nao cadastrado") {
          situacaoCadastro.classList.add("funcao_esconder");
          iniciaVenda(cpf.value, cliente.nome);
        } else {
          situacaoCadastro.classList.remove("funcao_esconder");
          cpf = "0000000000";
          cliente = "Cliente não cadastrado";
          iniciaVenda(cpf.value, cliente);
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        cliente = "cliente não cadastrado";
        iniciaVenda(cpf.value, cliente);
      });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  localizaCliente();
});

document.addEventListener("keyup", (event) => {
  if (event.key === "F5") {
    event.preventDefault();
    const cpf = identificacao_cpf.elements.cpf_cliente.value;
    localizaCliente();
  } else if (event.key === "F4") {
    event.preventDefault();
    sairTela();
  }
});