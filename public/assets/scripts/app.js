// Substitui o array local por carregamento dinâmico via JSON Server
async function carregarFilmesDaAPI() {
  try {
    const resposta = await fetch("http://localhost:3001/filmes");
    const filmes = await resposta.json();

    const normalizar = (texto) =>
      texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const destaques = filmes.filter((f) =>
      f.categoria?.toLowerCase().includes("destaque")
    );
    const recomendados = filmes.filter((f) =>
      f.categoria?.toLowerCase().includes("recomendado")
    );
    const lancamentos = filmes.filter((f) =>
      f.categoria?.toLowerCase().includes("lancamento")
    );

    renderizarFilmes(recomendados, "filmes-recomendados");
    renderizarFilmes(lancamentos, "filmes-lancamentos");
    renderizarCarrosselDestaques(destaques);

    if (window.location.pathname.includes("detalhes.html")) {
      mostrarDetalhesDoFilme(filmes);
    }

    const el = document.getElementById("carouselDestaques");
    if (el) {
      bootstrap.Carousel.getOrCreateInstance(el, {
        interval: 5000,
        ride: true,
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar filmes da API:", erro);
  }
}

function renderizarFilmes(lista, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  lista.forEach((filme) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
    col.innerHTML = `
      <article class="filme bg-black p-2 rounded text-center">
        <a href="detalhes.html?id=${filme.id}">
          <img src="${filme.imagem}" alt="${
      filme.titulo
    }" class="img-fluid rounded">
        </a>
        <h3 class="text-danger mt-2">${filme.titulo}</h3>
<p class="text-light text-truncate" style="max-width: 100%; white-space: normal;">${
      filme.resumo || "Sinopse breve não disponível."
    }</p>
      </article>
    `;
    container.appendChild(col);
  });
}

function renderizarCarrosselDestaques(filmesDestaque) {
  const container = document.getElementById("destaques-carousel");
  if (!container) return;

  container.innerHTML = filmesDestaque
    .map((filme, index) => {
      return `
      <div class="carousel-item${index === 0 ? " active" : ""}">
        <a href="detalhes.html?id=${
          filme.id
        }" class="text-decoration-none text-white">
          <div class="row align-items-center bg-black rounded p-3">
            <div class="col-md-6">
              <img src="${filme.imagem}" class="d-block w-100 rounded" alt="${
        filme.titulo
      }">
            </div>
            <div class="col-md-6 text-start">
              <h3 class="text-danger">${filme.titulo}</h3>
              <p class="text-light">${
                filme.resumo || "Sinopse breve não disponível."
              }</p>
            </div>
          </div>
        </a>
      </div>
    `;
    })
    .join("");
}

function mostrarDetalhesDoFilme(filmes) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const filme = filmes.find((f) => String(f.id) === id);
  const container = document.getElementById("detalhes-filme");

  if (!filme || !container) {
    container.innerHTML = "<p class='text-danger'>Filme não encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <h2 class="text-danger fw-bold text-center mb-4">${filme.titulo}</h2>

    <div class="row g-4 align-items-start bg-custom-dark p-4 rounded shadow mb-5">
      <div class="col-md-4 text-center">
        <img src="${filme.imagem}" alt="${filme.titulo}" class="img-fluid ${
    ![1, 10, 11, 12].includes(filme.id) ? "poster-unificado" : ""
  }">
      </div>
      <div class="col-md-7 text-start text-custom-light">
        <p><strong>Data de Lançamento:</strong> ${filme.data}</p>
        <p><strong>Categoria:</strong> ${filme.categoria}</p>
        ${
          filme.diretor
            ? `<p><strong>Diretor:</strong> ${filme.diretor}</p>`
            : ""
        }
        ${
          filme.duracao
            ? `<p><strong>Duração:</strong> ${filme.duracao}</p>`
            : ""
        }
        ${filme.elenco ? `<p><strong>Elenco:</strong> ${filme.elenco}</p>` : ""}
        <div class="d-flex gap-3 mt-3">
          <button class="btn btn-custom-danger">Assista agora</button>
          <button class="btn btn-custom-outline">Alugue no Prime Video</button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-7">
        <div class="bg-custom-dark p-4 rounded shadow h-100 text-custom-light">
          <h2 class="text-danger">Sinopse</h2>
          <h4 class="text-danger mb-3">${filme.titulo}</h4>
          <p class="fs-5 texto-justificado bloco-descricao">${
            filme.descricao
          }</p>
        </div>
      </div>
      <div class="col-md-5">
        <div class="bg-custom-dark p-4 rounded shadow h-100 text-custom-light">
          <div class="mb-4">
            <h4 class="text-danger">Trailer</h4>
            <div class="ratio ratio-16x9">
              <iframe src="${filme.trailer}" title="Trailer de ${
    filme.titulo
  }" allowfullscreen></iframe>
            </div>
          </div>

          ${
            filme.galeria && filme.galeria.length > 0
              ? `
            <div class="mb-4">
              <h4 class="text-danger">Galeria de Imagens</h4>
              <div id="galeriaCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner" id="galeria-carousel">
                  ${filme.galeria
                    .map(
                      (foto, index) => `
  <div class="carousel-item ${index === 0 ? "active" : ""}">
    <img src="${foto.src}" class="d-block w-100 rounded" alt="${
                        foto.descricao
                      }">
    <div class="carousel-caption d-none d-md-block">
      <p class="small text-light bg-dark bg-opacity-50 px-2 rounded mb-1">${
        foto.descricao
      }</p>
    </div>
  </div>
`
                    )
                    .join("")}

                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#galeriaCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#galeriaCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Próximo</span>
                </button>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>

    <div class="text-center mt-5">
      <a href="index.html" class="btn btn-outline-danger">Voltar para o catálogo</a>
    </div>
  `;
}

// Início do carregamento
carregarFilmesDaAPI();
