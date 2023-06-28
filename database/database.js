const Sequelize = require("sequelize");

//Objeto de conexão com Banco de Dados
const connection = new Sequelize('brownie_bd','root','3154',{
    host:'localhost',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;