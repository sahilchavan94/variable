import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { funcContext } from "../../contexts/context";
import ReactCodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { dracula } from "@uiw/codemirror-theme-dracula";
import Avatar from "react-avatar";
import Button from "../../helpers/Button";
import axios from "axios";
import Roommodal from "../Modal/Roommodal";
import Sharemodal from "../Modal/Sharemodal";
import call from "../../assets/icons/call.png";
import more from "../../assets/icons/more.png";
import share from "../../assets/icons/share.png";
import group from "../../assets/icons/group.png";
import eye from "../../assets/icons/eye.png";
import { motion, useInView, useAnimation } from "framer-motion";
import Roomusermodal from "../Modal/Roomusermodal";
import Chatpopup from "../Modal/Chatpopup";
import { Resizable } from "re-resizable";

const Codingarea = () => {
  //animation hooks
  const ref = useRef(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });
  const constraintRef = useRef();

  //socket ref from context
  const { socketRef, showToast, userData } = useContext(funcContext);

  const code = useParams("roomCode");
  const location = useLocation();
  const navigate = useNavigate("/");

  //states for maintaining room information in frontend
  const [members, setMembers] = useState([]);
  const [writtenCode, setWrittenCode] = useState(``);
  const [writer, setWriter] = useState();
  const [viewOnly, setViewOnly] = useState(false);
  const [viewOnlyForHost, setviewOnlyForHost] = useState(false);

  //popups and modals state
  const [popup, setPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [userPopup, setUserPopup] = useState(false);
  const [chatPopup, setChatPopup] = useState(false);

  //====================================================//
  //local functions
  const onHostLeave = useCallback(async () => {
    axios
      .post(process.env.REACT_APP_HOST_LEFT, { roomCode: code })
      .then(() => {
        socketRef?.current?.emit("end-room", { roomCode: code.roomCode });
        navigate("/room/enter-room");
        setPopup(false);
      })
      .catch(() => {
        showToast("Some error occurred", "❌", "#262625", 12, "white");
        return;
      });
  }, [code, navigate, showToast, socketRef]);

  const onCodeChange = (e) => {
    setWrittenCode(e);
    socketRef?.current.emit("code-change", {
      writer: userData.firstname + " " + userData.lastname,
      writtenCode: e,
      roomCode: code.roomCode,
    });
  };

  const changedRoomMode = () => {
    socketRef.current.emit("change-mode", {
      newMode: !viewOnly,
      roomCode: code.roomCode,
    });
    setviewOnlyForHost(!viewOnlyForHost);
  };

  //====================================================//
  // useEffect hook
  useEffect(() => {
    const socketReference = socketRef?.current;

    const handleErrors = () => {
      showToast(
        "We are facing connection issues, please rejoin",
        "🛜",
        "#262625",
        12,
        "white"
      );
      navigate("/room/enter-room");
    };

    //handle all connection issues
    socketReference?.on("connect_error", () => handleErrors());
    socketReference?.on("connect_failed", () => handleErrors());

    socketReference?.emit("joining-room", {
      roomCode: code.roomCode,
      joiningMemberName: location.state.memberName,
    }); //emit joining room event

    socketReference?.on("joined-room", ({ members, joiningMemberName }) => {
      showToast(
        joiningMemberName === userData.firstname + " " + userData.lastname
          ? "You joined the room"
          : joiningMemberName + " joined the room",
        "✅",
        "#262625",
        12,
        "white"
      );
      setMembers(members);
    });

    socketReference?.on("writing-code", ({ writer, writtenCode }) => {
      setWrittenCode(writtenCode);
      setWriter(writer);
    });

    socketReference?.on("mode-changed", ({ newMode }) => {
      if (location.state.hostEmail) {
        setViewOnly(newMode);
      }
    });

    socketReference?.on("room-ended", () => {
      navigate("/room/enter-room");
      showToast("Room ended by host", "❌", "#262625", 12, "white");
    });

    socketReference?.on("removed", () => {
      setChatPopup(false);
      setPopup(false);
      setSharePopup(false);
      setUserPopup(false);
      navigate("room/enter-room");
      showToast("Host removed you from the room", "❌", "#262625", 12, "white");
    });

    socketReference?.on("disconnected", ({ leavingMemberName, members }) => {
      //setting new members
      setMembers(members);
      if (
        leavingMemberName !==
        userData?.firstname + " " + userData?.lastname
      ) {
        showToast(
          leavingMemberName + " left the room",
          "❌",
          "#262625",
          12,
          "white"
        );
      }
    });

    return () => {
      // delete the room completely if the host leaves
      if (!location.state.hostEmail) {
        onHostLeave();
        showToast(
          "You ended the room for everyone",
          "❌",
          "#262625",
          12,
          "white"
        );
      } else {
        showToast("You left the room", "❌", "#262625", 12, "white");
        navigate("/room/enter-room");
      }
      socketReference?.disconnect();
    };
  }, [code, showToast, socketRef, location, navigate, userData, onHostLeave]);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      navigate("/");
    });
    if (isInView) {
      mainControls.start("visible");
    }
    setWrittenCode(`// JavaScript code for a welcome message
function displayWelcomeMessage() {
    console.log("Welcome! We're glad you're here.");
}
// Call the function when the script runs
displayWelcomeMessage();`);
  }, [isInView, mainControls, navigate]);

  //====================================================//
  //components to be rendered
  return (
    <>
      {popup && (
        <motion.div
          drag
          dragConstraints={constraintRef}
          animate={{ y: 50 }}
          className="modals-and-popups absolute top-10  right-20 z-30 max-w-[40%]"
        >
          <Roommodal
            mainText={"Hello"}
            subText={
              "Leaving the meet as a host will close ❌ the room for everyone, do you still want to leave "
            }
            onContinue={onHostLeave}
            onCancel={() => setPopup(false)}
          />
        </motion.div>
      )}

      {sharePopup && (
        <motion.div
          dragConstraints={constraintRef}
          drag
          animate={{ y: 50 }}
          className="modals-and-popups absolute top-10 right-20 z-30 max-w-[40%]"
        >
          <Sharemodal
            mainText={"Share this room invite"}
            subText={
              "Invite your friends to this room 👀 and enjoy the experience of learning together 💪"
            }
            roomCode={code.roomCode}
            setSharePopup={() => setSharePopup(false)}
          />
        </motion.div>
      )}

      {userPopup && (
        <motion.div
          drag
          dragConstraints={constraintRef}
          animate={{ y: 50 }}
          className="modals-and-popups absolute bottom-20 left-20 z-30 max-w-[60%]"
        >
          <Roomusermodal
            members={members}
            setUserPopup={() => setUserPopup(false)}
            socketRef={socketRef.current}
            roomCode={code.roomCode}
          />
        </motion.div>
      )}

      {chatPopup && (
        <motion.div
          drag
          dragConstraints={constraintRef}
          animate={{ y: 50 }}
          className="modals-and-popups absolute bottom-20 left-20 z-30 w-[60%]"
        >
          <Chatpopup
            mainText={"Room chats ↴"}
            setChatPopup={() => setChatPopup(false)}
            socketRef={socketRef?.current}
            roomCode={code.roomCode}
          />
        </motion.div>
      )}

      {/* editor and the control buttons  */}
      <div
        className="text-white min-h-[100vh] overflow-hidden bg-black flex"
        ref={constraintRef}
      >
        <div className="w-[75%] h-[100vh] text-lg">
          <Resizable
            maxWidth={"94vw"}
            minWidth={"70vw"}
            maxHeight={"100%"}
            minHeight={"100%"}
            className="z-10 active:border-r-4 border-text_start"
          >
            <ReactCodeMirror
              readOnly={viewOnly}
              height={"100vh"}
              onChange={onCodeChange}
              style={{
                fontSize: 14,
              }}
              value={writtenCode}
              placeholder={"Welcome to variable javascript compiler"}
              extensions={[javascript({ jsx: true })]}
              theme={dracula}
            />
          </Resizable>

          <div className="absolute bottom-10 left-10 z-20 text-[grey] text-sm">
            {/* displaying date */}
            {new Date().toDateString()}
            {viewOnly && "  |  Host has set the room in view only mode"}
          </div>

          {/* room-controls */}
          <div className="absolute w-full flex justify-center gap-5 items-center bottom-10 z-20">
            <motion.div
              ref={ref}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <Button
                icon={call}
                iconwidth={50}
                backgroundColor={"red"}
                width={50}
                padding={15}
                borderRadius={55}
                onClick={() => {
                  if (members[0]?.memberEmail === userData.email) {
                    setPopup(true);
                  } else {
                    navigate("/room/enter-room");
                  }
                }}
              />
            </motion.div>

            <motion.div
              ref={ref}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <Button
                icon={more}
                iconwidth={40}
                backgroundColor={"#949494"}
                width={50}
                padding={15}
                borderRadius={55}
                onClick={() => {
                  setChatPopup(true);
                }}
              />
            </motion.div>

            <motion.div
              ref={ref}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Button
                icon={share}
                iconwidth={40}
                backgroundColor={"#949494"}
                width={50}
                padding={15}
                borderRadius={55}
                onClick={() => {
                  setSharePopup(true);
                }}
              />
            </motion.div>

            <motion.div
              ref={ref}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <Button
                icon={group}
                iconwidth={40}
                backgroundColor={"#949494"}
                width={50}
                padding={15}
                borderRadius={55}
                onClick={() => {
                  setUserPopup(true);
                }}
              />
            </motion.div>

            {!location.state.hostEmail && (
              <motion.div
                ref={ref}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                <Button
                  icon={eye}
                  iconwidth={40}
                  backgroundColor={viewOnlyForHost ? "#f200b0" : "#949494"}
                  width={50}
                  padding={15}
                  borderRadius={55}
                  onClick={changedRoomMode}
                />
              </motion.div>
            )}

            <div className="writer text-white text-lg font-semibold">
              {writer && writer.split(" ")[0] + " edited the code..."}
            </div>
          </div>
        </div>

        {/* room members and the right sidebar  */}
        <div className="members-and-chat-wrapper h-[100vh] xl:w-[25%] lg:w-[30%] py-4 relative">
          <div className="text-md font-semibold px-5 text-start">
            {members.length < 2
              ? "You are the only one in the room 🙁"
              : "Your coding mates 🙂"}
          </div>
          <div className="flex flex-wrap justify-start items-center gap-3 mt-3 px-5">
            {members?.map((member, i) => {
              if (i < 7) {
                return (
                  <motion.div
                    animate={{ y: -5 }}
                    key={i}
                    className="xl:min-w-[47.5%] lg:min-w-[44%] bg-sub text-center py-6 rounded-md"
                  >
                    <Avatar name={member.memberName} size="45" round={true} />
                    <div className="mt-3 capitalize text-sm font-semibold">
                      {member.memberName ===
                      userData.firstname + " " + userData.lastname
                        ? "You"
                        : member.memberName.split(" ")[0]}
                      {i === 0 && <span> ( Host )</span>}
                    </div>
                  </motion.div>
                );
              }
              return <></>;
            })}

            {members.length > 6 && (
              <div className="show-total-members mt-8 text-white font-bold text-lg">
                {members.length - 6} more members
              </div>
            )}
          </div>

          <div className="other-controls absolute bottom-3 flex flex-col items-center w-full lg:px-2 xl:px-5 gap-3">
            <Button
              text={"Copy code for room 🔐"}
              backgroundColor={"#262625"}
              width={"100%"}
              padding={12}
              borderRadius={5}
              onClick={() => {
                navigator.clipboard.writeText(code.roomCode);
                showToast("Code copied", "🔑", "#262625", 12, "white");
              }}
            />
            <Button
              text={"Copy written code 👨‍💻"}
              backgroundColor={"#262625"}
              width={"100%"}
              padding={12}
              borderRadius={5}
              onClick={() => {
                if (!writtenCode.trim()) {
                  showToast("No code written", "🔑", "#262625", 12, "white");
                  return;
                }
                navigator.clipboard.writeText(code.writtenCode);
                showToast(
                  "Written code is copied",
                  "🔑",
                  "#262625",
                  12,
                  "white"
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Codingarea;
