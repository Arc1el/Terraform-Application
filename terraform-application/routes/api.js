var express = require('express');
var router = express.Router();

var cognito = require('../aws_modules/cognito');

/* GET home page. */
router.post('/login', function(req, res, next) {
    const id = req.body.id;
    const pw = req.body.pw;

    new Promise((resolve, reject) => {
        cognito.signIn({email:id, passwd:pw}).then(function(token){
            console.log("login success");
            req.session.exists = id;
            req.session.save(() => {
                console.log("session saved");
                resolve();             
            });
            }).catch(function(e){
            console.log("login failed");
            console.log(e.message);
            reject(e);
        });
    }).then(function(data){
        console.log("redirecting");
        req.method = "GET";
        res.redirect('/dashboard');
    });
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
