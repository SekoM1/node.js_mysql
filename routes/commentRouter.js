const express = require('express');
const router = express.Router();
const con = require("../dbConnector")
const authenticateToken = require('../auth');




router.post('/', authenticateToken, (req, res) => {
    
    const { text } = req.body
    const user = req.user
    if(!text) res.status(404).send({msg: 'You did not send all your details'})
    let sql = `INSERT INTO comments (comment_author, comment_text, comment_post) VALUES ('${YEAR}', ${text}', '${user.user_id}')`;
        con.query(sql, (err, result) => {
          if (err) throw err;
          console.log({msg:"You successfully commented"});
          console.log(result);
          res.send(result)
          
        });
})

router.get('/', authenticateToken, (req,res) => {
  con.query("SELECT * FROM comments", (err, result, fields) => {
    if (err) throw err;
    console.log({ msg:"These are your comments"})
    res.send(result);
  });
})

router.get('/:id', authenticateToken, (req,res) => {
  const id = req.params.id;
  let sql = `SELECT * FROM comments WHERE comment_id = ${id}`;
    con.query(sql, (err, result) => {
    //   if (err) throw err;
     res.send(result)
      console.log({msg:"You have these comments"});
    });
  
})

router.put('/:id', authenticateToken, (req, res) => {
    let day = new Date()
  const id = req.params.id
  const { title, body, date, password, avatar, about } = req.body
  let sql = `UPDATE comments SET `
   if(title) sql += `comment_title = '${title}'`
   if(body) sql += `comment_body = '${body}'`
    if(title || body) sql += `comment_date = ${day}`
   sql += `WHERE comment_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result.affectedRows + " record(s) updated");
      console.log({msg: "You successfully updated your comment"})
    });
})

router.delete('/:id', authenticateToken, (req, res) => {
  const id = req.params.id
  let sql = `DELETE FROM comments WHERE comment_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Number of records deleted: " + result.affectedRows);
    });
})

module.exports = router;


/* */