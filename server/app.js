const express = require("express")
const app = express();
require("./db/conn.js")
const router = require('./routes/router.js')
const cors = require('cors')
const cookiParser = require('cookie-parser')

const port = 8009;

// app.get("/", (req, res)=>{
//     res.status(201).json("server created")
// })
app.use(express.json())
app.use(cookiParser())
app.use(cors())
app.use(router)

app.listen(port, ()=>{
    console.log(`server started at port no: ${port}`);
})