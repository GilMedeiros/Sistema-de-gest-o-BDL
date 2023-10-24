function customerAuth(req,res,next){
    if(req.session.customer != undefined){
        next();
    }else{
        res.redirect("/login")
    }
}

module.exports = customerAuth;