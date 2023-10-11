var itensCupom = [[]];
var infoCupom = document.getElementById("detalhes_cliente");
var conteudoCupom = document.getElementById("lista");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
var itensTela = 3;
acao = "vendas";

criaInformacoesCupom(indexador);
listaCompras(indexador);

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

function criaInformacoesCupom(indexador) {
  indexador = indexador.split("-")[0];
  pedido = {
    cupom: indexador,
  };
  acao = "vendas/localiza-venda";
  receberResposta(acao,pedido)
    .then((informacoesCupom) => {
      for (i = 0; i < 6; i++) {
        var linha = infoCupom.insertRow(i);
        var data = new Date(informacoesCupom.data);
        data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
        var mes = data.getMonth() + 1;
        var dia = data.getDate() + 1;
        var ano = data.getFullYear();
        var novaData = dia + "/" + mes + "/" + ano;

        switch (i) {
          case 0:
            linha.innerHTML = "CUPOM FISCAL"
            linha.setAttribute("class", "nome_informacoes_cliente");
            break;

          case 1:
            linha.innerHTML = "Número: " + indexador.split("-")[0];
            linha.setAttribute("class", "nome_informacoes");
            break;

          case 2:
            linha.innerHTML = "Data de emissão: " + novaData;
            linha.setAttribute("class", "nome_informacoes");
            break;

          case 3:
            linha.innerHTML = "Hora de emissão: " + informacoesCupom.hora;
            linha.setAttribute("class", "nome_informacoes");
            break;

          case 4:
            linha.innerHTML = "Valor total: R$ " + informacoesCupom.valorTotal.toFixed(2);
            linha.setAttribute("class", "nome_informacoes");
            break;

          case 5:
            linha.innerHTML = "Caixa: " + informacoesCupom.caixa;
            linha.setAttribute("class", "nome_informacoes");
            break;
        }
      }
    });
}

function listaCompras(indexador) {
  pedido = {
    partialNumeroCupom: indexador.split("-")[0],
  };
  acao = "itensVenda/localiza-itemVenda"
  receberResposta(acao,pedido)
    .then((cupom) => {
      tabelaTransicao = [];
      tamanho = Object.keys(cupom).length;
      for (const key in cupom) {
        if (cupom.hasOwnProperty(key)) {
          const item = cupom[key];
          const quantidade = item.quantidade;
          const descricao = item.produto;
          const valor = "R$" + item.valorTotal.toFixed(2);
          const newRow = [quantidade, descricao, valor];
          tabelaTransicao.push(newRow);
        }
      }
      for (i = 0; i < tamanho; i++) {
        var linha = conteudoCupom.insertRow(i);
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