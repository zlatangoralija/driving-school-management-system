import React from "react";

const ProgressBarInside = ({ percentage }) => {
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
      <div className="w-full bg-gray-100 rounded-full h-4">
        <div
          className={`${colorClass} h-4 text-xs font-medium text-gray-100 text-center leading-none rounded-full flex justify-center items-center`}
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
    </>
  );
};

export default ProgressBarInside;
