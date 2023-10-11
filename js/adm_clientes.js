var tabelaResultante = document.getElementById("itens_edicao");
var itensApagar = [];
var itemEditar = [];
var tabelaTransicao = [[]];
var coluna = "cpf";
var ordem = "sortBy=cpf&sortOrder=asc";
var ordem_zero = "asc";
var ordem_um = "asc";
var ordem_dois = "asc";
var ordem_tres = "asc";
var numeroColunas = 4;
var itensTela = 4;
var quantidadeEdicao = 0;
var pedido = {};
var acao = "clientes";

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

function ultimasCompras(dias) {
  var hoje = new Date();
  var tamanho = tabelaResultante.rows.length;
  for (i = 0; i < tamanho; i++) {
    var data = tabelaResultante.rows.item(i).cells.item(2).innerHTML;
    var barra = data.indexOf("/");
    var dia = data.slice(0, barra);
    barra2 = data.indexOf("/", barra + 1);
    var mes = data.slice(barra + 1, barra2);
    mes = mes + 1;
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
  for (var i = 0; i < tamanho; i++) {
    acao = "clientes/" + linhasApagar[i],
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

function criaTabela(ordem) {
  acao = "clientes/custom-listar?" + ordem;
  receberResposta(acao)
    .then((resposta) => {
      tabelaTransicao = [];
      const uniqueCpfMap = {};
      for (const key in resposta) {
        if (resposta.hasOwnProperty(key)) {
          const item = resposta[key];
          const cpf = item.cpf;
          var data = new Date(item.data);
          data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
          const cupom = item.cupom;

          if (!(cpf in uniqueCpfMap) || data > uniqueCpfMap[cpf].data) {
            uniqueCpfMap[cpf] = {
              cpf: cpf,
              nome: item.nome,
              data: data,
              cupom: cupom,
            };
          }
        }
      }

      tabelaTransicao = Object.values(uniqueCpfMap);
      tabelaTransicao.sort((a, b) => b.data - a.data);

      for (i = 0; i < tabelaTransicao.length; i++) {
        var linha = tabelaResultante.insertRow(i);
        linha.removeAttribute("id");
        linha.setAttribute("id", tabelaTransicao[i].cpf);
        linha.setAttribute("onclick", "escolheLinha(id)");
        
        var cpfCell = linha.insertCell(0);
        cpfCell.innerHTML = tabelaTransicao[i].cpf;
        var nomeCell = linha.insertCell(1);
        nomeCell.innerHTML = tabelaTransicao[i].nome;
        var ultimaCompraCell = linha.insertCell(2);
        var data = tabelaTransicao[i].data;
        if (data.getFullYear() === 1969) {
          ultimaCompraCell.innerHTML = "Não realizou compras";
        } else {
          var mes = data.getMonth() + 1;
          var dia = data.getDate();
          var ano = data.getFullYear();
          ultimaCompraCell.innerHTML = dia + "/" + mes + "/" + ano;
        }
        var cupomCell = linha.insertCell(3);
        cupomCell.innerHTML = tabelaTransicao[i].cupom;
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      throw new Error("Erro ao processar a resposta do servidor");
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
  if (ordem_zero == "asc") ordem_zero = "desc";
  else ordem_zero = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_zero;
  limpaTabela();
  criaTabela(ordem);
})

organiza_col_um.addEventListener("click", (event) => {
  coluna = "nome";
  if (ordem_um == "asc") ordem_um = "desc";
  else ordem_um = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_um;
  limpaTabela();
  criaTabela(ordem);
})

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "data";
  if (ordem_dois == "asc") ordem_dois = "desc";
  else ordem_dois = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_dois;
  limpaTabela();
  criaTabela(ordem);
})

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "cupom";
  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = "sortBy=" + coluna + "&sortOrder=" + ordem_tres;
  limpaTabela();
  criaTabela(ordem);
})

notifica_compras.addEventListener("change", (event) => {
  var identificacaoCompras = document.getElementById("notifica_compras");
  ultimasCompras(identificacaoCompras.value);
});