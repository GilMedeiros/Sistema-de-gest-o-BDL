require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const adminAuth = require("./middleware/adminauth");

const fs = require('fs');
const { exec } = require('child_process');

//Variável de ambiente
const PORT = process.env.PORT || 3000;

//Configuração das sessões
const sessionStore = new MySQLStore({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_BD,
    host: 'localhost',
    port: 3306,
    expiration: 86400000, // Tempo de expiração da sessão em milissegundos (24 horas)
    connection, // Utilize o objeto de conexão existente do Sequelize
  });
  
  app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  }));  

//Importação dos controladores
const customersController = require("./customers/CustomersController");
const productsController = require("./products/ProductsController");
const ordersController = require("./orders/OrdersController");
const usersController = require("./user/UserController");

//Importação de modelos de Banco de Dados
const Customer = require("./customers/Customer");
const Order = require("./orders/Order");
const Product = require("./products/Product");
const User = require("./user/User");

//Configuração View Engine EJS
app.set('view engine','ejs');

//Configuração pasta públic (arquivos staticos)
app.use(express.static('public'));

//Configuração Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Configurando Router no Index
app.use("/",customersController);
app.use("/",productsController);
app.use("/",ordersController);
app.use("/",usersController);

//Rotas

app.get("/",(req,res) => {
    res.render("index")
});

app.get("/admin/console",adminAuth, async (req,res) => {
    try{
       const orders = await Order.findAll({
                include:{
                    model: Customer,
                    as: 'customer',
                    }
                });

        const aggregatedQuantities = {};

        orders.forEach((order) => {
            if(!order.delivered){
                const products = JSON.parse(order.product_list);
                products.forEach((producto) => {
                    const {id,quantity,product} = producto;
                    if(aggregatedQuantities[id]){
                        aggregatedQuantities[id].quantity += quantity;
                    } else {
                        aggregatedQuantities[id] = {quantity,productName: product};
                    }
                });
            }           
    });
    res.render('console',{
        orders,aggregatedQuantities
    });
} catch (error){
    console.log(error);
}
});

//Rota para fazer backup do banco de dados
app.get('/backup',adminAuth, async (req, res) => {
    try {
      // Geração do nome do arquivo de backup
      const date = new Date().toISOString().replace(/:/g, '-');
      const fileName = `backup-${date}.sql`;
  
      // Verificação do diretório de backup
      const backupDir = './backups';
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
  
      // Caminho completo do arquivo de backup
      const filePath = `${backupDir}/${fileName}`;
  
      // Consulta SQL para gerar o dump completo do banco de dados
      const dumpSQL = `mysqldump -u root -p${process.env.MYSQL_PASS} ${process.env.MYSQL_BD} > "${filePath}"`;
  
      // Execução da consulta SQL para criar o backup
      exec(dumpSQL, async (error) => {
        if (error) {
          console.error('Erro ao gerar o backup:', error);
          res.status(500).send('Erro ao gerar o backup do banco de dados');
          return;
        }
  
        // Envio do arquivo de backup como resposta
        res.download(filePath, (err) => {
          if (err) {
            console.error('Erro ao enviar o arquivo:', err);
          }
  
          // Remoção do arquivo de backup após o download
          fs.unlinkSync(filePath);
        });
      });
    } catch (err) {
      console.error('Erro ao gerar o backup:', err);
      res.status(500).send('Erro ao gerar o backup do banco de dados');
    }
  });

  // Middleware para tratamento do erro 404
app.use(function(req, res, next) {
  res.status(404).send('Página não encontrada, entre em contato com o ADM');
});

//Conxeão
connection.authenticate().then(() => {console.log('Conexão com banco de dados concluída')}).catch((error)=>{console.log(error)});
app.listen(PORT, () => {console.log("Servidor iniciado")});