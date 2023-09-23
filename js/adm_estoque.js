var tabelaResultante = document.getElementById("itens_edicao");
var itensApagar = [];
var itemEditar = [];
var tabelaTransicao = [[]];
var coluna = "codigo";
var ordem = "ASC";
var ordem_zero = "crescente";
var ordem_um = "crescente";
var ordem_dois = "crescente";
var ordem_tres = "crescente";
var ordem_quatro = "crescente";
var tipo = "texto";
var itensTela = 7;
var quantidadeEdicao = 0;
var pedido = {};

criaTabela(coluna, ordem);

function deletarPedido(pedido) {
  return fetch("http://localhost:3000", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

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

function sinalizaVencimento(dias) {
  var hoje = new Date();
  var tamanho = tabelaResultante.rows.length;
  for (var i = 0; i < tamanho; i++) {
    var vencimento = tabelaResultante.rows[i].cells[5].innerHTML;
    vencimento = vencimento.slice(3, 5) + "/" + vencimento.slice(0, 2) + "/" + vencimento.slice(5, 10);
    vencimento = new Date(vencimento);
    var prazoParaVencimento = (vencimento - hoje) / 1000 / 60 / 60 / 24;
    if (prazoParaVencimento <= dias) {
      tabelaResultante.rows[i].cells[5].classList.add("edicao_vencido");
    } else {
      tabelaResultante.rows[i].cells[5].classList.remove("edicao_vencido");
    }
  }
}

function escolheLinha(id) {
  var tamanho = tabelaResultante.rows.length;
  for (var i = 0; i < tamanho; i++) {
    posicao = i;
    var atributo = tabelaResultante.rows[i].getAttribute("class");
    if (posicao == id && atributo != "edita_linha") {
      tabelaResultante.rows[i].setAttribute("class", "edita_linha");
      quantidadeEdicao++;
      break;
    } else if (posicao == id && atributo == "edita_linha") {
      tabelaResultante.rows[i].removeAttribute("class", "edita_linha");
      quantidadeEdicao--;
      break;
    }
  }
  var novo = document.getElementById("criaItem");
  var apaga = document.getElementById("apagaItem");
  var edita = document.getElementById("editaItem");
  if (quantidadeEdicao == 1) {
    apaga.classList.remove("edicao_nao_ativo");
    edita.classList.remove("edicao_nao_ativo");
  } else if (quantidadeEdicao > 1) {
    edita.classList.add("edicao_nao_ativo");
  } else if (quantidadeEdicao == 0) {
    edita.classList.add("edicao_nao_ativo");
    apaga.classList.add("edicao_nao_ativo");
    novo.classList.remove("edicao_nao_ativo");
  }
}

function marcaItem() {
  var selecao = document.querySelectorAll(".edita_linha");
  selecao.forEach(elemento => {
    itemEditar = elemento.cells[0].innerHTML;
  });
  return itemEditar;
}

function criaItem() {
  location.href = 'novo-estoque.html';
}

function editaItem() {
  marcado = marcaItem();
  localStorage.setItem("idDetalhe", JSON.stringify(marcado));
  quantidadeEdicao = 0;
  location.href = 'edicao-item-estoque.html';
}

function apagaItem() {
  var linhasSelecionadas = document.querySelectorAll(".edita_linha");
  linhasApagar = Array.from(linhasSelecionadas).map((element) => {
    return element.cells[0].innerHTML;
  });
  tamanho = linhasApagar.length;
  for (var i = 0; i < tamanho; i++) {
    pedido = {
      action: "apagaItemEstoque",
      itensApagar: linhasApagar[i],
    };
    deletarPedido(pedido)
      .then((resposta) => resposta.json())
      .then((statusApaga) => {

        if (statusApaga.message === "item apagado") {
          quantidadeEdicao = 0;
          limpaTabela();
          criaTabela(coluna, ordem);
        }
      });
  }
}

function limpaTabela() {
  tamanho = tabelaResultante.rows.length;
  for (var i = 0; i < tamanho; i++) {
    tabelaResultante.deleteRow(0);
  }
  tabelaTransicao = [[]];
}

function criaTabela(coluna, ordem) {
  pedido = {
    action: "atualizaEstoque",
    coluna: coluna,
    ordem: ordem
  };
  receberResposta(pedido)
    .then((resposta) => {
      tabelaTransicao = [];
      tamanho = Object.keys(resposta).length;
      for (const key in resposta) {
        if (resposta.hasOwnProperty(key)) {
          const item = resposta[key];
          const codigo = item.codigo;
          const produto = item.produto;
          const lote = item.lote;
          let quantidade = item.quantidade;
          if (quantidade < 0) quantidade = 0;
          const valorVenda = item.valor;
          const vencimento = item.vencimento;
          const status = item.status;
          const newRow = [codigo, produto, lote, quantidade, valorVenda, vencimento, status];
          tabelaTransicao.push(newRow);
        }
      }
      for (var i = 0; i < tamanho; i++) {
        var linha = tabelaResultante.insertRow(i);
        linha.removeAttribute("id");
        linha.setAttribute("id", i);
        linha.setAttribute("onclick", "escolheLinha(id)");

        for (var j = 0; j < itensTela; j++) {
          var cell1 = linha.insertCell(j);
          if (j == 5) {
            var data = tabelaTransicao[i][j];
            data = new Date(data);
            tabelaTransicao[i][j] = (data.getDate()) + "/" + (data.getMonth() + 1) + "/" + (data.getFullYear());
          } else if (j == 4) {
            var numeroValor = tabelaTransicao[i][j];
            tabelaTransicao[i][j] = "R$ " + numeroValor;
          }
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
  coluna = "lote";
  if (ordem_dois == "ASC") ordem_dois = "DESC";
  else ordem_dois = "ASC";
  ordem = ordem_dois;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "quantidade";
  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_quatro.addEventListener("click", (event) => {
  coluna = "valor";
  if (ordem_quatro == "ASC") ordem_quatro = "DESC";
  else ordem_quatro = "ASC";
  ordem = ordem_quatro;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_cinco.addEventListener("click", (event) => {
  coluna = "vencimento";
  if (ordem_quatro == "ASC") ordem_quatro = "DESC";
  else ordem_quatro = "ASC";
  ordem = ordem_quatro;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_seis.addEventListener("click", (event) => {
  coluna = "status";
  if (ordem_quatro == "ASC") ordem_quatro = "DESC";
  else ordem_quatro = "ASC";
  ordem = ordem_quatro;
  limpaTabela();
  criaTabela(coluna, ordem);
});

notifica_vencimento.addEventListener("change", (event) => {
  var identificacaoVencimento = document.getElementById("notifica_vencimento");
  sinalizaVencimento(identificacaoVencimento.value);
});