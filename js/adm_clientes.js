var tabelaResultante = document.getElementById("itens_edicao");
var itensApagar = [];
var itemEditar = [];
var tabelaTransicao = [[]];
var coluna = "cpf";
var ordem = "ASC";
var ordem_zero = "ASC";
var ordem_um = "ASC";
var ordem_dois = "ASC";
var ordem_tres = "ASC";
var numeroColunas = 4;
var itensTela = 4;
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

function ultimasCompras(dias) {
  var hoje = new Date();
  var tamanho = tabelaResultante.rows.length;
  for (i = 0; i < tamanho; i++) {
    var data = tabelaResultante.rows.item(i).cells.item(2).innerHTML;
    var barra = data.indexOf("/");
    var dia = data.slice(0, barra);
    barra2 = data.indexOf("/", barra + 1);
    var mes = data.slice(barra + 1, barra2);
    var ano = data.slice(barra2 + 1);
    compras = new Date(mes + "/" + dia + "/" + ano);
    var prazoCompras = (hoje - compras) / 1000 / 60 / 60 / 24;
    if (prazoCompras <= dias) {
      tabelaResultante.rows.item(i).cells.item(1).classList.add("edicao_vencido");
    } else {
      tabelaResultante.rows.item(i).cells.item(1).classList.remove("edicao_vencido");
    }
  }
}

function escolheLinha(id) {
  var tamanho = tabelaResultante.rows.length;
  for (i = 0; i < tamanho; i++) {
    posicao = tabelaResultante.rows.item(i).cells.item(0).innerHTML;
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
  var novo = document.getElementById("criaItem")
  var apaga = document.getElementById("apagaItem");
  var edita = document.getElementById("editaItem");
  var info = document.getElementById("maisInfo");
  if (quantidadeEdicao == 1) {
    apaga.classList.remove("edicao_nao_ativo");
    edita.classList.remove("edicao_nao_ativo");
    info.classList.remove("edicao_nao_ativo");
  } else if (quantidadeEdicao > 1) {
    edita.classList.add("edicao_nao_ativo");
    info.classList.add("edicao_nao_ativo");
  } else if (quantidadeEdicao == 0) {
    edita.classList.add("edicao_nao_ativo");
    info.classList.add("edicao_nao_ativo");
    apaga.classList.add("edicao_nao_ativo");
    novo.classList.remove("edicao_nao_ativo");
  }
}

function marcaItem() {
  var selecao = document.querySelectorAll(".edita_linha");
  selecao.forEach(elemento => {
    itemEditar = elemento.cells.item(0).innerHTML;
  })
  return itemEditar;
}

function criaItem() {
  location.href = 'novo-cliente.html';
}

function editaItem() {
  marcado = marcaItem();
  localStorage.setItem("idDetalhe", JSON.stringify(marcado));
  quantidadeEdicao = 0;
  location.href = 'edicao-item-cliente.html';
}

function apagaItem() {
  var linhasSelecionadas = document.querySelectorAll(".edita_linha");
  linhasApagar = Array.from(linhasSelecionadas).map((element) => {
    return element.cells.item(0).innerHTML;
  });
  tamanho = linhasApagar.length;
  for (i = 0; i < tamanho; i++) {
    pedido = {
      action: "apagaItemCliente",
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
  tabelaResultante.innerHTML = "";
  criaTabela();
}

function detalhaItem() {
  marcado = marcaItem();
  localStorage.setItem("idDetalhe", JSON.stringify(marcado));
  quantidadeEdicao = 0;
  location.href = 'item-de-cliente.html';
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
    action: "atualizaClientes",
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
          const cpf = item.cpf;
          const nome = item.nome;
          const ultimaCompra = item.ultimaCompra;
          const cupom = item.cupom;
          const newRow = [cpf, nome, ultimaCompra, cupom];
          tabelaTransicao.push(newRow);
        }
      }
      tamanho = tabelaTransicao.length;
      for (i = 0; i < tamanho; i++) {
        var linha = tabelaResultante.insertRow(i);
        linha.removeAttribute("id");
        linha.setAttribute("id", tabelaTransicao[i][0]);
        linha.setAttribute("onclick", "escolheLinha(id)");
        for (j = 0; j < itensTela; j++) {
          if (j == 2) {
            var data = new Date(tabelaTransicao[i][j]);
            var mes = data.getMonth() + 1;
            var dia = data.getDate();
            var ano = data.getFullYear();
            if (ano == 1969) {
              tabelaTransicao[i][j] = "Não realizou compras";
            } else {
              tabelaTransicao[i][j] = dia + "/" + mes + "/" + ano;
            }
          }
          var cell1 = linha.insertCell(j);
          cell1.innerHTML = tabelaTransicao[i][j];
        }
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      throw new Error('Erro ao processar a resposta do servidor');
    });
}

function novoItem() {
  var tamanho = tabelaCliente.rows.length;
  for (i = 0; i < tamanho; i++) {
    for (j = 0; j < numeroColunas; j++) {
      tabelaTransicao.push(tabelaCliente.rows.item(i).cells.item(j).innerHTML);
    }
  }
  localStorage.setItem("listaProduto", JSON.stringify(tabelaTransicao));
  location.href = 'novo-cliente.html';
}

organiza_col_zero.addEventListener("click", (event) => {
  coluna = "cpf";
  if (ordem_zero == "ASC") ordem_zero = "DESC";
  else ordem_zero = "ASC";
  ordem = ordem_zero;
  limpaTabela();
  criaTabela(coluna, ordem);
})

organiza_col_um.addEventListener("click", (event) => {
  coluna = "nome";
  if (ordem_um == "ASC") ordem_um = "DESC";
  else ordem_um = "ASC";
  ordem = ordem_um;
  limpaTabela();
  criaTabela(coluna, ordem);
})

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "data";
  if (ordem_dois == "ASC") ordem_dois = "DESC";
  else ordem_dois = "ASC";
  ordem = ordem_dois;
  limpaTabela();
  criaTabela(coluna, ordem);
})

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "cupom";
  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
})

notifica_compras.addEventListener("change", (event) => {
  var identificacaoCompras = document.getElementById("notifica_compras");
  ultimasCompras(identificacaoCompras.value);
});