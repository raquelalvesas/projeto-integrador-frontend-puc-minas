var tabelaResultante = document.getElementById("itens_edicao");
var coluna = "id";
var ordem = "asc";
var ordem_zero = "asc";
var ordem_um = "asc";
var ordem_dois = "asc";
var ordem_tres = "asc";
var ordem_quatro = "asc";
var numeroColunas = 5;
var itensTela = 6;
var quantidadeEdicao = 0;
var pedido = {};
var acao = "usuarios";

criaTabela(coluna, ordem);

function deletarPedido(acao) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'DELETE',
  });
}

function receberResposta(acao,pedido) {
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
    return element.cells.item(0).innerHTML;
  });
  tamanho = linhasApagar.length;
  for (var i = 0; i < tamanho; i++) {
    acao = "usuarios/" + linhasApagar[i],
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
}

function criaTabela(ordem) {
  acao = "usuarios?sort=" + ordem;
  receberResposta(acao,pedido)
    .then((listaFuncionarios) => {
    listaFuncionarios = listaFuncionarios.content;
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
          const acesso = item.acesso;
          const newRow = [id, nome, cargo, login, senha, acesso];
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

  if (ordem_zero == "asc") ordem_zero = "desc";
  else ordem_zero = "asc";
  ordem = coluna + "," + ordem_zero;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "nome";

  if (ordem_um == "asc") ordem_um = "desc";
  else ordem_um = "asc";
  ordem = coluna + "," + ordem_um;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "cargo";

  if (ordem_dois == "asc") ordem_dois = "desc";
  else ordem_dois = "asc";
  ordem = coluna + "," + ordem_dois;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "login";

  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = coluna + "," + ordem_tres;
  limpaTabela();
  criaTabela(ordem);
});

organiza_col_quatro.addEventListener("click", (event) => {
  coluna = "login";

  if (ordem_quatro == "asc") ordem_quatro = "desc";
  else ordem_quatro = "asc";
  ordem = coluna + "," + ordem_quatro;
  limpaTabela();
  criaTabela(ordem);
});