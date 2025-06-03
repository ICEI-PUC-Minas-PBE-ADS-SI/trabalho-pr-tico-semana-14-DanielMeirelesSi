const form = document.getElementById("form-filme");
const tabela = document.getElementById("tabela-filmes").querySelector("tbody");
let modoEdicao = false;
let idEditando = null;

// Função para carregar e exibir os filmes
async function carregarFilmesNaTabela() {
  const resposta = await fetch("http://localhost:3001/filmes");
  const filmes = await resposta.json();

  tabela.innerHTML = "";
  filmes.forEach((filme) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${filme.titulo}</td>
      <td>${filme.diretor}</td>
      <td>${filme.categoria}</td>
      <td>${filme.data}</td>
      <td>${filme.duracao}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarFilme('${filme.id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="removerFilme('${filme.id}')">Remover</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Carregar ao iniciar
carregarFilmesNaTabela();

// Evento para salvar ou atualizar
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const novoFilme = {
    titulo: form.titulo.value,
    diretor: form.diretor.value,
    categoria: form.categoria.value,
    data: form.data.value,
    duracao: form.duracao.value,
    elenco: form.elenco.value,
    resumo: form.resumo.value,
    descricao: form.descricao ? form.descricao.value : form.resumo.value,
    imagem: form.imagem.value,
    trailer: form.trailer.value,
  };

  if (modoEdicao) {
    await fetch(`http://localhost:3001/filmes/${idEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...novoFilme, id: idEditando }),
    });
    mostrarToast("Filme atualizado com sucesso!", "warning");
    modoEdicao = false;
    idEditando = null;
  } else {
    await fetch("http://localhost:3001/filmes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFilme),
    });
    mostrarToast("Filme adicionado com sucesso!", "success");
  }

  form.reset();
  carregarFilmesNaTabela();
});

// Função para preencher o formulário ao editar
async function editarFilme(id) {
  const resposta = await fetch(`http://localhost:3001/filmes/${id}`);
  const filme = await resposta.json();

  form.titulo.value = filme.titulo;
  form.diretor.value = filme.diretor;
  form.categoria.value = filme.categoria;
  form.data.value = filme.data;
  form.duracao.value = filme.duracao;
  form.elenco.value = filme.elenco;
  form.resumo.value = filme.resumo;
  form.descricao.value = filme.descricao;
  form.imagem.value = filme.imagem;
  form.trailer.value = filme.trailer;

  modoEdicao = true;
  idEditando = id;
}

// Função para remover
async function removerFilme(id) {
  if (confirm("Tem certeza que deseja remover este filme?")) {
    await fetch(`http://localhost:3001/filmes/${id}`, {
      method: "DELETE",
    });
    mostrarToast("Filme removido com sucesso!", "danger");
    carregarFilmesNaTabela();
  }
}

// Função para mostrar toast
function mostrarToast(mensagem, tipo = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  toast.classList.remove("bg-success", "bg-warning", "bg-danger");
  toast.classList.add(`bg-${tipo}`);

  toastMsg.textContent = mensagem;

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
