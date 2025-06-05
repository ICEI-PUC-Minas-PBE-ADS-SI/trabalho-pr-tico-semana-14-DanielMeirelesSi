document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3001/filmes")
    .then((res) => res.json())
    .then((filmes) => {
      // GRÁFICO DE PIZZA - Distribuição por Categoria
      const categorias = {};
      filmes.forEach((filme) => {
        const cat = filme.categoria;
        if (categorias[cat]) {
          categorias[cat]++;
        } else {
          categorias[cat] = 1;
        }
      });

      const cores = {
        destaque: "#FF0033",
        recomendado: "#0d6efd",
        lancamento: "limegreen"
      };

      const graficoPizza = new Chart(document.getElementById("graficoPizza"), {
        type: "pie",
        data: {
          labels: Object.keys(categorias),
          datasets: [{
            label: "Filmes por categoria",
            data: Object.values(categorias),
            borderWidth: 0,
            backgroundColor: Object.keys(categorias).map(cat => cores[cat] || "#999")
          }]
        },
        options: {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true
          }
          
        }
      });

      // GRÁFICO DE BARRAS - Melhores filmes
      const melhoresFilmes = {
        "O Espetacular Homem-Aranha 2": 10,
        "Até o Último Homem": 10,
        "Homem-Aranha 3": 9,
        "Gente Grande": 9.5,
        "Círculo de Fogo": 8.0,
        "A Origem": 8,
        "O Poderoso Chefão": 8,
        "Clube da Luta": 8.5,
        "Capitão América 4": 7.5,
        "Divertida Mente 2": 7,
        "The Batman": 9.7,
        "Deadpool & Wolverine": 9
      };

      const nomes = Object.keys(melhoresFilmes);
      const notas = Object.values(melhoresFilmes);

      const graficoBarras = new Chart(document.getElementById("graficoBarras"), {
  type: "bar",
  data: {
    labels: nomes,
    datasets: [{
      label: "Nota",
      data: notas,
      backgroundColor: "#FF0033",
      borderRadius: 5,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: {
            size: 12
          }
        }
      },
      y: {
  beginAtZero: true,
  min: 0,
  max: 10,
  ticks: {
    color: "#fff",
    font: { size: 12 },
    stepSize: 6, 
    callback: function(value) {
      return [0, 6, 10].includes(value) ? value : '';
    }
  },
  grid: {
    color: "rgba(255,255,255,0.1)"
  }
}

    }
  }
});

    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
});
