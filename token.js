import express from "express"
import jsonwebtoken from "jsonwebtoken"





const TokenRouter = express.Router()

const VerifyToken = (req,res,next)=> {
    const header = req.headers["authorization"]
    const Token = header && header.split(" ")[1]

    if (!Token) {
        return res.status(401).json({status : "Token not found"})
    }

    jsonwebtoken.verify(Token,process.env.JWT_SECRET || "SECRET",(err,decoded)=> {
        if (err) {
            return res.status(403).json({status : "Token expired or invalid"})
        }
        req.Token = decoded
        next()
    })

}


TokenRouter.get("/GetToken",VerifyToken,(req,res)=> {
    res.json({status : "success",Token : req.Token})
})


export default TokenRouter