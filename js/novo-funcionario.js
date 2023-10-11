let novoNome = document.getElementById("nomeFuncionario");
let novoId = document.getElementById("idFuncionario");
let novoCargo = document.getElementById("cargoFuncionario");
let novoLogin = document.getElementById("loginFuncionario");
let novaSenha = document.getElementById("senhaFuncionario");
let novoAcesso = document.getElementById("acesso");
acao = "usuarios";

function enviarMensagem(acao,pedido) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

function apagar() {
  novoNome.value = "";
  novoId.value = "";
  novoCargo.value = "";
  novoLogin.value = "";
  novaSenha.value = "";
}

function confirmaCadastro() {
  const pedido = {
    id: novoId.value,
    nome: novoNome.value,
    cargo: novoCargo.value,
    login: novoLogin.value,
    senha: novaSenha.value,
    acesso: novoAcesso.value,
  };
  enviarMensagem(acao,pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {
      if (statusCadastro.status == "itemCadastrado") {
        apagar();
      }
    });
}