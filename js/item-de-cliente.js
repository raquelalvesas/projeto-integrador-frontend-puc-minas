var informacoesCompras = [[]];
var detalhesCliente = document.getElementById("detalhes_cliente");
var comprasCliente = document.getElementById("lista");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
var tabelaTransicao = [];
var itensTela = 4;
var ordem = "asc";
var ordem_zero = "asc";
var ordem_um = "asc";
var ordem_dois = "asc";
var ordem_tres = "asc";
var coluna = "data";
acao="clientes";

function receberMensagem(acao,pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `https://mercadoalves-mercado.azuremicroservices.io/${acao}?${queryParams}`;
  return fetch(url, {
    method: 'GET',
  });
}

function limpaTabela() {
  const tamanho = comprasCliente.rows.length;
  for (let i = 0; i < tamanho; i++) {
    comprasCliente.deleteRow(0);
  }
  tabelaTransicao = [[]];
}

function encontraItem() {
  const pedido = {
    cpf: indexador
  };
  acao = acao + "/localiza-cliente";
  receberMensagem(acao,pedido)
    .then(resposta => resposta.json())
    .then(produto => {
      var linhaNome = detalhesCliente.insertRow(0);
      var cellNome = linhaNome.insertCell(0);
      cellNome.innerHTML = produto.nome;
      cellNome.setAttribute("class", "nome_informacoes_cliente");
      var linhaCPF = detalhesCliente.insertRow(1);
      var cellCPF = linhaCPF.insertCell(0);
      cellCPF.innerHTML = "CPF: " + indexador;
      cellCPF.setAttribute("class", "nome_informacoes");
      var linhaEmail = detalhesCliente.insertRow(2);
      var cellEmail = linhaEmail.insertCell(0);
      cellEmail.innerHTML = "E-mail: " + produto.email;
      cellEmail.setAttribute("class", "nome_informacoes");
      var linhaEndereco = detalhesCliente.insertRow(3);
      var cellEndereco = linhaEndereco.insertCell(0);
      cellEndereco.innerHTML = "Endereço: " + produto.endereco + ". " + produto.cidade + ". " + produto.estado;
      cellEndereco.setAttribute("class", "nome_informacoes");
      var linhaCEP = detalhesCliente.insertRow(4);
      var cellCEP = linhaCEP.insertCell(0);
      cellCEP.innerHTML = "CEP: " + produto.cep;
      cellCEP.setAttribute("class", "nome_informacoes");
      var linhaTelefone = detalhesCliente.insertRow(5);
      var cellTelefone = linhaTelefone.insertCell(0);
      cellTelefone.innerHTML = "Telefone: " + produto.telefone;
      cellTelefone.setAttribute("class", "nome_informacoes");
      var linhaNascimento = detalhesCliente.insertRow(6);
      var cellNascimento = linhaNascimento.insertCell(0);
      var dataNascimento = new Date (produto.nascimento);
      dataNascimento = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
      cellNascimento.innerHTML = "Data de nascimento: " + (dataNascimento.getDate() + "/" + (dataNascimento.getMonth()+1) + "/" + dataNascimento.getFullYear());
      cellNascimento.setAttribute("class", "nome_informacoes");
    });
}

function escolheLinha(id) {
  id = id + "-0";
  localStorage.setItem("idDetalhe", JSON.stringify(id))
  location.href = 'cupom.html';
}

function listaCompras(coluna, ordem) {
  const pedido = {
    cpf: indexador,
    sortOrder: ordem,
    sortField: coluna
  };
  acao = "vendas/venda-cpf"
  receberMensagem(acao,pedido)
    .then(resposta => resposta.json())
    .then(compras => {
      tabelaTransicao = [];

      for (const key in compras) {
        if (compras.hasOwnProperty(key)) {
          const item = compras[key];
          const data = item.data;
          const hora = item.hora;
          const valor = "R$ " + (item.valorTotal).toFixed(2);
          const cupom = item.cupom;
          const newRow = [data, hora, valor, cupom];
          tabelaTransicao.push(newRow);
        }
      }
      const tamanho = tabelaTransicao.length;

      for (let i = 0; i < tamanho; i++) {
        var linha = comprasCliente.insertRow(i);

        for (let j = 0; j < itensTela; j++) {
          if (j == 0) {
            var data = new Date(tabelaTransicao[i][j]);
            data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
            var mes = data.getMonth() + 1;
            var dia = data.getDate() + 1;
            var ano = data.getFullYear();
            tabelaTransicao[i][j] = dia + "/" + mes + "/" + ano;
          }
          var cell1 = linha.insertCell(j);
          cell1.innerHTML = tabelaTransicao[i][j];
        }
        linha.setAttribute("id",tabelaTransicao[i][3]);
        linha.setAttribute("onclick", "escolheLinha(id)");
      }
    });
}

organiza_col_zero.addEventListener("click", (event) => {
  coluna = "data";
  if (ordem_zero == "asc") ordem_zero = "desc";
  else ordem_zero = "asc";
  ordem = ordem_zero;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "hora";
  if (ordem_um == "asc") ordem_um = "desc";
  else ordem_um = "asc";
  ordem = ordem_um;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "valorTotal";
  if (ordem_dois == "asc") ordem_dois = "desc";
  else ordem_dois = "asc";
  ordem = ordem_dois;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "cupom";
  if (ordem_tres == "asc") ordem_tres = "desc";
  else ordem_tres = "asc";
  ordem = ordem_tres;
  limpaTabela();
  listaCompras(coluna, ordem);
});

encontraItem();
listaCompras("data", ordem_zero, "data");