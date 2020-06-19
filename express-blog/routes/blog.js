const express = require('express');
const loginCheck = require('../middleware/loginCheck');
const router = express.Router();
const { getList,
    getDetiles,
    newBlog,
    update,
    del } = require('../controller/blog');
const { ErrorModel, SuccessModel } = require('../model/resmodel');
const { route } = require('./users');

//获取博客列表
router.get('/list', (req, res, next) => {
    const result = getList(req.query.keyWords, req.query.autor);
    console.log('result =>', result);

   result.then(data => {
        res.json(new SuccessModel(data));
    }, err => {
        res.json(new ErrorModel(err));
    })
})

//获取博客详情
router.get('/detils', (req, res, next) => {
    const id = req.query.id;
    const result = getDetiles(id);

    result.then((data) => {
       res.json(
           new SuccessModel(data, '数据获取成功')
       ) 
    }, (err) => {
        res.json(
            new ErrorModel(err, '数据获取失败')
        )
    })      
})

//创建博客
router.post('/newBlog', loginCheck, (req, res, next) => {
    console.log('访问新建博客路由');
    console.log('传输的数据 =>', req.body);
    
    const result = newBlog(req.body);

    result.then((data) => {
        if (data) {
            res.json(new SuccessModel('博客创建成功'));
            return;
        }
        res.json(new ErrorModel('博客创建失败'));
    })
})

//更新博客
router.post('/update', loginCheck, (req, res, next) => {
    const result = update(req.body);

    result.then((data) => {
        if (data === 'failed') {
            res.json(new ErrorModel('博客更新失败'));
            return
        }

        if (data) {
            res.json(new SuccessModel('博客更新成功'));
            return
        }
        res.json(new ErrorModel('博客尚未更新'));
        
    })
})

//删除博客
router.get('/del', loginCheck, (req, res, next) => {
    const result = del(req.query.id);

    result.then((data) => {
        if (data === 'failed') {
            res.json(new ErrorModel('删除失败'));
            return;
        }

        if (data) {
            res.json(new SuccessModel('删除成功'));
            return;
        }

        res.json(new ErrorModel('删除失败'));

    })
})
module.exports = router;