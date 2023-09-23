var itensCupom = [[]];
var infoCupom = document.getElementById("detalhes_cliente");
var conteudoCupom = document.getElementById("lista");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
var itensTela = 3;

criaInformacoesCupom(indexador);
listaCompras(indexador);

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

function criaInformacoesCupom(indexador) {
  pedido = {
    action: "informacoesGeraisCupom",
    cupom: indexador,
  };
  receberResposta(pedido)
    .then((informacoesCupom) => {
      for (i = 0; i < 6; i++) {
        var linha = infoCupom.insertRow(i);
        const data = new Date(informacoesCupom.data);
        var mes = data.getMonth() + 1;
        var dia = data.getDate();
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
            linha.innerHTML = "Valor total: R$ " + informacoesCupom.valor;
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
    action: "localizaCupom",
    cupom: indexador.split("-")[0],
  };
  receberResposta(pedido)
    .then((cupom) => {
      tabelaTransicao = [];
      tamanho = Object.keys(cupom).length;
      for (const key in cupom) {
        if (cupom.hasOwnProperty(key)) {
          const item = cupom[key];
          const quantidade = item.quantidade;
          const descricao = item.produto;
          const valor = item.valor;
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