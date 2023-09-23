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

saldoCompra.value = JSON.parse(localStorage.getItem("subtotal"));

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

function enviarPedido(pedido) {
  const url = 'http://localhost:3000/';

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
}

function mudarPedido(pedido) {
  return fetch("http://localhost:3000", {
    method: 'PUT',
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
  valorTroco.value = valorRecebido.value - saldoCompra.value;
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
  atualizaTabelaVendas();
}

function atualizaTabelaVendas() {
  var data = new Date();
  var mes = data.getMonth() + 1;
  var dia = data.getDate();
  var ano = data.getFullYear();
  var hora = data.getHours();
  var minutos = data.getMinutes();
  horaVenda = hora + ":" + minutos;
  data = ano + "-" + mes + "-" + dia;
  cupom = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
  numeroVenda = `${mes}${dia}${ano}${cupom}`;

  pedido = {
    action: "novaVendaRealizada",
    numeroVenda: numeroVenda,
    cpf: cpf.value,
    valorTotal: saldoCompra.value,
    data: data,
    hora: horaVenda,
    pagamento: tipoPagamento,
    caixa: JSON.parse(localStorage.getItem("caixa"))
  }
  enviarPedido(pedido)
  .then((finaliza) => finaliza.json())
  .then((finaliza) => {
    atualizaTabelaItensVendidos();
  });
}

async function atualizaTabelaItensVendidos() {
  const rowsArray = Array.from(tabelaItensVenda.rows);
  const itensArray = [];
  var numeroItem = 0;

  rowsArray.forEach((row) => {
    const quantidade = row.cells[3].innerHTML;
    const codigo = row.cells[1].innerHTML;
    const valor = row.cells[4].innerHTML;

    const item = {
      quantidade: quantidade,
      codigo: codigo,
      valor: valor,
      cupom: cupom + "-" + numeroItem
    };

    itensArray.push(item);
    numeroItem += 1;
  });

  const pedido = {
    action: "novoItensVenda",
    numeroVenda: numeroVenda,
    itens: itensArray
  };

  try {
    const response = await enviarPedido(pedido);
    const finaliza = await response.json();

    if (finaliza.status == "vendaFinalizada") {
      atualizaQuantidadesEstoque();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function atualizaQuantidadesEstoque() {
  const rowsArray = Array.from(tabelaItensVenda.rows);
  const promises = [];

  rowsArray.forEach(async (row) => {
    const quantidade = parseInt(row.cells[3].innerHTML, 10);
    const codigo = row.cells[1].innerHTML;

    const pedidoEstoque = {
      action: "localizaEstoque",
      codProduto: codigo,
    };

    try {
      const produto = await receberResposta(pedidoEstoque);

      const novaQuantidade = produto.quantidade - quantidade;
      const pedidoModificaEstoque = {
        action: "atualizaQuantidadeEstoque",
        codigo: produto.codigo,
        quantidade: novaQuantidade
      };

      promises.push(
        mudarPedido(pedidoModificaEstoque)
          .then((resposta) => resposta.json())
          .then((statusCadastro) => {
            if (statusCadastro.message == "modificado") {
              location.href = 'venda-finalizada.html';
            }
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