const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const { engine } = require('express-handlebars');

//Configuracao handle-bars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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
  res.render('formulario');
})

app.listen(port, ()=>{
  console.log(`Servidor rodando na porta = ${port}`);
})