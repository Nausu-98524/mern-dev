const express = require("express")
const router = new express.Router();
const userdb = require('../models/userSchema.js')
const bcrypt = require('bcryptjs')
const authenticate = require("../middleware/authenticate.js")
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")


const keysecret = "naushadalamnaushadalamnaushadalamnaushadalam";

// email Config
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"naushadmech18@gmail.com",
        pass:"iobtpnvghevziqad"
    }
})


// for user registration
router.post("/register", async(req, res)=>{
    const {fname, email,password, cpassword} = req.body;

    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"fill all the details"})
    }

    try{
        const preuser = await userdb.findOne({email:email})

        if(preuser){
            res.status(422).json({error:"This Email is Already Exist"})
        }else if(password !== cpassword){
            res.status(422).json(({error:"Password and Confirm Password not Match"}))
        }else{
            const finalUser = new userdb({
                fname, email, password, cpassword
            });
            // password hashing
            const storeData = await finalUser.save();
            // console.log(storeData);
            res.status(201).json({status:201, storeData});
        }

    }catch(error){
        res.status(422).json(error)
        console.log("catch block error");
    }
})

//User Login
router.post("/login", async(req, res)=>{
    // console.log(req.body);
    const {email,password} = req.body;

    if(!email || !password){
        res.status(422).json({error:"fill all the details"})
    }

    try {
        const userValid = await userdb.findOne({email:email})

        if(userValid){
            const isMatch = await bcrypt.compare(password,userValid.password)

            if(!isMatch){
                res.status(422).json({error:"Invalid Details"})
            }else{
                // Set Token Genrate
                const token = await userValid.generateAuthtoken();
                
                // Cookie Genrate
                res.cookie("usercookie", token,{
                    expires: new Date(Date.now()+9000000),
                    httpOnly:true
                })

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201, result})

            }
        }
    } catch (error) {
        res.status(401).json(error);
        console.log("catch block");
    }
})

// User Valid 
router.get("/validuser",authenticate, async(req, res)=>{
    try{
        const validUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201, validUserOne});
    }catch(error){
        res.status(401).json({status:401, error});
    }
})

// User Logout
router.get("/logout",authenticate, async(req, res)=>{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curElem)=>{
            return curElem.token !== req.token
        })

        res.clearCookie("usercookie", {path: "/"})

        req.rootUser.save();

        res.status(201).json({status:201})
    } catch (error) {
        res.status(201).json({status:401,error})
    }
})

// Send Email Link For Reset Password
router.post("/sendpasswordlink", async(req, res)=>{
    console.log(req.body);

    const{email} = req.body;

    if(!email){
        res.status(401).json({status:401,message:"Enter Your Email"})
    }
    
    try {
        const userfind = await userdb.findOne({email:email});

        // Token Genrate for Reset Password
        const token = jwt.sign({_id:userfind._id},keysecret,{
            expiresIn:"120s"
        })
        
        const setusertoken = await userdb.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true})

        if(setusertoken){
            const mailOptions = {
                from:"naushadbhai7080@gmail.com",
                to:email,
                subject:"Sending Email For Password Reset",
                text:`This link valid for 2 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }
            transporter.sendMail(mailOptions,(error, info)=>{
                if(error){
                    console.log("error", error);
                    res.status(401).json({status:401, message:"email not send"})
                }else{
                    console.log("Email sent",info.response);
                    res.status(201).json({status:201, message:"Email sent Successfully"})
                }
            })
        }
    } catch (error) {
        res.status(401).json({status:401, message:"Invalid User"})
    }
})

// Verify USer for forgot password Time
router.get("/forgotpassword/:id/:token", async(req, res)=>{
    const{id, token} = req.params;
    
    try {
        const validUser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token, keysecret);
        console.log(verifyToken);

        if(validUser && verifyToken._id){
            res.status(201).json({status:201, validUser})
        }else{
            res.status(401).json({status:401, message:"user not exist"})
        }

    } catch (error) {
        res.status(401).json({status:401, error})
    }
})

// Change Password
router.post("/:id/:token", async(req, res)=>{
    const{id, token} = req.params;

    const {password} = req.body;

    try {
        const validUser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token, keysecret);

        if(validUser && verifyToken._id){
            const newPassword = await bcrypt.hash(password,12)

            const setNewUserPass = await userdb.findByIdAndUpdate({_id:id},{password:newPassword});
            setNewUserPass.save();
            res.status(201).json({status:201, setNewUserPass})
            
        }else{
            res.status(401).json({status:401, message:"user not exist"})
        }
    } catch (error) {
        res.status(401).json({status:401, error})
    }
})


module.exports = router;
