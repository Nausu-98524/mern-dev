import React, { useContext, useState } from "react";
import "./header.css";
import Avatar from "@mui/material/Avatar";
import { LoginContext } from "./ContextProvider/Context";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  // console.log(logindata.validUserOne.email);

  const history = useNavigate();

  const [anchorEI, setAnchoeEI] = useState(null);
  const open = Boolean(anchorEI);
  const handleClick = (event) => {
    setAnchoeEI(event.currentTarget);
  };
  const handleClose = () => {
    setAnchoeEI(null);
  };

  const logoutUser = async()=>{
    let token = localStorage.getItem("usersdatatoken");
        
    const res = await fetch("/logout",{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":token,
            Accept:"application/json"
        },
        credentials:"include"
    });

    const data = await res.json();
    console.log(data);
    
    if(data.status == 201){
      console.log("user logout");
      localStorage.removeItem("usersdatatoken");
      setLoginData(false)
      history("/")
    }else{
      console.log("error");
    }
  }

  const goError = ()=>{
    history("*")
  }
  
  const goDash = ()=>{
    history("/dash")
  }
  return (
    <div>
      <header>
        <nav>
          <h1>Home .LLC</h1>
          <div className="avtar">
            {logindata.validUserOne ? (
              <Avatar
                style={{
                  backgroundColor: "salmon",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
                onClick={handleClick}
              >
                {logindata.validUserOne.fname[0].toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                style={{ backgroundColor: "Red" }}
                onClick={handleClick}
              />
            )}
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEI}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {logindata.validUserOne ? (
              <div>
                <MenuItem onClick={()=>{
                  goDash()
                  handleClose()
                }}>Profile</MenuItem>
                <MenuItem onClick={()=>{
                  logoutUser()
                  handleClose()
                }}>Log Out</MenuItem>
              </div>
            ) : (
              <div>
                <MenuItem onClick={()=>{
                  goError()
                  handleClose()
                }}>Profile</MenuItem>
              </div>
            )}
          </Menu>
        </nav>
      </header>
    </div>
  );
};

export default Header;
