import React from "react";

const ProgressBarOutside = ({ label, percentage }) => {
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
      <div className="flex justify-between mb-2">
        <span className="text-base font-medium text-gray-600">{label}</span>
        <span className="text-gray-600 text-xl font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBarOutside;
