import React, { useState, useRef, useEffect, useContext } from "react";
import login from "../../assets/icons/login.png";
import arrow from "../../assets/icons/arrow-white.png";
import Button from "../../helpers/Button";
import { Link, useNavigate } from "react-router-dom";
import { funcContext } from "../../contexts/context";
import { motion, useAnimation, useInView } from "framer-motion";
import axios from "axios";
import Loader from "../../helpers/Loader";

const Login = () => {
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  // react router use navigate
  const { inputValidator, showToast } = useContext(funcContext);
  const navigate = useNavigate("/");

  //states for managing login form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  //method/function to create a new user account
  const handleLogin = async () => {
    //checkig whether all the requird fields are filled
    if (!email || !password) {
      showToast("Missing fields", "❌", "#262625", 12, "white");
      return;
    }

    //check password length
    if (password.length < 6) {
      showToast("Password too short", "❌", "#262625", 12, "white");
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post(process.env.REACT_APP_LOGIN_ACCOUNT, {
        email: email,
        password: password,
      });
      if (response.data.success) {
        showToast("Logged into account", "✅", "#262625", 12, "white");
        localStorage.setItem("variable-authtoken", response.data.authtoken);
        navigate("/", {
          replace: true,
          viewTransition: true,
        }); //navigate to home page on successfull account creation
        window.location.reload();
      }
      setProcessing(false);
    } catch (error) {
      showToast("Failed to login", "❌", "#262625", 12, "white");
      setProcessing(false);
    }
  };

  return (
    <div className={`pt-[6%] h-[100vh] overflow-scroll bg-black`}>
      {processing && (
        <div className="mx-auto w- absolute top-[30%] left[40%]">
          <Loader label={"Logging into your account"} />
        </div>
      )}

      {/* backbutton to home page itself */}
      <div className="absolute top-10 left-10 bg-black">
        <Link to={"/"}>
          {" "}
          <Button
            text={"⬅ Back"}
            iconwidth={0}
            textColor={"white"}
            width={100}
            padding={5}
            borderRadius={20}
            border={"1px solid white"}
          />{" "}
        </Link>
      </div>

      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1.25, delay: 0.25 }}
      >
        {/* heading  */}
        <div className="heading text-center text-white">
          <img src={login} className="w-[3%] mx-auto opacity-70" alt="" />
          <div className="text-4xl text-center mt-5 font-bold">
            <span className="bg-gradient-to-r from-text_start via-text_start to-text_end text-trans bg-clip-text">
              Welcome
            </span>{" "}
            back 💪 !!
          </div>
          <div className="w-[40%] mx-auto mt-6 opacity-55">
            Hoping you are enjoying coding with with your friends and learning
            from others.
          </div>
        </div>

        {/* form for login */}
        <div
          className="form-wrapper mx-auto pt-7  w-fit rounded-2xl"
          onChange={inputValidator}
        >
          {/* email and password inputs  */}
          <div className="emailandpassword mt-4">
            {/* email  */}
            <div className="email w-[40rem] mx-auto">
              <label className="text-white">Email address</label>
              <br />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="rounded-md border-[1.1px] border-[gray] text-slate-500 text-sm py-2 px-5 w-full mt-4 outline-none bg-[#111111]"
              />
            </div>

            {/* password  */}
            <div className="password w-[40rem] mx-auto mt-4">
              <label className="text-white">Enter password</label>
              <br />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Must be 6 characters"
                className="rounded-md border-[1.2px] border-[gray] bg-[#111111] text-slate-500 text-sm py-2 px-5 w-full mt-4 outline-none"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            {/* submission button */}
            <Button
              text={"Sign into account"}
              textColor={"white"}
              icon={arrow}
              iconwidth={16}
              gradient={true}
              width={"100%"}
              borderRadius={45}
              padding={9}
              disable={processing}
              onClick={handleLogin}
            />
            {/* <div className="cursor-pointer font-semibold mt-10 text-sm opacity-60 text-shadow">
              Forgot your password ?
            </div> */}
          </div>
        </div>

        {/* footer route to login page  */}
        <div className="text-center mx-auto mt-6 text-shadow">
          Don't have an account ?{" "}
          <Link
            className="bg-gradient-to-r from-text_start via-text_start to-text_end text-trans bg-clip-text font-semibold hover:underline"
            to="/auth/create-account"
          >
            {" "}
            Signup
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
