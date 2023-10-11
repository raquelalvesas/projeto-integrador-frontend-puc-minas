let novoNome = document.getElementById("nome");
let novoNascimento = document.getElementById("nascimento");
let novoCPF = document.getElementById("cpf");
let novoTelefone = document.getElementById("telefone");
let novoEmail = document.getElementById("email");
let novoEndereco = document.getElementById("endereco");
let novoCidade = document.getElementById("cidade");
let novoEstado = document.getElementById("estado");
let novoCEP = document.getElementById("cep");
var acao = "clientes";

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
  document.forms[0].reset();
}

function confirmaCadastro() {
  if (novoNome && novoNascimento && novoCPF && novoTelefone && novoEmail && novoEndereco && novoCidade && novoEstado && novoCEP) {
    var data = new Date(novoNascimento.value);
    data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const day = data.getDate().toString().padStart(2, '0');

    novoNascimento.value = year + "-" + month + "-" + day;
    novoNascimento
    const pedido = {
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
    enviarMensagem(acao,pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {
      if (statusCadastro.status == "itemCadastrado") {
        apagar();
      }
      });
  }
}