const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const app = express();
const port = 3000;
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

//Adicionar css
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

//Habilitando o fileUpload de arquivos
app.use(fileUpload());

//Configuracao handle-bars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Configuração de conexão
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "airam478",
  database: "projeto"
});

//Teste de conexão
conexao.connect(function(erro){
  if(erro) throw erro;
  console.log("Conexão realizada com sucesso");
})

//Rota principal
app.get("/", function(req, res){
  let sql = 'SELECT * FROM produtos';
  conexao.query(sql, function(erro, retorno){
    res.render('formulario', {produtos:retorno});
  })
})

//Rota de cadastro
app.post('/cadastrar', function(req, res){
  let nome = req.body.nome;
  let valor = req.body.valor;
  let imagem = req.files.imagem.name;

  let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES('${nome}', ${valor}, '${imagem}')`;

  conexao.query(sql, function(erro, retorno){
    if(erro) throw erro;
    
    req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name);
    console.log(retorno);
  });


  //retornar para a rota principal
  res.redirect('/');
})

//Rota de remoção
app.get('/remover/:codigo&:imagem', function(req, res){
  let codigo = req.params.codigo;
  let img = req.params.imagem;
  let sql = `DELETE FROM produtos WHERE codigo = ${codigo}`;

  conexao.query(sql, function(erro, retorno){
    if(erro) throw erro;
    let caminhoimg = (__dirname + '/imagens/' + img)
    fs.unlink(caminhoimg, function(erro){
      if(erro){
        console.error('Erro ao remover da pasta');
      }
    });
  })
  res.redirect('/');
  res.end();
})

//Rota de alterar
app.get('/alterarform/:codigo', function(req,res){
  let codigo = req.params.codigo;
  let sql = `SELECT * FROM produtos WHERE codigo = ${codigo}`;
  conexao.query(sql, function(erro, retorno){
    if(erro) throw erro;
    res.render('formularioEditar', {produto:retorno[0]});
  })
})

app.post('/editar', function(req, res){
  let codigo = req.body.codigo;
  let nome = req.body.nome;
  let valor = req.body.valor;
  let imagem = req.body.novaImagem;

  try {
    let novaImagem = req.files.imagem.name;    
    res.write('A imagem sera alterada');
  } catch (error) {
    res.write('A imagem nao sera alterada');
  }
  res.end();
  //res.redirect('/');   
})

app.listen(port, ()=>{
  console.log(`Servidor rodando na porta = ${port}`);
})