import React from "react";

const Button = ({
  text,
  disable,
  icon,
  iconwidth,
  textColor,
  backgroundColor,
  borderRadius,
  width,
  padding,
  weight,
  border,
  borderColor,
  onClick,
  opacity,
  gradient,
}) => {
  return (
    <button
      className={`text-sm font-semibold ${
        gradient
          ? "bg-gradient-to-r from-text_start via-text_start to-text_end"
          : ""
      }`}
      style={{
        opacity: opacity,
        color: textColor,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        width: width,
        fontWeight: weight,
        padding: padding,
        border: border,
        borderColor: borderColor,
      }}
      disabled={disable}
      onClick={onClick}
    >
      <div className="flex justify-center items-center gap-2">
        {text}
        <img src={icon} style={{ width: iconwidth }} alt="" />
      </div>
    </button>
  );
};

export default Button;
