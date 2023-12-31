const Sequelize = require("sequelize");
const connection = require("../database/database");

const Product = connection.define('products',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    imageURL:{
        type: Sequelize.STRING,
        allowNull:true
    }

});

Product.sync({force:false});

module.exports = Product;