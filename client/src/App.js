import Header from "./component/Header";
import Login from "./component/Login";
import Register from "./component/Register";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import Error from "./component/Error";
import { Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./component/ContextProvider/Context";
import PasswordReset from "./component/PasswordReset";
import ForgotPassword from "./component/ForgotPassword";

function App() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);
  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status === 401 || !data) {
      console.log("user not valid");
    } else {
      setLoginData(data);
      history("/dash");
    }
  };
  useEffect(() => {
    setTimeout(()=>{
      DashboardValid();
      setData(true)
    },2000)
  }, []);
  return (
    <div>
      {data ? (
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
