import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './mix.css'

const Register = () => {
    const[passShow, setPassShow] = useState(false)
    const[cpassShow, setCPassShow] = useState(false)
    const[inpval, setInpval] = useState({
        fname:"",
        email:"",
        password:"",
        cpassword:""
    })

    // console.log(inpval);

    const setVal = (e)=>{
        const {name, value} = e.target;
        setInpval(()=>{
            return{
                ...inpval,
                [name]:value
            }
        })
    }
    const addUserData =async (e)=>{
        e.preventDefault();

        const {fname, email, password, cpassword} = inpval;

        if(fname === ""){
            alert("Please Enter Your Name")
        }else if(email === ""){
            alert("Please Enter Your Email")
        }else if(!email.includes("@")){
            alert("Enter Valid Email")
        }else if(password === ""){
            alert("Please Enter Your Password")
        }else if(password.length < 6){
            alert("password must be 6 char")
        }else if(cpassword === ""){
            alert("Please Enter Your Confirm Password")
        }else if(cpassword.length < 6){
            alert("password must be 6 char")
        }else if(password !== cpassword){
            alert("Password and confirm password not match")
        }else{
            // console.log("Registation success");

            const data = await fetch("/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    fname, email, password, cpassword
                })
            })

            const res = await data.json();
            // console.log(res.status);
            if(res.status === 201){
                alert("User Registration Success..")
                setInpval({...inpval, fname:"", email:"", password:"", cpassword:"" })
            }
        }
    }
  return (
    <div>
    <section>
    <div className="form_data">
        <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{textAlign:"center"}}>We are glad that you be using Project cloud to manage <br />
              your tasks! We hope that you will get like it.  </p>
        </div>
        <form>
            <div className="form_input">
                <label htmlFor="fname">Name</label>
                <input type="text" value={inpval.fname} name='fname' onChange={setVal} id='fname' placeholder='Enter Your Name' />
            </div>
            <div className="form_input">
                <label htmlFor="email">Email</label>
                <input type="email" value={inpval.email} name='email' id='email' onChange={setVal} placeholder='Enter Your Email Address' />
            </div>
            <div className="form_input">
                <label htmlFor="password">Password</label>
                <div className="two">
                    <input type={!passShow ? "password" : "text"} name='password' value={inpval.password} onChange={setVal} id='password' placeholder='Enter Your Password' />
                    <div className="showpass" onClick={()=>setPassShow(!passShow)}>
                        {!passShow ? "Show" : "Hide"}
                    </div>
                </div>
            </div>
            <div className="form_input">
                <label htmlFor="password">Confirm Password</label>
                <div className="two">
                    <input type={!cpassShow ? "password" : "text"} name='cpassword' value={inpval.cpassword} onChange={setVal} id='cpassword' placeholder='Confirm Password' />
                    <div className="showpass" onClick={()=>setCPassShow(!cpassShow)}>
                        {!cpassShow ? "Show" : "Hide"}
                    </div>
                </div>
            </div>
            <div className="btn" onClick={addUserData} >Sign Up</div>
            <p>Already have an account? <NavLink to='/'>Log In</NavLink> </p>
        </form>
    </div>
  </section>
    </div>
  )
}

export default Register
