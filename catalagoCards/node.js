const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filmesPath = path.join(__dirname, 'filmes.json');
const filmesData = fs.readFileSync(filmesPath, 'utf-8');
const filmes = JSON.parse(filmesData);

function buscarFilmePorNome(nome) {
  return filmes.find(filme => filme.nome.toLowerCase() === nome.toLowerCase());
}

app.get('/buscar', (req, res) => {
  res.sendFile(path.join(__dirname, 'buscarFilme.html'));
});

function criarCard(filme) {
    return `
    <div class="col">
    <div class="card">
      <img src="${filme.url_foto}" class="card-img-top" style="height: 475px; width: 475px;">
      <div class="card-body">
        <h5 class="card-title">${filme.nome}</h5>
        <p class="card-text">${filme.desc}</p>
        <a href="${filme.url_info}" class="btn btn-dark">Sobre o Filme</a>
        <a href="${filme.url_video}" class="btn btn-dark">assista o Trailer</a>
      </div>
    </div>
  </div>
    `;
}

app.get('/', (req, res) => {
    const cardsHtml = filmes.map(filme => criarCard(filme)).join('');
    const pageHtmlPath = path.join(__dirname, 'catalagoFilmes.html');
    let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
    pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
    res.send(pageHtml);
});

app.get('/buscar-filme/:nome', (req, res) => {

  const nomeDoFilmeBuscado = req.query.nome;

  const filmeEncontrado = buscarFilmePorNome(nomeDoFilmeBuscado);
  
  if (filmeEncontrado) {
      const cardsHtml = criarCard(filmeEncontrado);
      const pageHtmlPath = path.join(__dirname, 'catalagoFilmes.html');
      let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
      pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
      res.send(pageHtml);

  } else{
      res.send('<h1>Filme não encontrado.</h1>');
  }
});

app.get('', (req, res) => {
  const cardsHtml = criarCard(filmeEncontrado);
  const pageHtmlPath = path.join(__dirname, 'dadosDoFilme.html');
  let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
  pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
  res.send(pageHtml);
});


app.listen(port, () => {
    console.log(`Servidor iniciando em http://localhost:${port}`);
});
