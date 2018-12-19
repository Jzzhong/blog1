const express = require('express')
// 导入bodyParser
const bodyParser=require('body-parser')
const mysql=require('mysql')
//const fs=require('fs')
const moment =require('moment')
 const conn =mysql.createConnection({
     host:'localhost',
     user:'root',
     password:'root',
     database:'blog'
 })
 const app =express()
//  注册中间件：app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.urlencoded({extended:false}))
 // 静态资源托管
 app.use('/node_modules',express.static('./node_modules'))
 // 设置模板引擎
 app.set('view engine','ejs')
 //设置模板存放路径，如果不设置 默认就在views目录
 //app.set('views','./views)

  app.get('/',(req,res)=>{
    res.render('index',{})
  })
  app.get('/register',(req,res)=>{
    res.render('./users/register',{})
  })
  app.post('/register',(req,res)=>{
      //console.log(req.body)
    let userInfo =req.body
    // 1. 表单校验
    if(!userInfo.username||!userInfo.nickname|| !userInfo.password) return res.status(400).send({status:400, msg:'请输入正确的表单信息'})
    //查重 判断用户名是否已经存在 连接数据库查询
    const chachongsql='select count(*) as count from users where username =?'
    conn.query(chachongsql,userInfo.username,(err,result)=>{
      console.log(result)
      if(err) return res.status(500).send({status:500,msg:'查询失败！请重试!'})
      if(result[0].count!==0) return res.status(400).send({status:400,msg:'用户名重复!请重试!'})
      res.send({status:200,msg:'注册成功!'})
      userInfo.ctime=moment().format('YYYY-MM-DD HH:mm:ss')
      //执行注册的Sql语句  使用MySQL模块 注意 'insert into xxx set ?'
      const registerSql='insert into users set ?'
      conn.query(registerSql,userInfo,(err,result)=>{
        if(err) return res.status(500).send({status:500,msg:"注册失败，请重试！"})
        res.send({status:200,msg:'注册成功!'})
      })

    })
  })
  app.get('/login',(req,res)=>{
    res.render('./users/login',{})
  })

  app.listen(80,()=>{
      console.log('http://127.0.0.1')
  })

