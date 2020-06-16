var express = require('express');
let login = require('../controller/user');
const user = require('../controller/user');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  let username = req.username;
  let password = req.password;
  let result = login(username, password);
  return result.then((data) => {
    if (data.username) {
      req.session.username = data.username;
    }
  })

});

module.exports = router;
