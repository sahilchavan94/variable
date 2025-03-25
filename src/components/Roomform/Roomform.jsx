import React, { useEffect, useContext, useRef, useState } from "react";
import dab_astro from "../../assets/astraunots/dab-astro.svg";
import arrow from "../../assets/icons/arrow-white.png";
import Button from "../../helpers/Button";
import Loader from "../../helpers/Loader";
import { motion, useInView, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { funcContext } from "../../contexts/context";
import { v4 } from "uuid";
import axios from "axios";
import Logoutmodal from "../Modal/Logoutmodal";

const Roomform = () => {
  const { inputValidator, showToast, getUserData, userData } =
    useContext(funcContext); //context
  const navigate = useNavigate("/");

  //animation hooks
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });
  const constraintRef = useRef();

  //useEffect
  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls]);

  //states for room code and name
  const [roomCode, setRoomCode] = useState(""); //room code for unique room identification
  const [roomExist, setRoomExist] = useState(false); //signal for showing whether the room with given room code exists previously
  const [roomDetails, setRoomDetails] = useState({}); //signal for storing room data
  const [popup, setPopup] = useState(false); //signal for showing popup conditionally
  const [loading, setLoading] = useState(false); //loading indicator

  //all local methods/functions
  const generateRoomCode = () => {
    const code = v4();
    setRoomCode(code);
  };

  //check whether the room is previously existing
  const checkRoomExistance = async () => {
    if (!roomCode) {
      showToast("Enter room details", "❌", "#262625", 12, "white");
      return;
    }
    setLoading(true);
    const response = await axios.post(
      process.env.REACT_APP_CHECK_ROOM_EXISTANCE,
      { roomCode }
    );

    if (response.data.existance) {
      //if you are blacklisted then you can't join
      if (response.data.roomDetails?.blacklist.includes(userData?.email)) {
        showToast(
          "You are not allowed to join this room",
          "❌",
          "#262625",
          12,
          "white"
        );
        setLoading(false);
        return;
      }
      setRoomExist(true); //room with this code exists
    } else {
      setRoomExist(false); //room with this code doesn't exists
    }
    setRoomDetails(response.data.roomDetails);
    setPopup(true);
    setLoading(false);
  };

  //cancelling the process and removing the popup from screen
  const onCancel = () => {
    setPopup(false);
  };

  //fetch required data
  useEffect(() => {
    getUserData();
  }, [getUserData, navigate]);

  return (
    <div ref={constraintRef}>
      {/* logout popup to be shown  */}
      {popup && (
        <motion.div
          drag={true}
          dragConstraints={constraintRef}
          className="absolute w-[40%] z-20 right-10"
          animate={{ y: 50 }}
        >
          <Logoutmodal
            text={
              roomExist
                ? "A room with this code already exists, do you want to enter this room ?"
                : "Create a new room for coding ?"
            }
            onCancel={onCancel}
            onContinue={() => {
              navigate("/room/code-room-preview/" + roomCode, {
                state: {
                  roomCode: roomCode.trim(),
                  name: userData?.firstname + " " + userData?.lastname,
                  roomExist: roomExist,
                  email: userData?.email,
                  roomDetails: roomDetails,
                },
              });
              onCancel(); //to cancel the popup
            }}
          />
        </motion.div>
      )}

      <div
        className={`flex justify-between mx-auto items-center h-[100vh] overflow-hidden`}
      >
        {/* div containing astraunot dab image  */}
        <div className="left-image xl:mr-10 z-10 w-[50%] min-h-screen bg-black flex items-center">
          <motion.div
            className="items-center flex flex-col"
            ref={ref}
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.25, delay: 0.25 }}
          >
            <div className="lg:text-3xl xl:text-4xl text-center text-white px-7 xl:px-16 xl:font-extrabold lg:font-bold w-fit mx-auto">
              <span className="bg-gradient-to-r from-text_start to-text_end text-trans bg-clip-text">
                Teamwork
              </span>{" "}
              is the secret <br /> that makes common people achieve{" "}
              <span className="bg-gradient-to-r from-text_start to-text_end text-trans bg-clip-text">
                uncommon
              </span>{" "}
              results.
            </div>

            <img
              src={dab_astro}
              className="lg:w-[70%] xl:w-[60%] mt-1 rounded-xl"
              alt=""
            />
          </motion.div>
        </div>

        {/* div.room-creation-form-wrapper */}
        <motion.div
          className={`form-wrapper mt-10 lg:w-[60%] xl:w-[50%] max-w-[50%]`}
          ref={ref}
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate={mainControls}
          transition={{ duration: 1.25, delay: 0.25 }}
        >
          {/* headings  */}
          <div className="heading text-center">
            <div className="xl:text-4xl text-3xl text-center text-black px-16 font-extrabold w-fit mx-auto">
              Enter the room ↴
            </div>
            <div className="mx-auto max-w-[75%] mt-4 opacity-55 text-sm">
              Create your own new coding room 🙂 or you can also join an
              previously existing room just enter the code 🔑 for the room which
              you want to join ⚒️
            </div>
          </div>

          {/* section for creating room */}
          <div className="form-wrapper mx-auto mt-[2%] p-14 w-fit form-shadow rounded-2xl">
            {/* name and room code  */}
            <div className="nameandroomcode" onChange={inputValidator}>
              {/* name in room */}
              <div className="email mx-auto">
                <label>Name to be displayed in room</label>
                <br />
                <input
                  type="text"
                  placeholder="Name"
                  className="rounded-md capitalize border-[1.2px] border-white form-shadow text-slate-500 text-sm py-2 px-4 w-[22rem] xl:w-[35rem] mt-4 outline-none"
                  value={
                    userData === null
                      ? "Your name"
                      : userData?.firstname + " " + userData?.lastname
                  }
                />
              </div>

              {/* code for room  */}
              <div className="password mx-auto mt-4 mb-8">
                <label>Enter room code</label>
                <br />
                <input
                  type="text"
                  placeholder="Code"
                  className="rounded-md border-[1.2px] border-white form-shadow text-slate-500 text-sm py-2 px-4 w-[22rem] xl:w-[35rem] mt-4 outline-none"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
            </div>

            {/* button to check the room exists or not  */}
            <Button
              text={"Check room availaibility"}
              weight={700}
              textColor={"white"}
              width={"100%"}
              backgroundColor={"black"}
              borderRadius={50}
              icon={arrow}
              iconwidth={15}
              padding={12}
              onClick={checkRoomExistance}
            />

            {/* self generate room id for a new room  */}
            <div className="text-center mx-auto mt-10 text-shadow">
              Don't have a room code ?{" "}
              <span
                onClick={generateRoomCode}
                className="bg-gradient-to-r from-text_start via-text_start to-text_end text-trans bg-clip-text font-semibold hover:underline cursor-pointer"
                to="/auth/create-account"
              >
                {" "}
                Generate one
              </span>
            </div>
          </div>

          {/* button back to home page  */}
          <div className="mt-10 text-center">
            <Link to={"/"}>
              <Button
                text={"⬅ Back to home"}
                weight={500}
                textColor={"white"}
                gradient={true}
                borderRadius={50}
                iconwidth={1}
                padding={12}
                width={200}
              />
            </Link>
          </div>

          {loading && (
            <div className="mt-3 text-black text-center text-sm font-semibold">
              <Loader />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Roomform;
