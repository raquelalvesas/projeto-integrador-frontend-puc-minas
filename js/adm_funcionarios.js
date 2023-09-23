var tabelaResultante = document.getElementById("itens_edicao");
var coluna = "id";
var ordem = "ASC";
var ordem_zero = "ASC";
var ordem_um = "ASC";
var ordem_dois = "ASC";
var ordem_tres = "ASC";
var numeroColunas = 5;
var itensTela = 5;
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

function escolheLinha(id) {
  var tamanho = tabelaResultante.rows.length;

  for (i = 0; i < tamanho; i++) {
    posicao = tabelaResultante.rows.item(i).cells[0].innerHTML;
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
    itemEditar = (elemento.cells[0].innerHTML);
  });
  return itemEditar;
}

function criaItem() {
  location.href = 'novo-funcionario.html';
}

function editaItem() {
  marcado = marcaItem();
  localStorage.setItem("idDetalhe", JSON.stringify(marcado));
  quantidadeEdicao = 0;
  location.href = 'edicao-item-funcionario.html';
}

function apagaItem() {
  var linhasSelecionadas = document.querySelectorAll(".edita_linha");
  linhasApagar = Array.from(linhasSelecionadas).map((element) => {
    return element.cells[0].innerHTML;
  });
  tamanho = linhasApagar.length;

  for (i = 0; i < tamanho; i++) {
    pedido = {
      action: "apagaItemFuncionario",
      itensApagar: linhasApagar[i],
    };
    deletarPedido(pedido)
    quantidadeEdicao = 0;
    limpaTabela();
    criaTabela(coluna, ordem);
  }
}

function limpaTabela() {
  var tamanho = tabelaResultante.rows.length;

  for (var i = 0; i < tamanho; i++) {
    tabelaResultante.deleteRow(0);
  }
  tabelaTransicao = [[]];
}

function criaTabela(coluna, ordem) {
  pedido = {
    action: "atualizaFuncionarios",
    coluna: coluna,
    ordem: ordem
  };
  receberResposta(pedido)
    .then((listaFuncionarios) => {
      tabelaTransicao = [];
      tamanho = Object.keys(listaFuncionarios).length;

      for (const key in listaFuncionarios) {

        if (listaFuncionarios.hasOwnProperty(key)) {
          const item = listaFuncionarios[key];
          const id = item.id;
          const nome = item.nome;
          const cargo = item.cargo;
          const login = item.login;
          const senha = item.senha;
          const newRow = [id, nome, cargo, login, senha];
          tabelaTransicao.push(newRow);
        }
      }

      for (i = 0; i < tamanho; i++) {
        var linha = tabelaResultante.insertRow(i);
        linha.removeAttribute("id");
        linha.setAttribute("id", tabelaTransicao[i][0]);
        linha.setAttribute("onclick", "escolheLinha(id)");

        for (j = 0; j < itensTela; j++) {
          var cell1 = linha.insertCell(j);
          cell1.innerHTML = tabelaTransicao[i][j];
        }
      }
    });
}

organiza_col_zero.addEventListener("click", (event) => {
  coluna = "id";

  if (ordem_zero == "ASC") ordem_zero = "DESC";
  else ordem_zero = "ASC";
  ordem = ordem_zero;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "nome";

  if (ordem_um == "ASC") ordem_um = "DESC";
  else ordem_um = "ASC";
  ordem = ordem_um;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "cargo";

  if (ordem_dois == "ASC") ordem_dois = "DESC";
  else ordem_dois = "ASC";
  ordem = ordem_dois;
  limpaTabela();
  criaTabela(coluna, ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "login";

  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  criaTabela(coluna, ordem);
});