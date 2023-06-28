const express = require("express");
const router = express.Router();
const Product = require("./Product");
const adminAuth = require("../middleware/adminauth");

router.get("/admin/produtos/novo",adminAuth, (req,res) => {
    res.render("product/new_product")
});

/*Rota para SALVAR o produto no banco de dados*/
router.post("/product/save", (req,res) => {
    var name = req.body.name;
    var price = req.body.price;

    Product.create({
        name: name,
        price: price,
    }).then(() =>{
        res.redirect("/")
    })
});

module.exports = router;