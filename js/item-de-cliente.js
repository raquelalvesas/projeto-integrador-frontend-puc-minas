var informacoesCompras = [[]];
var detalhesCliente = document.getElementById("detalhes_cliente");
var comprasCliente = document.getElementById("lista");
var indexador = JSON.parse(localStorage.getItem("idDetalhe"));
var tabelaTransicao = [];
var itensTela = 4;
var ordem = "ASC";
var ordem_zero = "ASC";
var ordem_um = "ASC";
var ordem_dois = "ASC";
var ordem_tres = "ASC";
var coluna = "data";

function receberMensagem(pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `http://localhost:3000?${queryParams}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
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
    action: "localizaCliente",
    cpf: indexador
  };
  receberMensagem(pedido)
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
    action: "informacoesComprasCPF",
    cpf: indexador,
    coluna: coluna,
    ordem: ordem
  };
  receberMensagem(pedido)
    .then(resposta => resposta.json())
    .then(compras => {
      tabelaTransicao = [];

      for (const key in compras) {
        if (compras.hasOwnProperty(key)) {
          const item = compras[key];
          const data = item.data;
          const hora = item.hora;
          const valor = "R$ " + (item.valor).toFixed(2);
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
            var mes = data.getMonth() + 1;
            var dia = data.getDate();
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
  coluna = "v.data";
  if (ordem_zero == "ASC") ordem_zero = "DESC";
  else ordem_zero = "ASC";
  ordem = ordem_zero;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_um.addEventListener("click", (event) => {
  coluna = "v.hora";
  if (ordem_um == "ASC") ordem_um = "DESC";
  else ordem_um = "ASC";
  ordem = ordem_um;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_dois.addEventListener("click", (event) => {
  coluna = "v.valor";
  if (ordem_dois == "ASC") ordem_dois = "DESC";
  else ordem_dois = "ASC";
  ordem = ordem_dois;
  limpaTabela();
  listaCompras(coluna, ordem);
});

organiza_col_tres.addEventListener("click", (event) => {
  coluna = "i.cupom";
  if (ordem_tres == "ASC") ordem_tres = "DESC";
  else ordem_tres = "ASC";
  ordem = ordem_tres;
  limpaTabela();
  listaCompras(coluna, ordem);
});

encontraItem();
listaCompras("data", ordem_zero, "data");