import React, { useContext } from "react";
import Button from "../../helpers/Button";
import arrow from "../../assets/icons/arrow-white.png";
import user from "../../assets/icons/create-account.png";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { funcContext } from "../../contexts/context";

const Intro = () => {
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  //getting token and showToast from context
  const { token, showToast } = useContext(funcContext);
  //initializing useNavigate
  const navigate = useNavigate("/");

  return (
    <div className="intro-wrapper pt-[12.5%] pb-[15%] bg-black ">
      <motion.div
        className="upper-part lg:max-w-[70%] xl:max-w-[73%] lg:mt-28 xl:mt-0 mx-auto"
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1.5, delay: 0.25 }}
      >
        {/* main heading text */}
        <div className="main-heading lg:text-5xl xl:text-7xl text-center w-full">
          <div className="name bg-gradient-to-tr from-text_start via-text_start  to-text_end text-trans bg-clip-text font-extrabold tracking-tight">
            Variable{" "}
            <span className="name text-white">
              <span className="font-normal">- </span>your handy and convenient
              sharable code editor.
            </span>
          </div>
        </div>

        {/* description about the application*/}
        <div
          className="description-about-application text-[grey] text-center xl:px-10 text-normal lg:mt-[3%] xl:mt-[2.2%]"
          style={{ fontWeight: 400 }}
        >
          Experience the thrill 😃 of{" "}
          <span className="font-mono bg-gradient-to-tr from-text_start via-text_start  to-text_end text-trans bg-clip-text font-semibold">
            coding
          </span>{" "}
          together with your team 🧑‍🤝‍🧑, regardless of geographical locations 🌍.
          See changes instantly, allowing for efficient{" "}
          <span className="font-mono bg-gradient-to-tr from-text_start via-text_start to-text_end text-trans bg-clip-text font-semibold">
            collaboration
          </span>{" "}
          and the chance of learning and practising{" "}
          <span className="font-mono bg-gradient-to-tr from-text_start via-text_start to-text_end text-trans bg-clip-text font-semibold">
            together
          </span>{" "}
          ⚡️.
        </div>

        {/* buttons for handling initial user actions */}
        <div className="buttons text-center mt-[3%] flex justify-center gap-5">
          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1, delay: 0.25 }}
          >
            <Button
              onClick={() => {
                if (localStorage.getItem("variable-authtoken")) {
                  navigate("/room/enter-room");
                  return;
                }
                showToast(
                  "Login to proceed further",
                  "➡️",
                  "#262625",
                  12,
                  "white"
                );
              }}
              text={"Start coding now"}
              textColor={"white"}
              padding={16}
              width={270}
              borderRadius={35}
              icon={arrow}
              iconwidth={15}
              gradient={true}
            />
          </motion.div>

          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1, delay: 0.25 }}
          >
            <Button
              onClick={() => {
                if (token) {
                  showToast(
                    "Logout to create new account",
                    "❌",
                    "#262625",
                    12,
                    "white"
                  );
                  return;
                }
                navigate("/auth/create-account");
              }}
              text={"Create account"}
              backgroundColor={"black"}
              textColor={"white"}
              padding={16}
              width={270}
              borderRadius={35}
              icon={user}
              iconwidth={17}
              border={"1px solid white"}
              borderColor={"white"}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Intro;
