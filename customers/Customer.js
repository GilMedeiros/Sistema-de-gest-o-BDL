const Sequelize = require("sequelize");
const connection = require("../database/database");

const Customer = connection.define('customers',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    full_name:{
        type:Sequelize.STRING,
        defaultValue:'Nome não completo',
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
    password:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "cadastrarnovasenha"
    }

});

Customer.sync({force:false});

module.exports = Customer;
