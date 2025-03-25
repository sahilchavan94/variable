import React, { useState, useCallback, useRef } from "react";
import { funcContext } from "./context";
import toast from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";

export function FuncProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("variable-authtoken")
  );
  const [userData, setUserData] = useState({}); //state for storing the user data
  const socketRef = useRef();

  const inputValidator = () => {
    const inputArray = document.getElementsByTagName("input");
    Array.from(inputArray).forEach((input) => {
      if (!input.value) {
        input.style.border = "1.2px solid #f1aeb5";
      } else {
        input.style.border = "1.2px solid #a3cfbb";
        input.style.color = "white";
      }
    });
  };

  const showToast = (
    message,
    icon,
    backgroundColor,
    borderRadius,
    textcolor
  ) => {
    toast(message, {
      icon: icon,
      style: {
        borderRadius: borderRadius,
        background: backgroundColor,
        color: textcolor,
      },
    });
  };

  const getUserData = useCallback(async () => {
    if (localStorage.getItem("variable-authtoken")) {
      await axios
        .post(
          process.env.REACT_APP_GET_USER_DATA,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              authtoken: localStorage.getItem("variable-authtoken"),
            },
          }
        )
        .then((response) => {
          setUserData(response.data.user);
        })
        .catch((e) => {
          showToast(e.message);
          return;
        });
    }
  }, []);

  const initSocket = async () => {
    const options = {
      "force new connection": true,
      reconnectionAttempt: Infinity,
      timeout: 1000000,
      transports: ["websocket"],
    };
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, { options });
  };

  return (
    <funcContext.Provider
      value={{
        inputValidator,
        showToast,
        token,
        setToken,
        getUserData,
        userData,
        setUserData,
        initSocket,
        socketRef,
      }}
    >
      {children}
    </funcContext.Provider>
  );
}
