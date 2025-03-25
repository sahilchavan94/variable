import React from "react";
import {
  EmailIcon,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  TelegramIcon,
  RedditIcon,
} from "react-share";
import Button from "../../helpers/Button";

const Sharemodal = ({ roomCode, mainText, subText, setSharePopup }) => {
  return (
    <div className="roomlogout-modal-wrapper p-10 rounded-3xl shadow-theme bg-black lg:w-[55vw] xl:w-[45vw] relative">
      <div className="heading text-white text-2xl text-center font-extrabold mt-16">
        {mainText}
      </div>

      <div className="subheading text-[grey] text-sm font-normal text-center px-14 mt-4">
        {subText}
      </div>

      <div className="ctrls text-center mt-12 flex justify-center gap-5">
        <WhatsappShareButton
          url="https://variable.onrender.com"
          title={`\nJoin the room 🤞 with roomcode → ${roomCode}`}
        >
          <WhatsappIcon size={60} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          url="https://variable.onrender.com"
          title={`\nJoin the room 🤞 with roomcode → ${roomCode}`}
        >
          <EmailIcon size={60} round={true} />
        </EmailShareButton>

        <TelegramShareButton
          url="https://variable.onrender.com"
          title={`\nJoin the room 🤞 with roomcode → ${roomCode}`}
        >
          <TelegramIcon size={60} round={true} />
        </TelegramShareButton>

        <RedditShareButton
          url="https://variable.onrender.com"
          title={`\nJoin the room 🤞 with roomcode → ${roomCode}`}
        >
          <RedditIcon size={60} round={true} />
        </RedditShareButton>
      </div>

      <div className="mt-16 mb-8 mx-auto w-fit">
        <Button
          text={"Cancel"}
          backgroundColor={"red"}
          iconwidth={0}
          width={100}
          textColor={"white"}
          padding={7}
          borderRadius={5}
          onClick={setSharePopup}
        />
      </div>
    </div>
  );
};

export default Sharemodal;
