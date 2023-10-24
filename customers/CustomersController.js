const express = require("express");
const router = express.Router();
const Customer = require("./Customer");
const Orders = require("../orders/Order");
const adminAuth = require("../middleware/adminauth");
const bcrypt = require("bcryptjs");
const customerAuth = require("../middleware/customerauth");
const Product = require("../products/Product");

//------------------Rotas GET ADM------------------//

/*Rota da tela para adicionar um novo cliente*/
router.get("/admin/clientes/novo", (req, res) => {
    res.render('customer/new_customer');
});

/*Rota da tela para ver a lista de clientes*/
router.get("/admin/clientes", adminAuth, (req, res) => {
    Customer.findAll(
        {
            include: {
                model: Orders,
                as: 'orders',
                order: [['createdAt', 'DESC']]
            }
        }
    ).then(customers => {
        res.render('customer/index', {
            customers
        });
    });
});

/*Rota para VER PERFIL do cliente*/
router.get("/admin/cliente/profile/:id", adminAuth, (req, res) => {

    var id = req.params.id;

    Customer.findByPk(id, {
        include: {
            model: Orders,
            as: 'orders',
            order: [['createdAt', 'DESC']]
        }
    }).then(customer => {
        if (customer != undefined) {
            res.render("customer/profile", { customer: customer });
        } else {
            res.redirect("/admin/clientes");
        }
    }).catch(erro => {
        res.redirect("/admin/clientes");
    })
});

/*Rota para EDITAR PERFIL do cliente*/
router.get("/admin/cliente/editar/:id", adminAuth, (req, res) => {

    var id = req.params.id;

    Customer.findByPk(id).then(customer => {
        if (customer != undefined) {
            res.render("customer/edit", { customer: customer });
        } else {
            res.redirect("/admin/clientes");
        }
    }).catch(erro => {
        res.redirect("/admin/clientes");
    })
});



// ROTAS APENAS PARA OS CLIENTES



router.get("/comecar", (req, res) => {
    // Rota para o cliente redefinir a senha dele no primeiro acesso.
    res.render("client/welcome_customer");
});

router.get("/login", (req, res) => {
    if (req.session.customer) {
        res.redirect("/home");
    } else {
        res.render("client/login");
    }
});

router.get("/home", customerAuth, (req, res) => {
    var customerID = req.session.customer.id;

    Customer.findByPk(customerID, {
        include: {
            model: Orders,
            as: 'orders',
            order: [['createdAt', 'DESC']]
        }
    }).then((customer => {
        if (customer != undefined) {
            res.render("client/home", { customer: customer });
        } else {
            res.send("Cliente não encontrado")
        }
    }));

});

router.get("/novopedido", customerAuth, (req, res) => {

    var customerID = req.session.customer.id;

    Product.findAll().then(products => {
        Customer.findByPk(customerID).then((customer => {
            res.render("client/newOrder", {
                id: customerID,
                products: products,
                customer: customer
            });
        }));
    });
});

router.get("/historico", customerAuth, (req, res) => {
    var customerID = req.session.customer.id;

    Customer.findByPk(customerID, {
        include: {
            model: Orders,
            as: 'orders',
            order: [['createdAt', 'DESC']]
        }
    }).then((customer => {
        if (customer != undefined) {
            res.render("client/ordersHistory", { customer: customer });
        } else {
            res.send("Cliente não encontrado")
        }
    }));
});

router.get("/perfil", customerAuth, (req, res) => {
    var customerID = req.session.customer.id;

    Customer.findByPk(customerID).then((customer => {
        if (customer != undefined) {
            res.render("client/profile", { customer: customer });
        } else {
            res.redirect("/home")
        }
    }));
});

router.get("/editarperfil", customerAuth, (req, res) => {
    var customerID = req.session.customer.id;

    Customer.findByPk(customerID).then(customer => {
        if (customer != undefined) {
            res.render("client/editProfile", { customer: customer });
        } else {
            res.redirect("/home");
        }
    }).catch(erro => {
        res.redirect("/home");
    })

});

router.get("/alterarsenha", customerAuth, (req, res) => {
    var customerID = req.session.customer.id;

    Customer.findByPk(customerID).then(customer => {
        if (customer != undefined) {
            res.render("client/changepassword", { customer: customer });
        } else {
            res.redirect("/home");
        }
    }).catch(erro => {
        res.redirect("/home");
    })

});
//------------------Rotas POST------------------//

/*Rota para SALVAR o cliente no banco de dados*/
router.post("/customer/save", (req, res) => {
    var name = req.body.name;
    var full_name = req.body.full_name;
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
        full_name: full_name,
        phone: phone,
        email: email,
        cpf: cpf,
        cnpj: cnpj,
        store: store,
        zipcode: zipcode,
        adress: adress,
        observation: observation
    }).then(() => {
        res.redirect("/admin/clientes")
    })
});

/*Rota para DELETAR o cliente do banco de dados
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
*/

/*Rota para EDITAR o cliente no banco de dados*/
router.post("/customer/edit", (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var full_name = req.body.full_name;
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
            full_name: full_name,
            phone: phone,
            email: email,
            cpf: cpf,
            cnpj: cnpj,
            store: store,
            zipcode: zipcode,
            adress: adress,
            observation: observation
        }, { where: { id: id } }).then(() => {
            if (req.session.user) {
                res.redirect("/admin/cliente/profile/" + id)
            } else if (req.session.customer) {
                res.redirect("/home")
            }

        })
});


//ROTAS POST APENAS PARA CLIENTES

//Rota que faz o login do cliente no sistema
router.post("/customer_auth", (req, res) => {
    var email = req.body.email;
    var pass = req.body.password;

    Customer.findOne({ where: { email: email } }).then((customer => {
        if (customer != undefined) {
            var passValidator = bcrypt.compareSync(pass, customer.password);

            if (passValidator) {
                req.session.customer = {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email
                }

                res.redirect('/home');
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login")
        }
    }))
});

//Rota que verifica se o usuário tem cadastro ou não
router.post("/welcome_customer", (req, res) => {
    var email = req.body.email;
    var cpf = req.body.cpf;

    Customer.findOne({ where: { email, cpf } }).then((customer => {
        if (customer != undefined) {
            //Verificando a senha padrão dele
            if (customer.password == process.env.defauldnewcustomerpass) {
                res.render("client/recoverypass", { customer });
            } else {
                res.send("PARA REDEFINIR SUA SENHA ENTRE EM CONTATO COM O ADMINISTRADOR")
            }
        } else {
            res.send("Dados informados não conferem")
        }
    }));
});

//Rota que faz a redefinição de senha do usuário
router.post("/recovery", (req, res) => {
    var id = req.body.id;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    Customer.update({ password: hash }, { where: { id: id } }).then(() => { res.redirect("/home") });
});

router.get("/logout_client", (req, res) => {
    req.session.customer = undefined;
    res.redirect("/");
})

module.exports = router;