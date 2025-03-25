import React, { useEffect, useRef } from "react";
import main from "../../assets/main2.png";
import blob1 from "../../assets/svgs/blob1.svg";
import blob2 from "../../assets/svgs/blob2.svg";
import { motion, useAnimation, useInView } from "framer-motion";

const Illustration = () => {
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  return (
    <div className="bg-black relative pb-[5%]">
      {/* heading */}
      <hr className="h-[2px] bg-[#111111] mt-10" />
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 25 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1.25, delay: 0.25 }}
        className="main-heading text-4xl text-center w-full pt-[9%]"
      >
        {/* first heading  */}
        {/* <div className="name bg-gradient-to-r text-center mx-auto lg:w-[75%] from-text_start to-text_end text-trans bg-clip-text font-bold tracking-tight">
          Experience{" "}
          <span className="name text-white">rich code rooms features 💪</span>
        </div> */}

        {/* second heading  */}
        <div className="name text-white text-center mx-auto lg:w-[65%] xl:w-auto font-bold tracking-tight mt-1">
          I have{" "}
          <span className="name text-white line-through opacity-40">
            no one
          </span>{" "}
          <span className="bg-gradient-to-r from-text_start to-text_end text-trans bg-clip-text font-bold tracking-tight">
            many friends
          </span>{" "}
          🙂 to practice code with.
        </div>
      </motion.div>

      {/* figma image illustration  */}
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1.25, delay: 0.25 }}
      >
        <img src={main} className="lg:w-full xl:w-[80%] mt-20 mx-auto" alt="" />
      </motion.div>

      {/* adding absolute blobs  */}
      <div className="blobs ">
        <img
          src={blob1}
          className="absolute opacity-20 top-[7%] left-[12%] w-[40%]"
          alt=""
        />
        <img
          src={blob2}
          className="absolute opacity-15 -bottom-0 right-[10%] w-[45%]"
          alt=""
        />
      </div>
    </div>
  );
};

export default Illustration;
