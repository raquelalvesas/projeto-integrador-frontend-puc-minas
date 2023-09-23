let novoNome = document.getElementById("nomeFuncionario");
let novoId = document.getElementById("idFuncionario");
let novoCargo = document.getElementById("cargoFuncionario");
let novoLogin = document.getElementById("loginFuncionario");
let novaSenha = document.getElementById("senhaFuncionario");

function enviarMensagem(pedido) {
  const url = 'http://localhost:3000/';
  return fetch(url, {
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
    action: "novoItemFuncionario",
    id: novoId.value,
    nome: novoNome.value,
    cargo: novoCargo.value,
    login: novoLogin.value,
    senha: novaSenha.value,
  };
  enviarMensagem(pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {
      if (statusCadastro.status == "itemCadastrado") {
        apagar();
      }
    });
}