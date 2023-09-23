const cliente = JSON.parse(localStorage.getItem("dadosCliente"));
const tabela = document.getElementById("lista");
const subtotalCompra = document.getElementById("subtotal_compra");
const cpf = cliente[0];
const nome = cliente[1];
let linhasApagar = [];
let item = 0;
let selecao = 0;
let valorTotalItensApagados = 0;

atualizaCliente(nome, cpf);
carregarLista();

function atualizaCliente(nome, cpf) {
  nome_cliente.value = nome;
  cpf_cliente.value = cpf;
}

function atualizaSubtotal(valor) {
  subtotalCompra.value = parseFloat(subtotalCompra.value) - parseFloat(valor).toFixed(2);
}

function carregarLista() {
  const tabelaArmazenada = JSON.parse(localStorage.getItem("tabelaVenda"));
  if (tabelaArmazenada) {
    for (let i = 0; i < tabelaArmazenada.length; i++) {
      const dadosLinha = tabelaArmazenada[i];
      const linha = tabela.insertRow();
      linha.removeAttribute("id");
      linha.setAttribute("id", tabelaArmazenada[i][0]);
      linha.setAttribute("onclick", "escolheLinha(id)");
      for (let j = 0; j < dadosLinha.length; j++) {
        const cell = linha.insertCell();
        cell.innerHTML = dadosLinha[j];
      }
    }
    subtotalCompra.value = JSON.parse(localStorage.getItem("subtotal"));
  }
}

function escolheLinha(id) {
  const linhaEdita = document.getElementById(id);
  if (linhaEdita.className === "nve_linha_escolhida" || linhaEdita.className === "nve_linha_escolhida nve_linha_selecionada" || linhaEdita.className === "nve_linha_selecionada nve_linha_escolhida") {
    linhaEdita.classList.remove("nve_linha_escolhida");
  } else {
    linhaEdita.classList.add("nve_linha_escolhida");
  }
  item = 0;
  linhasApagar = [];
}

function navegaLinha(id) {
  const linhaSeleciona = document.getElementById(id);
  if (linhaSeleciona !== null) {
    const linhasSelecionadas = document.querySelectorAll(".nve_linha_selecionada");
    linhasSelecionadas.forEach((element) => {
      element.classList.remove("nve_linha_selecionada");
    });
    linhaSeleciona.classList.add("nve_linha_selecionada");
    item = 0;
    linhasApagar = [];
  }
}

function apagaItem() {
  const linhasSelecionadas = document.querySelectorAll(".nve_linha_escolhida");
  const linhasApagar = Array.from(linhasSelecionadas).map(element => {
    return element.rowIndex;
  });
  let tamanho = linhasApagar.length;
  for (let i = tamanho - 1; i >= 0; i--) {
    const rowIndex = linhasApagar[i];
    const linha = tabela.rows[rowIndex];
    const valorItemApagado = parseFloat(linha.cells[4].innerHTML);
    valorTotalItensApagados += valorItemApagado;
    tabela.deleteRow(rowIndex);
  }
  atualizaSubtotal(valorTotalItensApagados);
}

function voltaCompras() {
  const linhasTabela = [];
  const linhas = tabela.rows;
  for (let i = 0; i < linhas.length; i++) {
    const cells = linhas[i].cells;
    const dadosDaLinha = [];
    for (let j = 0; j < cells.length; j++) {
      dadosDaLinha.push(cells[j].innerHTML);
    }
    linhasTabela.push(dadosDaLinha);
  }
  localStorage.setItem("tabelaVenda", JSON.stringify(linhasTabela));
  localStorage.setItem("subtotal", JSON.stringify(subtotalCompra.value));
  localStorage.setItem("tabela_token", JSON.stringify(1));
  location.href = 'nova-venda.html';
}

document.addEventListener("keyup", (event) => {
  const tamanho = tabela.rows.length;
  if (event.key === "F12") {
    event.preventDefault();
    voltaCompras();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    selecao = selecao + 1;
    if (selecao > tamanho) {
      selecao = 1;
    }
    navegaLinha(selecao);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selecao = selecao - 1;
    if (selecao < 1) {
      selecao = tamanho;
    }
    navegaLinha(selecao);
  } else if (event.key === "Delete") {
    event.preventDefault();
    apagaItem();
  } else if (event.key === "Enter") {
    event.preventDefault();
    escolheLinha(selecao);
  }
});