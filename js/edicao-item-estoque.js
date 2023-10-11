let novaFoto = document.getElementById("foto_produto");
let fotoProduto = document.getElementById("carrega_foto");
let nomeProduto = document.getElementById("produto");
let codProduto = document.getElementById("codigo");
let vencProduto = document.getElementById("vencimento");
let loteProduto = document.getElementById("lote");
let valorVenda = document.getElementById("valor");
let quantProduto = document.getElementById("quantidade");
let estVenda = document.getElementById("situacao");
var endFoto = document.getElementById("foto_produto");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
var acao = "estoque"

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
    codigo: indexador,
  };
  acao = acao + "/localiza-estoque";

  receberResposta(acao,pedido)
    .then(produto => {
      produto = produto[0];
      nomeProduto.value = produto.produto;
      codProduto.value = produto.codigo;
      data = new Date(produto.vencimento);
      data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
      const month = (data.getMonth() + 1).toString().padStart(2, '0');
      const day = data.getDate().toString().padStart(2, '0');
      vencProduto.value = month + "-" + day + "-" + (data.getFullYear());
      loteProduto.value = produto.lote;
      valorVenda.value = produto.valor;
      quantProduto.value = produto.quantidade;
      estVenda.value = produto.status;
      endFoto.src = produto.foto;
    });
}

function carregaFoto(){
  novaFoto.src = "./assets/" + (fotoProduto.files[0].name);
  endFoto = "./assets/" + (fotoProduto.files[0].name);
}

function confirmaCadastro() {
  var data = new Date(vencProduto.value);
  data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
  const year = data.getFullYear();
  const month = (data.getMonth() + 1).toString().padStart(2, '0');
  const day = data.getDate().toString().padStart(2, '0');

  vencProduto.value = year + "-" + month + "-" + day;
  pedido = {
    codigo: codProduto.value,
    produto: nomeProduto.value,
    lote: loteProduto.value,
    quantidade: quantProduto.value,
    vencimento: vencProduto.value,
    valor: valorVenda.value,
    status: estVenda.value,
    foto: novaFoto.src
  };
  acao = "estoque";
  mudarPedido(acao,pedido)
    .then((resposta) => resposta.json())
    .then(statusCadastro => {
      if (statusCadastro.message == "modificado") {
        nomeProduto.value = "";
        codProduto.value = "";
        vencProduto.value = "";
        loteProduto.value = "";
        valorVenda.value = "";
        quantProduto.value = "";
        estVenda.value = "";
        endFoto.src = "";
      }
    });
}

fotoProduto.addEventListener("change", carregaFoto);