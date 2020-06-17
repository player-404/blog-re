var express = require('express');
let login = require('../controller/user');
let { ErrorModel, SuccessModel } = require('../model/resmodel');
var router = express.Router();

/* GET users listing. */
router.post('/login', function (req, res, next) {
  let username = req.username;
  let password = req.password;
  let result = login(username, password);  // session
  return result.then((data) => {
    if (data.username) {
      req.session.username = data.username;
      res.json(
        new SuccessModel('登录成功')
      )
      return
    }
    res.json(
      new ErrorModel('用户登录失败')
    )
  })

})
router.get('/login-test', (req, res, next) => {
  if (req.session.username) {
    res.json(
      new SuccessModel('用户已登录')

    )
    return;
  }
  res.json(
    new ErrorModel('用户尚未登录')
  )
})

module.exports = router;
