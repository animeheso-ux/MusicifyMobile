import express from "express"
import mysql from "mysql2"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"

import "dotenv/config"


export const database = mysql.createConnection({
host: "localhost",
user: 'root',
password: process.env.DB_PASSWORD,
database: 'music_app'
})


database.connect((err)=> {
    if (err) {
        throw err
    }

    console.log("mysql connected")
})


const DatabaseRouter = express.Router()

DatabaseRouter.post("/login",(req,res)=> {
    const {username, password} = req.body


       database.query("SELECT * FROM users WHERE username = ? OR email = ? ",[username,username],(err,results)=> {
        if (err) {
            throw err
        }

        if (results.length == 0) {
            res.json({message : "account doesn't exist!"})
            return
        }

        const user = results[0]
        const IsValid = bcrypt.compareSync(password,user.password)


        if (IsValid) {
            const payload = {
                name : username,
                id : user.id,
                email : user.email,
            }
            
            const token = jsonwebtoken.sign(payload,process.env.JWT_SECRET || "SECRET",{expiresIn : "1hr"})


            res.json({message : "success",Token : token})
        }else {
            res.json({message : "incorrect password"})
        }

    })
})


DatabaseRouter.post("/CreateAccount",(req,res)=> {
        const {username, password,email} = req.body

    database.query("SELECT * FROM users WHERE username = ? OR email = ? ",[username,email],(err,results)=> {
        if (err) {
            throw err
        }

        if (results.length > 0) {
            res.json({message : "Username or email has been taken!"})
            return
        }

        const hashed = bcrypt.hashSync(password,10)


        database.query("INSERT INTO users (username,email,password) VALUES(?,?,?)",[username,email,hashed],(err,results)=> {
            if (err) {
                throw err
            }

            res.json({message : "success"})
        })

    })
})




export default DatabaseRouter