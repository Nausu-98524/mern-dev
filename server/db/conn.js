const mongoose = require('mongoose')

const DB = "mongodb+srv://authuser:authuser123@cluster0.nolotbk.mongodb.net/Authusers?retryWrites=true&w=majority"


mongoose.connect(DB)
.then(()=>{
    console.log("Data base Connected");
}).catch((error)=>{
    console.log(error);
})

