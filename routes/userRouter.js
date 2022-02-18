require('dotenv').config()
const express = require('express');
const router = express.Router();
const con = require('../dbConnector')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// CREATING A USER
router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
    const { name, email, contact } = req.body
    if(!name || !email || !hashedPassword || !contact) res.status(404).send({msg: 'You did not send all your details'})
    let sql = `INSERT INTO users (user_name, user_email, user_contact, user_password) VALUES ('${name}', '${email}', '${contact}', '${hashedPassword}')`;
        con.query(sql, (err, result) => {
          if (err) throw err;
          console.log({msg:"1 record inserted"});
          res.send(result)
        })
      } catch {

      }
    
})

// READING USERS
router.get('/', (req, res) => {
  
  con.query("SELECT * FROM users", (err, result, fields) => {
    res.send(result);
  }).on('error', () => res.status(401).send({error: "Couldnt load users"}));
})

// READING ONE USER
router.get('/:id',(req,res) => {
  const id = req.params.id;
  let sql = `SELECT * FROM users WHERE user_id = ${id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
     res.send(result)
    });
  
})

// UPDATE USER
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, email, contact, password, avatar, about } = req.body
  let sql = `UPDATE users SET `
   if(name) sql += `user_name = '${name}'`
   if(email) sql += `user_email = '${email}'` 
   if(contact) sql += `user_contact = '${contact}'`
   if(password) sql += `user_password = '${password}'` 
   if(avatar) sql += `user_avatar = '${avatar}'` 
   if(about) sql += `user_about = '${about}'`
   sql += `WHERE user_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      res.send(result)
    });
})

// DELETE USER
router.delete('/:id', (req, res) => {
  const id = req.params.id
  let sql = `DELETE FROM users WHERE user_id = '${id}'`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Number of records deleted: " + result.affectedRows);
    });
})

//  LOG IN USER
router.patch('/', (req, res) => {
  const { email, password } = req.body;
  let sql = `SELECT * FROM users where user_email = '${email}'`;
  

  // RUN THE QUERY 

    
    con.query(sql, async (err, result) => {
      const user = result[0]
      
      let compared = await bcrypt.compare(password, user.user_password)
      console.log(compared)
      if(compared){
        console.log(user)
        try {
          const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)
          console.log({msg: 'Token has been created'})
          res.json({ jwt: accessToken })
          console.log({msg: 'Successfully logged in!'})
        }catch {
          res.status(500).send()
      }
      
      
    }
  })

})

module.exports = router;