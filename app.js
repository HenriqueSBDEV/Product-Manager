const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

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

app.get("/home", function(req, res){
  res.send("Hello world");
})

app.listen(port, ()=>{
  console.log(`Servidor rodando na porta = ${port}`);
})