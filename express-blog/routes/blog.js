const express = require('express');
const loginCheck = require('../middleware/loginCheck');
const router = express.Router();
const { getList,
    getDetiles,
    newBlog,
    update,
    del } = require('../controller/blog');
const { ErrorModel, SuccessModel } = require('../model/resmodel');

router.get('/list', loginCheck, (req, res) => {
    const result = getList(req.query.keyWords, req.query.autor);
    console.log('result =>', result);

   result.then(data => {
        res.json(new SuccessModel(data));
    }, err => {
        res.json(new ErrorModel(err));
    })
})


module.exports = router;