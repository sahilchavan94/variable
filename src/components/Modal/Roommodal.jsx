import React from "react";
import Button from "../../helpers/Button";

const Roommodal = ({ mainText, subText, onContinue, onCancel }) => {
  return (
    <div className="roomlogout-modal-wrapper p-10 rounded-3xl shadow-theme w-fit bg-black">
      <div className="heading text-white text-2xl text-center font-extrabold">
        {mainText}
      </div>

      <div className="subheading text-[grey] text-sm font-normal text-center px-14 mt-3">
        {subText}
      </div>

      <div className="ctrls text-center mt-6 flex justify-center gap-5">
        <Button
          onClick={onContinue}
          text={"Continue"}
          textColor={"white"}
          gradient={true}
          width={130}
          borderRadius={10}
          padding={10}
        />
        <Button
          onClick={onCancel}
          text={"Cancel"}
          textColor={"white"}
          backgroundColor={"red"}
          width={130}
          borderRadius={10}
          padding={10}
        />
      </div>
    </div>
  );
};

export default Roommodal;
