import React from "react";

const ProgressBarInside = ({ percentage }) => {
  let colorClass = "";

  if (percentage < 45) {
    colorClass = "bg-red-600";
  } else if (percentage >= 45 && percentage <= 70) {
    colorClass = "bg-orange-600";
  } else {
    colorClass = "bg-green";
  }

  return (
    <>
      <div className="w-full bg-gray-300 rounded-full h-4">
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
