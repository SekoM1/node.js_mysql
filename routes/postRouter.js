const express = require('express');
const router = express.Router();
const con = require("../dbConnector")
const authenticateToken = require('../auth')




router.post('/', authenticateToken, (req, res) => {
    let d = new Date()
    const { title, body } = req.body
    const user = req.user
    console.log(user)
    if(!title || !body) res.status(404).send({msg: 'You did not send all your details'})
    let sql = `INSERT INTO posts (post_title, post_body, post_date, post_author) VALUES ('${title}', '${body}', '${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}', ${user.user_id})`;
        con.query(sql, (err, result) => {
          if (err) throw err;
          console.log({msg:"You successfully posted"});
          console.log(result);
          res.send(result)
          
        });
})

router.get('/', authenticateToken, (req,res) => {
 // const user = req.user
  con.query("SELECT * FROM posts", (err, result, fields) => {
    if (err) throw err;
    console.log({ msg:"These are your posts"})
    res.send(result)
    // res.send(result.filter(post => post.author_id === user.user_id));
  });
})

router.get('/:id', authenticateToken,(req,res) => {
  const id = req.params.id;
  let sql = `SELECT * FROM posts WHERE post_id = ${id}`;
    con.query(sql, (err, result) => {
    //   if (err) throw err;
     res.send(result)
      console.log({msg:"You have these posts"});
    });
  
})

router.put('/:id', authenticateToken, (req, res) => {
    let day = new Date()
  const id = req.params.id
  const { title, body } = req.body
  let sql = `UPDATE posts SET `
   if(title) sql += `post_title = '${title}'`
   if(body) sql += `post_body = '${body}'`
    if(title || body) sql += `post_date = '${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}'`
   sql += `WHERE post_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result.affectedRows + " record(s) updated");
      console.log({msg: "You successfully updated your post"})
    });
})

router.delete('/:id', authenticateToken, (req, res) => {
  const id = req.params.id
  let sql = `DELETE FROM posts WHERE post_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Number of records deleted: " + result.affectedRows);
    });
})


module.exports = router;