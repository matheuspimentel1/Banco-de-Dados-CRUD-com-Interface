// Importa os módulos necessários para o funcionamento do servidor
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Cria uma instância do servidor Express
const app = express();

// Middleware para analisar o corpo das requisições em formato JSON
app.use(bodyParser.json());
// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost', // Endereço do servidor do banco de dados
  user: 'root', // Nome do usuário do banco de dados
  password: '', // Senha do usuário do banco de dados (alterar conforme a configuração)
  database: 'crud_example', // Nome do banco de dados a ser utilizado
});

// Conecta ao banco de dados e exibe uma mensagem de sucesso ou erro
db.connect((err) => {
  if (err) throw err; // Se ocorrer um erro, lança uma exceção
  console.log('Conectado ao banco de dados!'); // Mensagem de sucesso
});

// Rota para listar todos os usuários
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users'; // Comando SQL para selecionar todos os usuários
  db.query(sql, (err, result) => {
    if (err) throw err; // Se ocorrer um erro, lança uma exceção
    res.json(result); // Retorna os resultados da consulta em formato JSON
  });
});

// Rota para adicionar um novo usuário
app.post('/users', (req, res) => {
  const sql = 'INSERT INTO users SET ?'; // Comando SQL para inserir um novo usuário
  const newUser = req.body; // Dados do novo usuário recebidos no corpo da requisição
  db.query(sql, newUser, (err, result) => {
    if (err) throw err; // Se ocorrer um erro, lança uma exceção
    // Retorna a resposta com o ID do novo usuário e os dados
    res.json({ id: result.insertId, ...newUser });
  });
});

// Rota para atualizar as informações de um usuário existente
app.put('/users/:id', (req, res) => {
  const { id } = req.params; // Obtém o ID do usuário da URL
  const { name, email } = req.body; // Obtém o nome e o email do corpo da requisição
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?'; // Comando SQL para atualizar o usuário

  db.query(sql, [name, email, id], (err, result) => {
    if (err) throw err; // Se ocorrer um erro, lança uma exceção
    res.json({ message: 'Usuário atualizado com sucesso!' }); // Retorna uma mensagem de sucesso
  });
});

// Rota para deletar um usuário
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Obtém o ID do usuário da URL
  const sql = 'DELETE FROM users WHERE id = ?'; // Comando SQL para deletar o usuário

  db.query(sql, [id], (err, result) => {
    if (err) throw err; // Se ocorrer um erro, lança uma exceção
    res.json({ message: 'Usuário deletado com sucesso!' }); // Retorna uma mensagem de sucesso
  });
});
// Obtém a porta do ambiente ou usa 3000 como padrão
const PORT = 4444;

// Inicia o servidor na porta especificada e exibe uma mensagem de que está em execução
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`); // Mensagem de confirmação
});