import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../helpers/Button";
import mail from "../../assets/icons/mail.png";
import bin from "../../assets/icons/bin.png";
import default_user from "../../assets/icons/default.png";
import { motion, useAnimation, useInView } from "framer-motion";
import axios from "axios";
import { funcContext } from "../../contexts/context";
import Changeusernamemodal from "../Modal/Changeusernamemodal";
import Logoutmodal from "../Modal/Logoutmodal";
import Loader from "../../helpers/Loader";

const Profile = () => {
  //animation hooks
  const ref = useRef(null);
  const constraintRef = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });

  //state for storing new image
  const [newImage, setNewImage] = useState(""); //state for storing the new selected profile image

  //states for popups
  const [changeUsernamePopup, setChangeUsernamePopup] = useState(false);
  const [delAcc, setDelAcc] = useState(false);
  const [processing, setProcessing] = useState(false);

  /// for navigation
  const navigate = useNavigate("/");

  //states for showing progress and loaders / toast context
  const { showToast, getUserData, userData } = useContext(funcContext);

  //local functions
  //convert image to base64 format
  const convertBase64 = (e) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files[0]);
    data.addEventListener("load", () => {
      setNewImage(data.result);
    });
  };

  //saving image to mongo
  const updateProfilePicture = async () => {
    setProcessing(true);
    if (!newImage) {
      showToast("Failed to add profile", "❌", "#262625", 12, "white");
      return;
    }
    await axios
      .post(process.env.REACT_APP_CHANGE_PROFILE, {
        email: userData?.email,
        newImage,
      })
      .then(() => {
        showToast("Added profile successfully", "✅", "#262625", 12, "white");
      })
      .catch(() => {
        showToast(
          "Failed to add profile ( May be it's too large to be processed )",
          "❌",
          "#262625",
          12,
          "white"
        );
      });
    setProcessing(false);
  };

  //delete account completely
  const deleteAccount = async () => {
    setProcessing(true);
    axios
      .post(process.env.REACT_APP_DELETE_ACCOUNT, { email: userData?.email })
      .then(() => {
        showToast("Account deleted successfully", "✅", "#262625", 12, "white");
        localStorage.setItem("variable-authtoken", "");
        setDelAcc(false);
        navigate("/");
        window.location.reload();
      })
      .catch(() => {
        setProcessing(false);
        showToast("Failed to delete account", "❌", "#262625", 12, "white");
        setDelAcc(false);
      });
  };

  //useEffect
  useEffect(() => {
    //fetching user data
    getUserData();
    if (isInView) {
      mainControls.start("visible");
      return;
    }
  }, [isInView, mainControls, getUserData]);

  return (
    <>
      {/* popups  */}
      {changeUsernamePopup && (
        <motion.div
          drag
          dragConstraints={constraintRef}
          className="absolute top-12 right-10 z-10"
          animate={{ y: 50 }}
        >
          <Changeusernamemodal
            text={"Continue changing the username ?"}
            onCancel={() => setChangeUsernamePopup(false)}
          />
        </motion.div>
      )}

      {delAcc && (
        <motion.div
          drag
          dragConstraints={constraintRef}
          className="absolute top-12 left-20 z-10"
          animate={{ y: 50 }}
        >
          <Logoutmodal
            text={"Sure to delele your account ?"}
            onContinue={deleteAccount}
            onCancel={() => setDelAcc(false)}
          />
        </motion.div>
      )}

      {/* the main content on the page  */}
      <div
        ref={constraintRef}
        className="profile-wrapper pt-[8%] min-h-[100vh] bg-black "
      >
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

        <div className="shadow-lg shadow-theme rounded-2xl text-white w-[75%] xl:w-[60%] mx-auto p-16 mt-4 relative bg-black">
          {/* buttons in the top bar  */}
          <motion.div
            className="edit-profile absolute top-8 left-10 right-10 w-[90%] flex justify-between"
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.25, delay: 0.1 }}
          >
            {/* button to delete account */}
            <Button
              text={"Delete Account"}
              iconwidth={17}
              textColor={"white"}
              width={200}
              padding={7}
              borderRadius={20}
              backgroundColor={"red"}
              icon={bin}
              onClick={() => setDelAcc(true)}
            />
            <div className="flex justify-center gap-3 items-center">
              {/* save changes button */}
              <Button
                text={processing ? "Saving changes" : "Save profile "}
                textColor={"white"}
                gradient={newImage ? true : false}
                disable={!newImage ? true : false}
                width={processing ? 170 : 150}
                padding={5}
                borderRadius={20}
                onClick={updateProfilePicture}
              />

              <Button
                text={"Change username"}
                textColor={"white"}
                width={200}
                padding={5}
                border={"1px solid white"}
                borderRadius={20}
                onClick={() => setChangeUsernamePopup(true)}
              />
            </div>
          </motion.div>

          {/* divs containing all user data ans images */}
          <motion.div
            className="main-profile text-center mt-20"
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.25, delay: 0.25 }}
          >
            <img
              src={userData?.profile_image || newImage || default_user}
              className="mx-auto w-48 h-48 border-4 border-text_start rounded-full mb-4 object-cover"
              alt=""
            />
            <input
              id="fileinp"
              type="file"
              accept="image/*"
              onChange={(e) => convertBase64(e)}
              className="hidden"
            />
            <label
              htmlFor="fileinp"
              className="mx-auto text-white font-semibold cursor-pointer"
            >
              Change profile
            </label>
          </motion.div>

          <motion.div
            className="nameandemail text-white text-center mt-10"
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.25, delay: 0.7 }}
          >
            <div className="name text-6xl font-extrabold capitalize bg-gradient-to-r from-text_start to-text_end text-trans bg-clip-text">
              {userData.firstname &&
                userData?.firstname + " " + userData?.lastname}
              {!userData.firstname && <Loader />}
            </div>
            <div className="name text-lg mt-4 text-white flex justify-center items-center gap-2">
              <img src={mail} className="w-5" alt="" />
              {userData && userData?.email}
              {!userData && ""}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
