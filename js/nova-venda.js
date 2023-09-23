const cliente = JSON.parse(localStorage.getItem("dadosCliente"));
const tabelaToken = JSON.parse(localStorage.getItem("tabela_token"));
const codigoProduto = document.getElementById("cod_produto");
const nomeProduto = document.getElementById("descricao_produto");
const valorVenda = document.getElementById("valor_produto");
const quantidadeItens = document.getElementById("quantidade_produto");
const subtotalCompra = document.getElementById("subtotal_compra");
quantidadeItens.value = 1;
const numeroProduto = document.getElementById("numero_produto");
var endFoto = document.getElementById("nv_foto_produto");
endFoto.src = "";
const tabelaItensVenda = document.getElementById("lista");
const total = 0;
const conteudoPopup = document.querySelector(".nv_popup_conteudo");
const conteudoPagamento = document.querySelector(".nv_sair_pagamento");
const carrinhoVazio = document.getElementById("nv_mensagem_carrinho_vazio");
const processaPagamento = document.getElementById("nv_mensagem_finaliza_compra");
const teclaNormal = document.querySelectorAll(`[class*="tecla_ativa"]`);
const teclaEsc = document.querySelector(".tecla_esc");
const teclaEnter = document.querySelector(".tecla_enter");
let pedido = {};
var itensTela = 6;
var indiceDaLinha = 0;
tabelaTransicao = [];
let subtotal = 0;

cpf_cliente.value = cliente[0];
nome_cliente.value = cliente[1];

async function receberResposta(pedido) {
  const queryParams = new URLSearchParams(pedido).toString();
  const url = `http://localhost:3000?${queryParams}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Erro na requisição. Status: ${response.status}`);
    }
    const data = await response.json().catch(() => response.text());
    if (data) {
      return data;
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao processar a resposta do servidor');
  }
}

if (tabelaToken === 1) {
  carregarLista();
  localStorage.setItem("tabela_token", JSON.stringify(0));
}

function carregarLista() {
  const tabelaArmazenada = JSON.parse(localStorage.getItem("tabelaVenda"));
  subtotalCompra.value = JSON.parse(localStorage.getItem("subtotal"));
  if (tabelaArmazenada) {
    for (let i = 0; i < tabelaArmazenada.length; i++) {
      const dadosLinha = tabelaArmazenada[i];
      const linha = tabelaItensVenda.insertRow();
      for (let j = 0; j < dadosLinha.length; j++) {
        const cell = linha.insertCell();
        cell.innerHTML = dadosLinha[j];
      }
    }
  }
}

function pagamento() {
  conteudoPagamento.classList.remove("funcao_esconder");
  if(tabelaItensVenda.rows.length > 0) {
    processaPagamento.classList.remove("funcao_esconder");
    carrinhoVazio.classList.add("funcao_esconder");
    teclaNormal.forEach(tecla => {
      tecla.classList.add("funcao_esconder");
    });
    teclaEsc.classList.remove("funcao_esconder");
    teclaEnter.classList.remove("funcao_esconder");
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        sairPagamento();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        finalizaCompra();
      }
    });
  } else {
    processaPagamento.classList.add("funcao_esconder");
    carrinhoVazio.classList.remove("funcao_esconder");
    teclaNormal.forEach(tecla => {
      tecla.classList.add("funcao_esconder");
    });
    teclaEsc.classList.remove("funcao_esconder");
    teclaEnter.classList.remove("funcao_esconder");
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        sairPagamento();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        sairPagamento();
      }
    });
  }
}

async function atualizaCampos(codProduto) {
  pedido = {
    action: "localizaProdutoVenda",
    codProduto: codProduto,
  };
  receberResposta(pedido)
    .then(produto => {
      nomeProduto.value = produto.produto;
      valorVenda.value = produto.valor;
      endFoto.src = produto.foto;
      const descricao = produto.produto;
      const codigoProduto = produto.codigo;
      const quantidade = quantidadeItens.value;
      const valor = (produto.valor).toFixed(2);
      const total = quantidade * valor;
      subtotal = subtotal + total;
      indiceDaLinha++;
      numeroProduto.value = indiceDaLinha;
      tabelaTransicao = [indiceDaLinha, codigoProduto, descricao, quantidade, valor, total];
      var linha = tabelaItensVenda.insertRow(0);
      for (j = 0; j < itensTela; j++) {
        var cell1 = linha.insertCell(j);
        cell1.innerHTML = tabelaTransicao[j];
      }
      subtotalCompra.value = subtotal;
    });
  codigoProduto.setAttribute("autofocus", "autofocus");
}

