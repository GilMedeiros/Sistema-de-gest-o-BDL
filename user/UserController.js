const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/adminauth");

//Rotas GET
router.get("/admin/users",adminAuth, (req,res) => {
    res.send("Usuários");
});

router.get("/admin/users/create",adminAuth, (req,res) => {
    res.render("user/create");
});

router.get("/admin/login",(req,res) => {
    if(req.session.user != undefined){
        res.redirect("/admin/console")
    }else{
        res.render("user/login")
    }
});

//Rotas POST
router.post("/users/create", (req,res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password,salt);

    User.create({
        name: name,
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/admin/users");
    }).catch((err) => {
        res.send(err)    
    });
});

router.post("/auth", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then((user => {
        if(user != undefined){
            var passvalidator = bcrypt.compareSync(password,user.password);

            if(passvalidator){
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
     
                res.redirect('/admin/console');
            }else{
                res.redirect("/admin/login")
            }
        }else{
            res.redirect("/admin/login");
        }
    }))

});

router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/");
})
module.exports = router;