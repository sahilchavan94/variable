import React, { useCallback, useContext, useEffect, useState } from "react";
import Avatar from "react-avatar";
import Button from "../../helpers/Button";
import { funcContext } from "../../contexts/context";
import axios from "axios";

const Chatpopup = ({
  mainText,
  subText,
  socketRef,
  setChatPopup,
  roomCode,
}) => {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const { userData, showToast } = useContext(funcContext);

  const sendMsgToRoom = () => {
    if (msg.trim().length < 1) {
      showToast("Message is empty", "❌", "#262625", 12, "white");
      return;
    }
    socketRef?.emit("send-msg", {
      sender: userData.firstname + " " + userData.lastname,
      msg: msg,
      roomCode: roomCode,
    });
    setChats((prev) => [
      ...prev,
      { sender: userData.firstname + " " + userData.lastname, msg: msg },
    ]);
    setMsg();
  };

  const fetchPreviousMessages = useCallback(async () => {
    await axios
      .post(process.env.REACT_APP_CHECK_ROOM_EXISTANCE, { roomCode })
      .then((response) => {
        if (response.data.existance) {
          setChats(response.data.roomDetails.roomchats);
        }
      });
  }, [roomCode]);

  useEffect(() => {
    socketRef?.on("received-msg", ({ sender, msg }) => {
      setChats((prev) => [...prev, { sender, msg }]);
    });
  }, []);

  useEffect(() => {
    fetchPreviousMessages();
  }, [fetchPreviousMessages]);

  return (
    <div className="roomlogout-modal-wrapper p-10 cursor-pointer rounded-3xl shadow-theme lg:h-[65vh] xl:h-[83vh] lg:overflow-scroll lg:w-[55vw] xl:w-[40vw]  bg-black">
      <div className="heading text-white text-2xl text-start font-extrabold">
        {mainText}
      </div>

      <div className="subheading text-grey text-xs font-semibold text-center px-14 mt-2">
        {subText}
      </div>

      <div className="chats lg:h-[30vh] xl:h-[50vh] text-white overflow-y-scroll scroll-smooth text-sm">
        {chats.length === 0 && "No messages in room yet"}
        {chats.map((chat) => {
          return (
            <div
              className={`my-5 w-full flex ${
                chat.sender === userData.firstname + " " + userData.lastname
                  ? "justify-end"
                  : "justify-start"
              } items-center`}
            >
              {/* avatar, name and email  */}
              <div
                className={`flex max-w-[80%] justify-start items-start gap-4 px-6 py-3 rounded-lg bg-sub`}
              >
                <Avatar name={chat.sender} size="35" round={true} />
                <div className="capitalize text-sm text-white font-semibold">
                  {chat.sender === userData.firstname + " " + userData.lastname
                    ? "You"
                    : chat.sender}
                  <div className="normal-case text-[grey] font-normal text-sm mt-1">
                    {chat.msg}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="message-input my-8 xl:my-10 flex gap-2">
        <input
          type="text"
          value={msg}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMsgToRoom();
            }
          }}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          className="bg-sub text-white outline-none lg:px-3 xl:px-5 py-2 rounded-md w-full"
          placeholder="Enter message for the room "
        />
        <Button
          text={"Send"}
          width={"20%"}
          onClick={sendMsgToRoom}
          textColor={"white"}
          backgroundColor={"#f200b0"}
          borderRadius={6}
          padding={6}
        />
      </div>

      <Button
        text={"Cancel"}
        width={"20%"}
        onClick={setChatPopup}
        textColor={"white"}
        backgroundColor={"red"}
        borderRadius={6}
        padding={8}
      />
    </div>
  );
};

export default Chatpopup;
