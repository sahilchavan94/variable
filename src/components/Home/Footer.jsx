import React, { useRef, useEffect, useContext } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import call from "../../assets/icons/call.png";
import insta from "../../assets/icons/instagram.png";
import github from "../../assets/icons/github.png";
import { funcContext } from "../../contexts/context";
import { Link } from "react-router-dom";

const Footer = () => {
  const { showToast } = useContext(funcContext);

  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  const data = [
    {
      id: 1,
      text: "Create an account and stay logged in",
    },
    {
      id: 2,
      text: "Click on get started and create a new room or enter an existing room",
    },
    {
      id: 3,
      text: "Click on join and enter the code room",
    },
    {
      id: 4,
      text: "You are good to go with variable",
    },
  ];

  return (
    <div className="bg-black lg:mt-24 xl:12">
      {/* heading of footer */}
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 25 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1.25, delay: 0.25 }}
        className="text-center text-4xl font-bold text-white"
      >
        Usage instructions ⚒️↴
      </motion.div>

      {/* usage instructions   */}
      <div className="usageintructions lg:w-[75%] xl:w-[65%] mx-auto text-white text-lg mt-[5%]">
        {/* mapping the usage instructions  */}
        {data.map((item, i) => {
          return (
            <motion.div
              ref={ref}
              variants={{
                hidden: { opacity: 0, y: (i + 1) * 25 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{
                duration: 0.9,
                delay: i === 0 ? 0.25 : (i + 1) * 0.16,
              }}
              key={item.id}
              className="flex text-sm justify-start text-[grey] items-center gap-2 mt-3 bg-sub/30 lg:py-4 xl:py-5 px-10 rounded-md border border-[#111111]"
            >
              <div className="name">🟣 {item.text}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pb-[5%] mt-[12%] text-sm text-white opacity-90">
        ~ Sahil Chavan
        <div className="connections flex justify-center gap-4 mt-6">
          <img
            src={call}
            className="w-4 cursor-pointer"
            onClick={() => {
              showToast("Contact copied", "✅", "#262625", 12, "white");
              navigator.clipboard.writeText("+91 9922 341 223");
            }}
            alt=""
          />

          <Link
            to={"https://www.instagram.com/eren_yeager_9405/"}
            target="_blank"
          >
            <img src={insta} className="w-4 cursor-pointer" alt="" />
          </Link>
          <Link to={"https://github.com/sahil-gpm/variable"} target="_blank">
            <img src={github} className="w-4 cursor-pointer" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
