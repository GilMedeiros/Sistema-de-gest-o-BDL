const Sequelize = require("sequelize");

//Objeto de conexão com Banco de Dados
const connection = new Sequelize(process.env.MYSQL_BD,process.env.MYSQL_USER,process.env.MYSQL_PASS,{
    host:'localhost',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;