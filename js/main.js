const form = document.getElementById("acesso_usuario_senha");
const statusCadastro = document.getElementById("usuario_cadastro");
const statusComunicacao = document.getElementById("erro_autorizacao");

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

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const pedido = {
    login: evento.target.elements['nome_usuario'].value,
    senha: evento.target.elements['senha_usuario'].value
  };
  const acao = "usuarios/verifica-acesso";

  receberResposta(acao,pedido)
    .then(responseData => {
      const acesso = responseData.acesso;
      const acessoUpperCase = acesso.toUpperCase();
      if (acessoUpperCase  == "FUNCIONÁRIO") acessoUpperCase  = "FUNCIONARIO";
      if (acessoUpperCase  === "ADMINISTRADOR" || acessoUpperCase  === "FUNCIONARIO") {
        localStorage.setItem("caixa", JSON.stringify(evento.target.elements['nome_usuario'].value));
        localStorage.setItem("acesso", JSON.stringify(acessoUpperCase));
        location.href = 'tela-principal.html';
      } else {
        statusCadastro.classList.remove("funcao_esconder");
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      statusComunicacao.classList.remove("funcao_esconder");
    });
});