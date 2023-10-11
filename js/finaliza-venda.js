const cliente = JSON.parse(localStorage.getItem("dadosCliente"));

fv_cpf_cliente.value = cliente[0];
fv_nome_cliente.value = cliente[1];

var tabelaItensVenda = document.getElementById("lista");
var tabelaTransicao = [];
const teclaNormal = document.querySelectorAll(`[class*="tecla_ativa"]`);
let edita = document.querySelector(".fv_edita");
let cancela = document.querySelector(".fv_cancela");
let abreCaixa = document.querySelector(".fv_abre_caixa");
let maquininha = document.querySelector(".fv_maquininha");
let valorRecebido = document.getElementById("fv_valor_recebido");
let valorTroco = document.getElementById("fv_total_troco");
let conjuntoRecebido = document.getElementById("fv_recebido");
let conjuntoTroco = document.getElementById("fv_troco");
let botaoRecebido = document.getElementById("botao_recebido");
let conteudoPopup = document.getElementById("tp_sair_popup");
let teclaEsc = document.querySelector(".tecla_esc");
let teclaEnter = document.querySelector(".tecla_enter");
let teclaDinheiro = document.querySelector(".tecla_dinheiro");
let teclaCartao = document.querySelector(".tecla_cartao");
let teclaRecebido = document.querySelector(".tecla_recebido");
let teclaEditar = document.querySelector(".tecla_editar");
let teclaCancelar = document.querySelector(".tecla_cancelar");
let saldoCompra = document.getElementById("fv_saldo_compra");
let cpf = document.getElementById("fv_cpf_cliente");
var cupom = 0;
var valorTotal = 0;
var quantidadeTotal = 0;
var codigoProduto = "";

let valorSaldo = JSON.parse(localStorage.getItem("subtotal"));
saldoCompra.value = parseFloat(valorSaldo).toFixed(2);
var tipoPagamento = "none";

teclaEditar.classList.remove("funcao_esconder");
teclaCancelar.classList.remove("funcao_esconder");

var pedido = {};
atualizaTabela();

function atualizaTabela() {
  const tabelaArmazenada = JSON.parse(localStorage.getItem("tabelaVenda"));

  if (tabelaArmazenada) {
    for (let i = 0; i < tabelaArmazenada.length; i++) {
      const dadosLinha = tabelaArmazenada[i];
      const linha = tabelaItensVenda.insertRow();
      linha.removeAttribute("id");
      linha.setAttribute("id", tabelaArmazenada[i][0]);
      linha.setAttribute("onclick", "escolheLinha(id)");

      for (let j = 0; j < dadosLinha.length; j++) {
        const cell = linha.insertCell();
        cell.innerHTML = dadosLinha[j];
      }
    }
  }
}

function enviarPedido(acao,pedido) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

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

