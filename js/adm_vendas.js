var tabelaResultante = document.getElementById("itens_edicao");
var coluna = "codigo";
var ordem = "asc";
var ordem_zero = "asc";
var ordem_um = "asc";
var ordem_dois = "asc";
var ordem_tres = "asc";
var ordem_quatro = "asc";
var ordem_cinco = "asc";
var ordem_seis = "asc";
var numeroColunas = 7;
var itensTela = 7;
var quantidadeEdicao = 0;
var pedido = {};
var info = document.getElementById("maisInfo");
acao = "joined-data";

criaTabela(coluna, ordem);

function receberResposta(acao,pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `https://mercadoalves-mercado.azuremicroservices.io/${acao}`;
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

function criaTabela(ordem) {
  acao = "itensVenda/joined-data?" + ordem;
  receberResposta(acao)
    .then((listaVendas) => {
      tabelaTransicao = [];
      tamanho = Object.keys(listaVendas).length;

      for (const key in listaVendas) {

        if (listaVendas.hasOwnProperty(key)) {
          const item = listaVendas[key];
          var codigo = item.codigo;
          const parts = codigo.split("LOTE");
          codigo = parts[0];
          const produto = item.produto;
          var valor = item.valorTotal;
          valor = valor.toFixed(2);
          const cpf = item.cpf;
          var data = new Date(item.data);
          data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
          console.log(data)
          console.log(item.data)
          var mes = data.getMonth() + 1;
          var dia = data.getDate();
          var ano = data.getFullYear();
          var novaData = dia + "/" + mes + "/" + ano;
          const cupom = item.cupom;
          console.log(cupom)
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

  if (ordem_zero == "asc") ordem_zero = "desc";
  else ordem_zero = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_zero;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "produto";

  if (ordem_um == "asc") ordem_um = "desc";
  else ordem_um = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_um;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "valorTotal";

  if (ordem_dois == "asc") ordem_dois = "desc";
  else ordem_dois = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_dois;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "cpf";

  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_tres;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_quatro.addEventListener("click", (event) => {
  coluna = "data";

  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_quatro;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_cinco.addEventListener("click", (event) => {
  coluna = "cupom";

  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_cinco;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_seis.addEventListener("click", (event) => {
  coluna = "pagamento";

  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_seis;
  limpaTabela();
  criaTabela(ordem);
});