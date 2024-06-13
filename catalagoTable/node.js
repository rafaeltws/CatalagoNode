const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3000;

const filmesPath = path.join(__dirname, 'filmes.json');
const filmesData = fs.readFileSync(filmesPath, 'utf-8');
const filmes = JSON.parse(filmesData);


//Função para truncar a descrição
function truncarDescrição(descricao, comprimentoMaximo) {
    if (descricao.length > comprimentoMaximo) {
        return descricao.slice(0, comprimentoMaximo) + '...';
    }
    return descricao;
}

app.get('/', (req, res) => {
    let carsTable = '';

    filmes.forEach(filme => {

        const descricaoTruncada = truncarDescrição(filme.desc, 40);

        carsTable += `
        <tr class="table-active-warning">
            <td><a href="${filme.url_info}">${filme.nome}</a></td>
            <td>${descricaoTruncada}</td>
            <td>${filme.genero}</td>
            <td><img src="${filme.url_foto}" alt="${filme.nome}" style="max-width: 100px"></td>
        </tr>
        `; 
    });

    const htmlContent = fs.readFileSync('tabelaFilme.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{carsTable}}', carsTable);

    res.send(finalHtml);
});

app.get('/buscarPorGenero', (req, res) => {
    const genero = req.query.genero;
    const filmesFiltrados = filmes.filter(filme => filme.genero.toLowerCase() === genero.toLowerCase());

    let carsTable = '';

    filmesFiltrados.forEach(filme => {
        const descricaoTruncada = truncarDescrição(filme.desc, 100); // Limitando a descrição a 100 caracteres

        carsTable += `
        <tr class="table-active-warning">
            <td><a href="${filme.url_info}">${filme.nome}</a></td>
            <td>${descricaoTruncada}</td>
            <td>${filme.genero}</td>
            <td><img src="${filme.url_foto}" alt="${filme.nome}" style="max-width: 100px"></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('tabelaFilme.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{carsTable}}', carsTable);

    res.send(finalHtml);
});

app.listen(port, () => {
    console.log(`Servidor iniciando em http://localhost:${port}`);
})