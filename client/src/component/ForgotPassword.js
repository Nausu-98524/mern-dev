import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const ForgotPassword = () => {

    const {id, token} = useParams();
    const history = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const userValid = async()=>{
        const res = await fetch(`/forgotpassword/${id}/${token}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })

        const data = await res.json();
        if(data.status == 201){
            console.log("user valid");
        }else{
            history("*")
        }
    }
    const setVal = (e)=>{
        setPassword(e.target.value);
    }

    const sendPassword = async(e)=>{
        e.preventDefault();

        const res = await fetch(`/${id}/${token}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({password})
        })

        const data = await res.json();

        if(data.status == 201){
            setPassword("")
            setMessage(true)
        }else{
            toast.error("! Token Expired generate new Link");
        }

    }

    useEffect(()=>{
        userValid()
    },[])


  return (
    <div>
    <section>
    <div className="form_data">
      <div className="form_heading">
        <h1>Enter Your New Password</h1>
      </div>
      
      <form>
      {
        message ? <p style={{color:"green", fontWeight:"bold"}}>Password Successfully Update</p>:""
      }
        <div className="form_input">
          <label htmlFor="email">New Password</label>
          <input
            type="password"
            name="password"
            onChange={setVal} 
            value={password}
            id="password"
            placeholder="Enter Your New Password"
          />
        </div>
        
        <div className="btn" onClick={sendPassword}>
          Send
        </div>
        
      </form>
      <ToastContainer />
    </div>
  </section>
    </div>
  )
}

export default ForgotPassword
