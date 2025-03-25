import React from "react";
import Button from "../../helpers/Button";

const Logoutmodal = ({ onContinue, onCancel, text }) => {
  return (
    <div className="logout-modal-wrapper p-10 rounded-3xl shadow-theme w-fit bg-black">
      <div className="heading text-white text-2xl text-center font-extrabold">
        {text}
      </div>

      <div className="btn-choices flex justify-center items-center gap-5 mt-8">
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

export default Logoutmodal;
