let novoNome = document.getElementById("nome");
let novoNascimento = document.getElementById("nascimento");
let novoCPF = document.getElementById("cpf");
let novoTelefone = document.getElementById("telefone");
let novoEmail = document.getElementById("email");
let novoEndereco = document.getElementById("endereco");
let novoCidade = document.getElementById("cidade");
let novoEstado = document.getElementById("estado");
let novoCEP = document.getElementById("cep");

function enviarMensagem(pedido) {
  return fetch('http://localhost:3000', {
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
    const data = new Date(novoNascimento.value);
    novoNascimento.value = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    const pedido = {
      action: "novoItemCliente",
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
    enviarMensagem(pedido)
      .then((resposta) => resposta.json())
      .then(statusCadastro => {
        if (statusCadastro.status == "itemCadastrado") {
          apagar();
        }
      });
  }
}