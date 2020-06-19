const { exec, escape } = require('../db/mysql');
let xss = require('xss');
const { post } = require('../routes/blog');

//博客列表
function getList(keywords, autor) {
    let sql = `SELECT * FROM blogs WHERE 1=1 `;
    if (autor) {
        sql += `AND autor='${autor}'`;
    }
    if (keywords) {
        sql += `AND keywords='${keywords}'`;
    }
    return exec(sql);
}
//博客详情
function getDetiles(id) {
    let sql;
    if (id) {
        sql = `SELECT * FROM blogs WHERE id=${id}`;
    }
    return exec(sql);
}
//创建博客
function newBlog(postData = {}) {
    console.log('postData =>', postData);

    //防xss攻击
    let title = xss(postData.title);
    let content = xss(postData.content);
    //防sql注入
    title = escape(title);
    content = escape(content);

    const createtime = Date.now();
    let sql;
    if (title && content && createtime) {
        title = escape(title);
        content = escape(content);
        sql = `INSERT INTO blogs (title, content, createtime) values (${title},${content},'${createtime}')`;
    }
    return exec(sql).then(data => {
        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    }, err => {
        return false;
    })
}
//更新博客
function update(postData = {}) {
    let id = postData.id;
    if (!id) return 'failed';

    //防xss攻击   00 => 该属性值尚未传入（未更新)
    let title = postData.title ? xss(postData.title) : 00;
    let content = postData.content ? xss(postData.content) : 00;

    const createtime = Date.now();
    let sql;
    title = escape(title); //防sql注入
    content = escape(content); //防sql注入
    sql = `UPDATE blogs SET `;
    sql += title == 00 ? content == 00 ? `createtime='${createtime}' WHERE id='${id}'`
        : `title=${title}, createtime='${createtime}' WHERE id='${id}'`
        : `title=${title}, content=${content}, createtime='${createtime}' WHERE id='${id}'`

    console.log('更新sql =>', sql);

    return exec(sql).then(data => {
        console.log('更新博客的日志 =>', data);

        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    }, err => {
        console.log('更新博客的错误日志 =>', err);

        return false;
    })

}
//删除博客
function del(id) {
    let sql;
    
    if (id) {
        sql = `DELETE FROM blogs WHERE id='${id}'`;

        return exec(sql).then(data => {
            if (data.affectedRows > 0) {
                return true;
            }
            return false
        }, err => {
            return false;
        })
    }
    return 'failed';

}

module.exports = {
    getList,
    getDetiles,
    newBlog,
    update,
    del
}