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
    action: "localizaEstoque",
    codProduto: indexador,
  };

  receberResposta(pedido)
    .then(produto => {
      nomeProduto.value = produto.produto;
      codProduto.value = produto.codigo;
      data = new Date (produto.vencimento);
      vencProduto.value = (data.getMonth()+1) + "-" + (data.getDate()) + "-" + (data.getFullYear());
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
  data = new Date (vencProduto.value);
  vencProduto.value = (data.getFullYear()) + "-" + (data.getMonth() + 1) + "-" + (data.getDate());
  pedido = {
    action: "modificaEstoque",
    codigo: codProduto.value,
    produto: nomeProduto.value,
    lote: loteProduto.value,
    quantidade: quantProduto.value,
    vencimento: vencProduto.value,
    valor: valorVenda.value,
    status: estVenda.value,
    foto: novaFoto.src
  };
  mudarPedido(pedido)
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