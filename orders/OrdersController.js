const express = require("express");
const router = express.Router();
const Product = require("../products/Product");
const Order = require("../orders/Order");
const Customer = require("../customers/Customer");
const adminAuth = require("../middleware/adminauth");

//------------------Rotas GET------------------//


/*Rota da tela para ver todos os pedidos*/
router.get("/admin/pedidos",adminAuth, (req,res) => {
    
    Order.findAll({
        include:{
            model: Customer,
            as: 'customer'}
    }).then(orders => {
        res.render("order/index", {
            orders:orders,
            
        });
    })
});

/*Rota da tela para adicionar um novo pedido*/
router.get("/admin/pedidos/novo/:id",adminAuth, (req,res) => {

    Product.findAll().then(products => {
        res.render("order/new_order",{
            id:req.params.id,
            products:products
        });
    });
    
});

//------------------Rotas POST------------------//

/*Rota para SALVAR o pedido no banco de dados*/
router.post("/order/save", (req,res) => {
    var observation = req.body.observation;
    var product_list = req.body.product_list;
    var idCustomer = req.body.idCustomer;
    
    Order.create({
        observation: observation,
        product_list: product_list,
        idCustomer: idCustomer,
    }).then(() => {
        res.redirect("/admin/pedidos")
    });
});


/*Rota para ALTERAR o status de pagamento do pedido no banco de dados*/
router.post('/admin/toggle-payment-status', (req, res) => {
    const orderId = req.body.orderId;
    // Lógica para atualizar o status de pagamento do pedido no banco de dados
    // Exemplo:
    Order.findByPk(orderId)
      .then(order => {
        if (order) {
          order.payed = !order.payed; // Inverte o status de pagamento
          return order.save();
        } else {
          throw new Error('Pedido não encontrado');
        }
      })
      .then(updatedOrder => {
        res.json({ success: true, payed: updatedOrder.payed });
      })
      .catch(error => {
        res.status(500).json({ success: false, error: error.message });
      });
  });
  /*Rota para ALTERAR o status de entrega do pedido no banco de dados*/
  router.post('/admin/toggle-delivery-status', (req, res) => {
    const orderId = req.body.orderId;
    // Lógica para atualizar o status de entrega do pedido no banco de dados
    // Exemplo:
    Order.findByPk(orderId)
      .then(order => {
        if (order) {
          order.delivered = !order.delivered; // Inverte o status de entrega
          return order.save();
        } else {
          throw new Error('Pedido não encontrado');
        }
      })
      .then(updatedOrder => {
        res.json({ success: true, delivered: updatedOrder.delivered });
      })
      .catch(error => {
        res.status(500).json({ success: false, error: error.message });
      });
  });
  

module.exports = router;