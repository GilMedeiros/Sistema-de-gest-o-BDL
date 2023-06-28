const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
    }

});

module.exports = User;
