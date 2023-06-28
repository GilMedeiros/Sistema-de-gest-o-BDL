const express = require("express");
const router = express.Router();
const Customer = require("./Customer");
const Orders = require("../orders/Order");
const adminAuth = require("../middleware/adminauth");

//------------------Rotas GET------------------//

/*Rota da tela para adicionar um novo cliente*/
router.get("/admin/clientes/novo", (req,res) => {
    res.render('customer/new_customer');
});

/*Rota da tela para ver a lista de clientes*/
router.get("/admin/clientes",adminAuth, (req,res) => {

    Customer.findAll(
        {
            include:{
                model: Orders,
                as: 'orders',
                order: [['createdAt', 'DESC']]}
            }
        ).then(customers => {
        res.render('customer/index',{
             customers
        });
    });
});

/*Rota para VER PERFIL do cliente*/
router.get("/admin/cliente/profile/:id",adminAuth, (req,res) => {
    
    var id = req.params.id;

    Customer.findByPk(id,{
        include:{
            model: Orders,
            as: 'orders',
            order: [['createdAt', 'DESC']]}
    }).then(customer => {
        if(customer != undefined){
            res.render("customer/profile",{customer:customer});
        } else{
            res.redirect("/admin/clientes");
        }
    }).catch(erro => {
        res.redirect("/admin/clientes");
    })
});

/*Rota para EDITAR PERFIL do cliente*/
router.get("/admin/cliente/editar/:id",adminAuth, (req,res) => {
    
    var id = req.params.id;

    Customer.findByPk(id).then(customer => {
        if(customer != undefined){
            res.render("customer/edit",{customer:customer});
        } else{
            res.redirect("/admin/clientes");
        }
    }).catch(erro => {
        res.redirect("/admin/clientes");
    })
});

//------------------Rotas POST------------------//

/*Rota para SALVAR o cliente no banco de dados*/
router.post("/customer/save", (req,res) => {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var cnpj = req.body.cnpj;
    var store = req.body.store;
    var zipcode = req.body.zipcode;
    var adress = req.body.adress;
    var observation = req.body.observation;

    Customer.create({
        name: name,
        phone: phone,
        email: email,
        cpf: cpf,
        cnpj: cnpj,
        store: store,
        zipcode: zipcode,
        adress: adress,
        observation: observation
    }).then(() =>{
        res.redirect("/")
    })
});

/*Rota para DELETAR o cliente do banco de dados*/
router.post("/customer/delete", (req,res) => {
    var id = req.body.id;
    Customer.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/clientes")
    })
});

/*Rota para EDITAR o cliente no banco de dados*/
router.post("/customer/edit", (req,res) => {
    var id = req.body.id;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var cnpj = req.body.cnpj;
    var store = req.body.store;
    var zipcode = req.body.zipcode;
    var adress = req.body.adress;
    var observation = req.body.observation;

    Customer.update(
        {
        name: name,
        phone: phone,
        email: email,
        cpf: cpf,
        cnpj: cnpj,
        store: store,
        zipcode: zipcode,
        adress: adress,
        observation: observation
        },{where: {id: id}}).then(() => {
        res.redirect("/admin/cliente/profile/"+id)
    })
});

module.exports = router;