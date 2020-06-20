var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); */
let blogRouter = require('./routes/blog');
let userRouter = require('./routes/users');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//运行环境
const ENV = process.env.NODE_ENV;
const logFile = path.join(__dirname, 'log', 'access.log');
// 使用流的方式写入文件
const writeStream = fs.createWriteStream(logFile, { flags: 'a' });
//开发环境
if (ENV != 'production') {
  app.use(logger('dev'),{ stream: process.stdout }); //默认配置
// 生产环境
} else {
  app.use(logger('combined', {
    stream: writeStream
  }))
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/* app.use(express.static(path.join(__dirname, 'public')));
 */

let redisClient = require('./conf/redis');
const { stream } = require('./conf/redis');
let sessionStore = new RedisStore({
  client: redisClient
})
// session中间执行后 会赋值给req.session
app.use(session({
  secret: 'demo_key',
  cookie: {
    path: '/', // 默认配置
    httpOnly: true, //默认配置
    maxAge: 24 * 60 * 60 * 1000 //过期时间
  },
  store: sessionStore  // 将session存储在redis中
}))

//博客路由
app.use('/api/blog', blogRouter);

//登录路由
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
