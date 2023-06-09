import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const PasswordReset = () => {
    const[email, setEmail] = useState("")
    const[message, setMessage] = useState("")

    const setVal = (e)=>{
        setEmail(e.target.value)
    }
    const sendLink = async(e)=>{
        e.preventDefault();


        const res = await fetch("/sendpasswordlink",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email})
        })

        const data = await res.json();
        
        if(data.status == 201){
            setEmail("");
            setMessage(true)
        }else{
            toast.error("Invalid User")
        }

    }
  return (
    <div>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter Your Email</h1>
          </div>
          {
            message ? <p style={{color:"green", fontWeight:"bold"}}>password reset link send successfully in Your Email</p>:""
          }
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={setVal} 
                value={email}
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>
            
            <div className="btn" onClick={sendLink}>
              Send
            </div>
            
          </form>
        </div>
      </section>
    </div>
  );
};

export default PasswordReset;
