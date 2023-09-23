var tabelaResultante = document.getElementById("itens_edicao");
var coluna = "codigo";
var ordem = "ASC";
var ordem_zero = "ASC";
var ordem_um = "ASC";
var ordem_dois = "ASC";
var ordem_tres = "ASC";
var numeroColunas = 7;
var itensTela = 7;
var quantidadeEdicao = 0;
var pedido = {};
var info = document.getElementById("maisInfo");

criaTabela(coluna, ordem);

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

function escolheLinha(id) {
  var tamanho = tabelaResultante.rows.length;

  for (i = 0; i < tamanho; i++) {
    posicao = tabelaResultante.rows.item(i).cells.item(5).innerHTML;
    var atributo = tabelaResultante.rows.item(i).getAttribute("class");

    if (posicao == id && atributo != "edita_linha") {
      tabelaResultante.rows.item(i).setAttribute("class", "edita_linha");
      quantidadeEdicao++;
      break;
    } else if (posicao == id && atributo == "edita_linha") {
      tabelaResultante.rows.item(i).removeAttribute("class", "edita_linha");
      quantidadeEdicao--;
      break;
    }
  }

  if (quantidadeEdicao == 1) {
    info.classList.remove("edicao_nao_ativo");
  } else if (quantidadeEdicao > 1) {
    info.classList.add("edicao_nao_ativo");
  } else if (quantidadeEdicao == 0) {
    info.classList.add("edicao_nao_ativo");
  }
}

function marcaItem() {
  var selecao = document.querySelectorAll(".edita_linha");
  selecao.forEach(elemento => {
    itemEditar = (elemento.cells.item(5).innerHTML);
    itemEditar = itemEditar;
  });
  return (itemEditar);
}

function detalhaItem() {
  marcado = marcaItem();
  localStorage.setItem("idDetalhe", JSON.stringify(marcado));
  quantidadeEdicao = 0;
  location.href = 'cupom.html';
}

function limpaTabela() {
  tamanho = tabelaResultante.rows.length;

  for (i = 0; i < tamanho; i++) {
    tabelaResultante.deleteRow(0);
  }
  tabelaTransicao = [[]];
}

function criaTabela(coluna, ordem) {
  pedido = {
    action: "atualizaVendas",
    coluna: coluna,
    ordem: ordem
  };

  receberResposta(pedido)
    .then((listaVendas) => {
      tabelaTransicao = [];
      tamanho = Object.keys(listaVendas).length;

      for (const key in listaVendas) {

        if (listaVendas.hasOwnProperty(key)) {
          const item = listaVendas[key];
          const codigo = item.codigo;
          const produto = item.produto;
          const valor = item.valor;
          const cpf = item.cpf;
          const data = new Date(item.data);
          var mes = data.getMonth() + 1;
          var dia = data.getDate();
          var ano = data.getFullYear();
          var novaData = dia + "/" + mes + "/" + ano;
          const cupom = item.cupom;
          const pagamento = item.pagamento;
          const newRow = [codigo, produto, valor, cpf, novaData, cupom, pagamento];
          info.classList.add("edicao_nao_ativo");
          quantidadeEdicao = 0;
          tabelaTransicao.push(newRow);
        }
      }

      for (i = 0; i < tamanho; i++) {
        var linha = tabelaResultante.insertRow(i);
        linha.removeAttribute("id");
        linha.setAttribute("id", tabelaTransicao[i][5]);
        linha.setAttribute("onclick", "escolheLinha(id)");

        for (j = 0; j < itensTela; j++) {
          var cell1 = linha.insertCell(j);
          cell1.innerHTML = tabelaTransicao[i][j];
        }
      }
    });
}

organiza_col_zero.addEventListener("click", (event) => {
  coluna = "codigo";

  if (ordem_zero == "ASC") ordem_zero = "DESC";
  else ordem_zero = "ASC";
  ordem = ordem_zero;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "produto";

  if (ordem_um == "ASC") ordem_um = "DESC";
  else ordem_um = "ASC";
  ordem = ordem_um;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "valor";

  if (ordem_dois == "ASC") ordem_dois = "DESC";
  else ordem_dois = "ASC";
  ordem = ordem_dois;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "cpf";

  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_quatro.addEventListener("click", (event) => {
  coluna = "data";

  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_cinco.addEventListener("click", (event) => {
  coluna = "cupom";

  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_seis.addEventListener("click", (event) => {
  coluna = "pagamento";

  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});