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

encontraItem();

function receberResposta(pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `http://localhost:3000?${queryParams}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
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

function mudarPedido(pedido) {
  return fetch("http://localhost:3000", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

function encontraItem() {
  pedido = {
    action: "localizaCliente",
    cpf: indexador,
  };
  receberResposta(pedido)
    .then(cliente => {
      novoNome.value = cliente.nome;
      data = new Date(cliente.nascimento);
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
  data = new Date(novoNascimento.value);
  novoNascimento.value = (data.getFullYear()) + "-" + (data.getMonth() + 1) + "-" + (data.getDate());
  pedido = {
    action: "modificaCliente",
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
  mudarPedido(pedido)
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