function limpaTabela() {
  tamanho = tabelaItensVenda.rows.length;
  for (i = 0; i < tamanho; i++) {
    tabelaItensVenda.deleteRow(0);
  }
  tabelaTransicao = [[]];
}

function finalizaCompra() {
  if(tabelaItensVenda.rows.length > 0){
    const linhasTabela = [];
    const linhas = tabelaItensVenda.rows;
    for (let i = 0; i < linhas.length; i++) {
      const cells = linhas[i].cells;
      const dadosDaLinha = [];
      for (let j = 0; j < cells.length; j++) {
        dadosDaLinha.push(cells[j].innerHTML);
      }
      linhasTabela.push(dadosDaLinha);
    }
    localStorage.setItem("tabelaVenda", JSON.stringify(linhasTabela));
    localStorage.setItem("subtotal", JSON.stringify(subtotalCompra.value))
    location.href = 'finaliza-venda.html';
  }else {
    sairPagamento();
  }
}

codigoProduto.addEventListener("change", () => {
  atualizaCampos(codigoProduto.value);
  codigoProduto.value = "";
});

function editarLista() {
  const linhasTabela = [];
  const linhas = tabelaItensVenda.rows;
  for (let i = 0; i < linhas.length; i++) {
    const cells = linhas[i].cells;
    const dadosDaLinha = [];
    for (let j = 0; j < cells.length; j++) {
      dadosDaLinha.push(cells[j].innerHTML);
    }
    linhasTabela.push(dadosDaLinha);
  }
  localStorage.setItem("tabelaVenda", JSON.stringify(linhasTabela));
  localStorage.setItem("subtotal", JSON.stringify(subtotalCompra.value))
  location.href = 'edicao-venda.html';
}

function sairPopup() {
  conteudoPopup.classList.add("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.remove("funcao_esconder");
  });
  teclaEsc.classList.add("funcao_esconder");
  teclaEnter.classList.add("funcao_esconder");
}

function sairPagamento() {
  conteudoPagamento.classList.add("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.remove("funcao_esconder");
  });
  teclaEsc.classList.add("funcao_esconder");
  teclaEnter.classList.add("funcao_esconder");
}

function sairTela() {
  conteudoPopup.classList.remove("funcao_esconder");
  teclaNormal.forEach(tecla => {
    tecla.classList.add("tecla_desabilitada");
  });
  teclaEsc.classList.remove("tecla_desabilitada");
  teclaEnter.classList.add("tecla_desabilitada");
  teclaEsc.addEventListener("click", () => {
    conteudoPopup.classList.add("funcao_esconder");
    teclaNormal.forEach(tecla => {
      tecla.classList.remove("tecla_desabilitada");
    });
    teclaEsc.classList.add("tecla_desabilitada");
    teclaEnter.classList.remove("tecla_desabilitada");
  });
  teclaEnter.addEventListener("click", () => {
    conteudoPopup.classList.add("funcao_esconder");
    conteudoPagamento.classList.remove("funcao_esconder");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key == "Escape") {
      sairPopup();
    }
    if (event.key == "Enter") {
      event.preventDefault();
      location.href = 'tela-cpf.html';
    }
  });
}

document.addEventListener("keyup", (event) => {
  if (event.key === "F6") {
    event.preventDefault();
    editarLista();
    iniciaVenda(cpf);
  } else if (event.key === "F7") {
    event.preventDefault();
    sairTela();
  } else if (event.key === "F8") {
    event.preventDefault();
    pagamento();
  } else if (event.key === "F9") {
    event.preventDefault();
    atualizaCampos(codigoProduto.value);
    codigoProduto.value = "";
  }
});
