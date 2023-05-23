var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.exists) {
    console.log("session founded");
    res.setHeader("Content-Type", "text/html");
    res.status(200).redirect("/dashboard");
  }
  else {
    console.log("session not found");
    res.setHeader("Content-Type", "text/html");
    res.status(200).render('login.html');
  }
});

router.get('/dashboard', function(req, res, next) {
  if (req.session.exists) {
    console.log("session founded");
    res.setHeader("Content-Type", "text/html");
    res.status(200).render('dashboard.html');
  }
  else {
    console.log("session not found");
    res.setHeader("Content-Type", "text/html");
    res.status(200).render('login.html');
  }
});

module.exports = router;
