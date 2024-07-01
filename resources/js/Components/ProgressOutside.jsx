import React from "react";

const ProgressBarOutside = ({ label, percentage, text, title, info }) => {
  let colorClass = "";

  if (percentage < 30) {
    colorClass = "bg-gray-400";
  } else if (percentage >= 30 && percentage <= 65) {
    colorClass = "bg-purple";
  } else {
    colorClass = "bg-blue";
  }

  return (
    <>
      <div
        className={`flex justify-between items-center ${
          (title || info) && "mb-8"
        }`}
      >
        {title && <h4 className="font-bold">{title}</h4>}
        {info && <span className="button-pill button-pill-gray">{info}</span>}
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-base font-medium text-gray-600">{label}</span>
          <span className="text-gray-600 text-xl font-medium">
            {percentage}% {text}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`${colorClass} h-2.5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default ProgressBarOutside;