function mudarPedido(acao,pedido) {
  return fetch(`https://mercadoalves-mercado.azuremicroservices.io/${acao}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

function pagamentoDinheiro() {
  edita.classList.add("funcao_esconder");
  cancela.classList.add("funcao_esconder");
  abreCaixa.classList.remove("funcao_esconder");
  conjuntoRecebido.classList.remove("funcao_esconder");
  conjuntoTroco.classList.remove("funcao_esconder");
  maquininha.classList.add("funcao_esconder");
  botaoRecebido.classList.remove("funcao_esconder");
  teclaCartao.classList.remove("funcao_esconder");
  teclaDinheiro.classList.add("funcao_esconder");
  teclaRecebido.classList.remove("funcao_esconder");
  teclaEditar.classList.add("funcao_esconder");
  teclaCancelar.classList.add("funcao_esconder");
  tipoPagamento = "dinheiro";
}

function pagamentoCartao() {
  edita.classList.add("funcao_esconder");
  cancela.classList.add("funcao_esconder");
  conjuntoRecebido.classList.add("funcao_esconder");
  conjuntoTroco.classList.add("funcao_esconder");
  abreCaixa.classList.add("funcao_esconder");
  maquininha.classList.remove("funcao_esconder");
  botaoRecebido.classList.remove("funcao_esconder");
  teclaCartao.classList.add("funcao_esconder");
  teclaDinheiro.classList.remove("funcao_esconder");
  teclaRecebido.classList.remove("funcao_esconder");
  teclaEditar.classList.add("funcao_esconder");
  teclaCancelar.classList.add("funcao_esconder");
  tipoPagamento = "cartao";
}

function calculaTroco() {
  var valorPago = valorRecebido.value;
  valorTroco.value = (valorRecebido.value - saldoCompra.value).toFixed(2);
}

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
  localStorage.setItem("subtotal", JSON.stringify(saldoCompra.value))
  location.href = 'edicao-venda.html';
}

function sairTela() {
  conteudoPopup.classList.remove("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.add("funcao_esconder");
  });
  teclaEsc.classList.remove("funcao_esconder");
  teclaEnter.classList.remove("funcao_esconder");
  const sairTela = 1;
  document.addEventListener("keydown", (event) => {
    if (event.key == "Escape") {
      sairPopup();
    }
    if (event.key == "Enter") {
      location.href = 'tela-cpf.html';
    }
  });
}

function sairPopup() {
  conteudoPopup.classList.add("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.remove("funcao_esconder");
  });
  teclaEsc.classList.add("funcao_esconder");
  teclaEnter.classList.add("funcao_esconder");
}

function pagamentoRecebido() {
  if((tipoPagamento == "dinheiro" && valorTroco.value >= 0) || tipoPagamento == "cartao") {
    atualizaTabelaVendas();
  }
}

function atualizaTabelaVendas() {
  var data = new Date();
  console.log(data)
  var mes = (data.getMonth() + 1).toString().padStart(2, '0');
  var dia = data.getDate().toString().padStart(2, '0');
  var ano = data.getFullYear();
  var hora = data.getHours();
  var minutos = data.getMinutes();
  var segundos = data.getSeconds();
  horaVenda = hora + ":" + minutos + ":" + segundos;
  data = ano + "-" + mes + "-" + dia;
  cupom = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
  numeroVenda = `${mes}${dia}${ano}${cupom}`;

  pedido = {
    numeroVenda: numeroVenda,
    cpf: cpf.value,
    valorTotal: saldoCompra.value,
    data: data,
    hora: horaVenda,
    pagamento: tipoPagamento,
    caixa: JSON.parse(localStorage.getItem("caixa")),
    cupom: cupom
  }
  acao = "vendas"
  enviarPedido(acao,pedido)
  .then((finaliza) => finaliza.json())
  .then((finaliza) => {
    atualizaQuantidadesEstoque();
  });
}

async function atualizaTabelaItensVendidos(quantidade,codigo,valorTotal,cupom) {
  const pedido = {
    numeroVenda: numeroVenda,
    quantidade: quantidade,
    codigo: codigo,
    valor: valorTotal,
    numeroCupom: cupom
  };
  acao = "itensVenda";

  try {
    const response = await enviarPedido(acao,pedido);
    const finaliza = await response.json();

    if (finaliza.status == "vendaFinalizada") {
      location.href = 'venda-finalizada.html';
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function atualizaQuantidadesEstoque() {
  const rowsArray = Array.from(tabelaItensVenda.rows);
  const promises = [];
  const itensArray = [];
  var numeroItem = 0;

  rowsArray.forEach(async (row) => {
    const quantidade = parseInt(row.cells[3].innerHTML, 10);
    const codigo = row.cells[1].innerHTML;

    const pedidoEstoque = {
      codigo: codigo
    };
    acao = "estoque/localiza-estoque";

    try {
      const produto = await receberResposta(acao,pedidoEstoque);
      const novaQuantidade = produto[0].quantidade - quantidade;
      const pedidoModificaEstoque = {
        codigo: produto[0].codigo,
        quantidade: novaQuantidade
      };
      acao = "estoque"
      promises.push(
        mudarPedido(acao,pedidoModificaEstoque)
          .then((resposta) => resposta.json())
          .then((statusCadastro) => {
            if (statusCadastro.message == "modificado") {
              quantidadeTotal = row.cells[3].innerHTML;
              codigoProduto = row.cells[1].innerHTML + "LOTE" + produto[0].lote;
              valorTotal = new Number (row.cells[5].innerHTML).toFixed(2);
              numeroCupom = cupom + "-" + numeroItem;
              };
              atualizaTabelaItensVendidos(quantidadeTotal,codigoProduto,valorTotal,numeroCupom);
              numeroItem += 1;
          })
          .catch((error) => {
            console.error("Error:", error);
          })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  });

  try {
    const responses = await Promise.all(promises);
  } catch (error) {
    console.error("Error:", error);
  }
}

valorRecebido.addEventListener("change", () => {
  calculaTroco();
});

document.addEventListener("keyup", (event) => {
  if (event.key == "F6") {
    editarLista();
  } else if (event.key == "F7") {
    sairTela();
  } else if (event.key == "F9") {
    pagamentoDinheiro();
  } else if (event.key == "F10") {
    pagamentoCartao();
  } else if (event.key == "F11" && tipoPagamento != "none") {
    pagamentoRecebido();
  }
});