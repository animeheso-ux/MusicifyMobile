import express from "express"

import http from "http"

import DatabaseRouter from "./database.js"
import TokenRouter from "./token.js" 
import MusicRouter from "./music.js"

const app = express()

const server = http.createServer(app)

const PORT = 3000


app.use(express.json())


app.use("/MusicFolder",express.static("MusicFolder"))



//Routes
app.use(DatabaseRouter)
app.use(TokenRouter)
app.use(MusicRouter)










server.listen(3000,() => console.log(`http://localhost:${PORT}`))