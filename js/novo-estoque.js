let novaFoto = document.getElementById("foto_produto");
let fotoProduto = document.getElementById("carrega_foto");
let nomeProduto = document.getElementById("produto");
let codProduto = document.getElementById("codigo");
let vencProduto = document.getElementById("vencimento");
let loteProduto = document.getElementById("lote");
let valorVenda = document.getElementById("valor");
let quantProduto = document.getElementById("quantidade");
let estVenda = document.getElementById("situacao");
var endFoto = "";
var acao = "estoque";

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

function carregaFoto() {
  novaFoto.src = "./assets/" + (fotoProduto.files[0].name);
  endFoto = "./assets/" + (fotoProduto.files[0].name);
}

function confirmaCadastro() {
  if (nomeProduto && codProduto && vencProduto && loteProduto && valorVenda && quantProduto && estVenda) {
    var data = new Date(vencProduto.value);
    data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const day = data.getDate().toString().padStart(2, '0');

    vencProduto.value = year + "-" + month + "-" + day;

    const pedido = {
      codigo: (codProduto.value + "LOTE" + loteProduto.value),
      produto: nomeProduto.value,
      lote: loteProduto.value,
      quantidade: quantProduto.value,
      vencimento: vencProduto.value,
      valor: valorVenda.value,
      status: estVenda.value,
      foto: novaFoto.src
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

fotoProduto.addEventListener("change", carregaFoto);