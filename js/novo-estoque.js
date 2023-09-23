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

function sendMessage(pedido) {
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

function carregaFoto() {
  novaFoto.src = "./assets/" + (fotoProduto.files[0].name);
  endFoto = "./assets/" + (fotoProduto.files[0].name);
}

function confirmaCadastro() {
  if (nomeProduto && codProduto && vencProduto && loteProduto && valorVenda && quantProduto && estVenda) {
    data = new Date(vencProduto.value);
    vencProduto.value = (data.getFullYear()) + "-" + (data.getMonth() + 1) + "-" + (data.getDate());
    const pedido = {
      action: "novoItemEstoque",
      codigo: codProduto.value,
      produto: nomeProduto.value,
      lote: loteProduto.value,
      quantidade: quantProduto.value,
      vencimento: vencProduto.value,
      valor: valorVenda.value,
      status: estVenda.value,
      foto: novaFoto.src
    };
    sendMessage(pedido)
      .then((resposta) => resposta.json())
      .then(statusCadastro => {
        if (statusCadastro.status == "itemCadastrado") {
          apagar();
        }
      });
  }
}

fotoProduto.addEventListener("change", carregaFoto);