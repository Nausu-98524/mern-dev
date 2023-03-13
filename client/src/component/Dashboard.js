import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import { Box, CircularProgress } from "@mui/material";
import FeedLeft from "./Feed/FeedLeft";
import FeedRight from "./Feed/FeedRight";

const Dashboard = () => {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);
  // console.log(logindata.validUserOne.email);
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
      history("*")
    } else {
      setLoginData(data);
      history("/dash");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);
  return (
    <div>
      <FeedLeft />
      <FeedRight />
    </div>
    // <div>
    //   {data ? (
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}
    //     >
    //       <h1>User Email:- {logindata ? logindata.validUserOne.email : ""}</h1>
    //     </div>
    //   ) : (
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100vh",
    //       }}
    //     >
    //       Loading... &nbsp;
    //       <CircularProgress />
    //     </Box>
    //   )}
    // </div>
  );
};

export default Dashboard;
