const Sequelize = require("sequelize");
const connection = require("../database/database");

const Customer = connection.define('customers',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        defaultValue: "Sem e-mail"
    },
    cpf:{
        type: Sequelize.STRING,
        defaultValue: "CPF não cadastrado"
    },
    cnpj:{
        type: Sequelize.STRING,
        defaultValue: "CNPJ não cadastrado"
    },
    store:{
        type: Sequelize.STRING,
        defaultValue: "Nome da loja não cadastrado"
    },
    adress:{
        type: Sequelize.STRING,
        allowNull: false
    },
    zipcode:{
        type: Sequelize.STRING,
        allowNull:false
    },
    observation:{
        type: Sequelize.TEXT,
        defaultValue: "Sem observações"
    },
    customer_orders:{
        type: Sequelize.JSON,
        defaultValue: {}
    },
    customer_insertion:{
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    }

});

Customer.sync({force:false});

module.exports = Customer;
