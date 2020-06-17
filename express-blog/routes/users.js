var express = require('express');
let { ErrorModel, SuccessModel } = require('../model/resmodel');
let { login } = require('../controller/user');
var router = express.Router();

/* GET users listing. */
router.post('/login', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  console.log('username =>', username);
  console.log('password =>', password);
  
  let result = login(username, password);  
  return result.then((data) => {  
    console.log(data);
    
    if (data.username) {
      req.session.username = data.username; // 中间件执行后 会自动创建req.session, 当过期时间到后便会自动销毁req.session
                                            // 它自己也有销毁的方法，当然你也可以给req.session存储值，把它当作存储数据的媒体即可，存在内存中
                                            // 断电即销毁，结合redis即可实现数据的持久化
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
