let novoNome = document.getElementById("nomeFuncionario");
let novoID = document.getElementById("idFuncionario");
let novoCargo = document.getElementById("cargoFuncionario");
let novoLogin = document.getElementById("loginFuncionario");
let novaSenha = document.getElementById("senhaFuncionario");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
let novoAcesso = document.getElementById("acesso");
acao = "usuarios";

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
    id: indexador,
  };
  acao = acao + "/localiza-usuario";
  receberResposta(acao,pedido)
    .then(produto => {
      novoNome.value = produto.nome;
      novoID.value = produto.id;
      novoCargo.value = produto.cargo;
      novoLogin.value = produto.login;
      novaSenha.value = produto.senha;
      novoAcesso.value = produto.acesso;
    });
}

function confirmaCadastro() {
  pedido = {
    id: indexador,
    nome: novoNome.value,
    cargo: novoCargo.value,
    login: novoLogin.value,
    senha: novaSenha.value,
    acesso: novoAcesso.value
  };
  acao = "usuarios";
  mudarPedido(acao,pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {

      if (statusCadastro.message == "modificado") {
        location.href = 'adm_funcionarios.html';
      }
    });
}