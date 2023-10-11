let novoNome = document.getElementById("nome");
let novoNascimento = document.getElementById("nascimento");
let novoCPF = document.getElementById("cpf");
let novoTelefone = document.getElementById("telefone");
let novoEmail = document.getElementById("email");
let novoEndereco = document.getElementById("endereco");
let novoCidade = document.getElementById("cidade");
let novoEstado = document.getElementById("estado");
let novoCEP = document.getElementById("cep");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
acao="clientes";

encontraItem();

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

function mudarPedido(acao,pedido) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

function encontraItem() {
  pedido = {
    cpf: indexador,
  };
  acao = acao + "/localiza-cliente";

  receberResposta(acao,pedido)
    .then(cliente => {
      novoNome.value = cliente.nome;
      data = new Date(cliente.nascimento);
      data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
      novoNascimento.value = (data.getFullYear()) + "-" + (data.getMonth() + 1) + "-" + (data.getDate());
      novoCPF.value = indexador;
      novoTelefone.value = cliente.telefone;
      novoEmail.value = cliente.email;
      novoEndereco.value = cliente.endereco;
      novoCidade.value = cliente.cidade;
      novoEstado.value = cliente.estado;
      novoCEP.value = cliente.cep;
    })
}

function confirmaCadastro() {
  var data = new Date(novoNascimento.value);
  data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
  const year = data.getFullYear();
  const month = (data.getMonth() + 1).toString().padStart(2, '0');
  const day = data.getDate().toString().padStart(2, '0');

  novoNascimento.value = year + "-" + month + "-" + day;
  pedido = {
    nome: novoNome.value,
    nascimento: novoNascimento.value,
    cpf: novoCPF.value,
    telefone: novoTelefone.value,
    email: novoEmail.value,
    endereco: novoEndereco.value,
    cidade: novoCidade.value,
    estado: novoEstado.value,
    cep: novoCEP.value
  };
  acao = "clientes";
  mudarPedido(acao,pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {
      if (statusCadastro.message == "modificado") {
        novoNome.value = "";
        novoNascimento.value = "";
        novoCPF.value = "";
        novoTelefone.value = "";
        novoEmail.value = "";
        novoEndereco.value = "";
        novoCidade.value = "";
        novoEstado.value = "";
        novoCEP.value = "";
      }
    });
}