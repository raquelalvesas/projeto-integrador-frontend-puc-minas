let conteudoPopup = document.querySelector(".tp_popup_conteudo");
let botaoSair = document.querySelector(".tp_sair");
let fecharPopup = document.querySelector(".tp_popup_nao");
let botaoAdministracao = document.querySelector(".tp_administrador");
const teclaNormal = document.querySelectorAll(`[class*="tecla_ativa"]`);
let teclaAdministrador = document.querySelector(".tecla_opcional");
let teclaEsc = document.querySelector(".tecla_esc");
let teclaEnter = document.querySelector(".tecla_enter");
let acesso = JSON.parse(localStorage.getItem("acesso"));

verificaAcesso(acesso);

function verificaAcesso(acesso) {
  if (acesso === "ADMINISTRADOR") {
    botaoAdministracao.classList.remove("funcao_esconder");
    teclaAdministrador.classList.remove("funcao_esconder");
  } else {
    botaoAdministracao.classList.add("funcao_esconder");
    teclaAdministrador.classList.add("funcao_esconder");
  }
  localStorage.removeItem("usuario");
}

function sairTela() {
  conteudoPopup.classList.remove("funcao_esconder");
  botaoSair.classList.add("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.add("funcao_esconder");
  });
  teclaAdministrador.classList.add("funcao_esconder");
  teclaEsc.classList.remove("funcao_esconder");
  teclaEnter.classList.remove("funcao_esconder");
  document.addEventListener("keydown", (event) => {
    if (event.key == "Escape") {
      sairPopup();
    }
    if (event.key == "Enter") {
      location.href = 'index.html';
    }
  });
}

function sairPopup() {
  conteudoPopup.classList.add("funcao_esconder");
  botaoSair.classList.remove("funcao_esconder");
  botaoAdministracao.classList.remove("funcao_esconder");
  teclaNormal.forEach((tecla) => {
    tecla.classList.remove("funcao_esconder");
  });
  teclaAdministrador.classList.remove("funcao_esconder");
  teclaEsc.classList.add("funcao_esconder");
  teclaEnter.classList.add("funcao_esconder");
}

botaoSair.addEventListener("click", sairTela);
fecharPopup.addEventListener("click", sairPopup);

window.addEventListener("keydown", (event) => {
  if (event.key == "F1") {
    event.preventDefault();
    sairTela();
  }
  if (event.key == "F2") {
    event.preventDefault();
    location.href = 'tela-cpf.html';
  }
  if (event.key == "F3") {
    event.preventDefault();
    location.href = 'adm_estoque.html';
  }
});