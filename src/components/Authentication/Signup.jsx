import React, { useRef, useState, useEffect, useContext } from "react";
import user from "../../assets/icons/user-black.png";
import plus from "../../assets/icons/add.png";
import Button from "../../helpers/Button";
import { Link, useNavigate } from "react-router-dom";
import { funcContext } from "../../contexts/context";
import { motion, useAnimation, useInView } from "framer-motion";
import axios from "axios";
import Loader from "../../helpers/Loader";
const Signup = () => {
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  const { inputValidator, showToast } = useContext(funcContext); //context
  const navigate = useNavigate("/"); // react router use navigate

  // states for form fields , i know i can make a single state object but for now i am creating them as individual data values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [processing, setProcessing] = useState(false); //state for handling processing loader

  //local methods

  //method/function to create a new user account
  const handleSignup = async () => {
    console.log(process.env.REACT_APP_CREATE_ACCOUNT);
    //checkig whether all the requird fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showToast("Missing fields", "❌", "#262625", 12, "white");
      return;
    }

    //check password length
    if (password.length < 6 || confirmPassword.length < 6) {
      showToast("Password too short", "❌", "#262625", 12, "white");
      return;
    }

    //check password confirmation
    if (password !== confirmPassword) {
      showToast("Passwords mismatch", "❌", "#262625", 12, "white");
      return;
    }
    setLoading(true);
    try {
      setProcessing(true);
      const response = await axios.post(process.env.REACT_APP_CREATE_ACCOUNT, {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
      });
      if (response.data.success) {
        showToast("Account created", "✅", "#262625", 12, "white");
        localStorage.setItem("variable-authtoken", response.data.authtoken); //setting the token in localstorage
        navigate("/", {
          replace: true,
          viewTransition: true,
        }); //na
        window.location.reload();
      }
      setProcessing(false);
    } catch (error) {
      console.log(error.message);
      showToast("Failed to create account", "❌", "#262625", 12, "white");
      setProcessing(false);
    }
    setLoading(false);
  };

  return (
    <div className={`pt-[4%] h-[100vh] overflow-scroll bg-black`}>
      {loading && (
        <div className="mt-3 text-black text-center text-sm font-semibold">
          <Loader label={"Creating your account"} />
        </div>
      )}

      {/* backbutton to home page itself */}
      <div className="absolute top-10 left-10 ">
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
        className="overflow-y-scroll"
      >
        {/* heading  */}
        <div className="heading text-center text-white overflow-y-scroll">
          <img
            src={user}
            className="w-[3%] mx-auto opacity-70 text-white"
            alt=""
          />
          <div className="text-4xl text-center font-bold">
            <span className="bg-gradient-to-r from-text_start via-text_start to-text_end text-trans bg-clip-text">
              Create
            </span>{" "}
            new account ↴⚒️
          </div>
          <div className="w-[40%] mx-auto mt-4 opacity-55">
            Embark on a code sharing journey 🚌 with us, where learning and
            practice lead to endless ∞ possibilities in the world of coding and
            learning ▲.
          </div>
        </div>

        {/* form for signup */}
        <div
          className="form-wrapper mx-auto p-9 w-fit rounded-2xl bg-black "
          onChange={inputValidator}
        >
          {/* for user name */}

          {/* first name input  */}
          <div className="flex items-center justify-center gap-2 mx-auto">
            <div className="firstname ">
              <label className="text-white">First name</label>
              <br />
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First name"
                className="rounded-md border-[1.1px] border-[gray] text-slate-500 text-sm py-2 px-5 w-80 mt-4 outline-none bg-[#111111]"
              />
            </div>

            {/* last name input  */}
            <div className="lastname ">
              <label className="text-white">Last name</label>
              <br />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last name"
                className="rounded-md border-[1.1px] border-[gray] text-slate-500 text-sm py-2 px-5 w-80 mt-4 outline-none bg-[#111111]"
              />
            </div>
          </div>

          {/* email and password inputs  */}
          <div className="emailandpassword mt-6">
            {/* email  */}
            <div className="email max-w-[41.25rem] mx-auto">
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
            <div className="password max-w-[41.25rem] mx-auto mt-6">
              <label className="text-white">Create password</label>
              <br />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Must be 6 characters"
                className="rounded-md border-[1.1px] border-[gray] text-slate-500 text-sm py-2 px-5 w-full mt-4 outline-none bg-[#111111]"
              />
            </div>

            <div className="password max-w-[41.25rem] mx-auto mt-6">
              <label className="text-white">Confirm password</label>
              <br />
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Must be 6 characters"
                className="rounded-md border-[1.1px] border-[gray] text-slate-500 text-sm py-2 px-5 w-full mt-4 outline-none bg-[#111111]"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            {/* submission button */}
            <Button
              text={"Create account"}
              textColor={"white"}
              icon={plus}
              iconwidth={17}
              gradient={true}
              width={"100%"}
              borderRadius={45}
              padding={8}
              disable={processing}
              onClick={handleSignup}
            />
          </div>
        </div>

        {processing && (
          <div className="mx-auto w-fit">
            <Loader label={"Creating your account"} />
          </div>
        )}

        {/* footer route to login page  */}
        <div className="text-center mx-auto mt-2 text-shadow">
          Already have an account ?{" "}
          <Link
            className="bg-gradient-to-r from-text_start via-text_start to-text_end text-trans bg-clip-text font-semibold hover:underline"
            to="/auth/log-into-account"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
