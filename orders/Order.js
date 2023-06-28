const Sequelize = require("sequelize");
const connection = require("../database/database");
const Customer = require("../customers/Customer");
const Product = require("../products/Product");

const Order = connection.define('orders',{
    observation:{
        type: Sequelize.TEXT,
        defaultValue: 'Sem observações'
    },
    product_list:{
        type: Sequelize.JSON,
        defaultValue: {}
    },
    delivered:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    payed:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

Customer.hasMany(Order,{
    foreignKey:'idCustomer'
});

Order.belongsTo(Customer, {
    constraint: true,
    foreignKey: 'idCustomer'
});

Order.belongsToMany(Product,{
    through: 'OrderProduct',
    foreignKey: 'idOrder',
    otherKey: 'idProduct',
});

Product.belongsToMany(Order,{
    through: 'OrderProduct',
    foreignKey: 'idProduct',
    otherKey: 'idOrder',
});

Order.sync({force:false});

module.exports = Order;