var tabelaResultante = document.getElementById("itens_edicao");
var itensApagar = [];
var itemEditar = [];
var tabelaTransicao = [[]];
var coluna = "codigo";
var ordem = "codigo,asc";
var ordem_zero = "asc";
var ordem_um = "asc";
var ordem_dois = "asc";
var ordem_tres = "asc";
var ordem_quatro = "asc";
var ordem_cinco = "asc";
var ordem_seis = "asc";
var tipo = "texto";
var itensTela = 7;
var quantidadeEdicao = 0;
var pedido = {};
var identificacaoVencimento = document.getElementById("notifica_vencimento");
var acao = "estoque";

criaTabela(ordem);

function deletarPedido(acao) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'DELETE',
  })
  .catch(error => {
    console.error('Erro ao enviar a solicitação de exclusão:', error);
    throw error;
  });
}

function receberResposta(acao) {
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

function formataData(dataFormatada) {
  const parts = dataFormatada.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${month}/${day}/${year}`;
  }
  return dataCorreta;
}

function sinalizaVencimento(dias) {
  var hoje = new Date();
  var tamanho = tabelaResultante.rows.length;
  for (var i = 0; i < tamanho; i++) {
    var vencimento = tabelaResultante.rows[i].cells[5].innerHTML;
    var vencimentoFormatado = new Date(formataData(vencimento));
    vencimentoFormatado = new Date(vencimentoFormatado.getTime() + vencimentoFormatado.getTimezoneOffset() * 60000);
    var prazoParaVencimento = (vencimentoFormatado - hoje) / 1000 / 60 / 60 / 24;
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
    itemEditar = (elemento.cells[0].innerHTML) + "LOTE" + (elemento.cells[2].innerHTML);
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
    return (element.cells[0].innerHTML) + "LOTE" + (element.cells[2].innerHTML);
  });
  tamanho = linhasApagar.length;
  for (var i = 0; i < tamanho; i++) {
    acao = "estoque/" + linhasApagar[i],
    deletarPedido(acao)
      .then((resposta) => resposta.json())
      .then((statusApaga) => {

        if (statusApaga.message === "itemApagado") {
          quantidadeEdicao = 0;
          acao = "";
          limpaTabela();
          criaTabela(ordem);
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
  identificacaoVencimento.value = "";
}

function criaTabela(ordem) {
  acao = "estoque?sort=" + ordem;
  receberResposta(acao)
    .then((resposta) => {
      resposta = resposta.content;
      tabelaTransicao = [];
      tamanho = Object.keys(resposta).length;
      for (const key in resposta) {
        if (resposta.hasOwnProperty(key)) {
          const item = resposta[key];
          var codigo = item.codigo;
          const parts = codigo.split("LOTE");
          codigo = parts[0];
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
            data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
            tabelaTransicao[i][j] = (data.getDate()) + "/" + (data.getMonth() + 1) + "/" + (data.getFullYear());
          } else if (j == 4) {
            var numeroValor = tabelaTransicao[i][j];
            tabelaTransicao[i][j] = "R$ " + numeroValor;
          }
          cell1.innerHTML = tabelaTransicao[i][j];
        }
      }
    });
    acao="";
}

organiza_col_zero.addEventListener("click", (event) => {
  coluna = "codigo";
  if (ordem_zero == "asc") ordem_zero = "desc";
  else ordem_zero = "asc";
  ordem = coluna + "," + ordem_zero;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "produto";
  if (ordem_um == "asc") ordem_um = "desc";
  else ordem_um = "asc";
  ordem = coluna + "," + ordem_um;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "lote";
  if (ordem_dois == "asc") ordem_dois = "desc";
  else ordem_dois = "asc";
  ordem = coluna + "," + ordem_dois;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "quantidade";
  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = coluna + "," + ordem_tres;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_quatro.addEventListener("click", (event) => {
  coluna = "valor";
  if (ordem_quatro == "asc") ordem_quatro = "desc";
  else ordem_quatro = "asc";
  ordem = coluna + "," + ordem_quatro;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_cinco.addEventListener("click", (event) => {
  coluna = "vencimento";
  if (ordem_cinco == "asc") ordem_cinco = "desc";
  else ordem_cinco = "asc";
  ordem = coluna + "," + ordem_cinco;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_seis.addEventListener("click", (event) => {
  coluna = "status";
  if (ordem_seis == "asc") ordem_seis = "desc";
  else ordem_seis = "asc";
  ordem = coluna + "," + ordem_seis;
  limpaTabela();
  criaTabela(ordem);
});

notifica_vencimento.addEventListener("change", (event) => {
  sinalizaVencimento(identificacaoVencimento.value);
});