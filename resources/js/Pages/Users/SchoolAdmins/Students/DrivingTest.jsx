import { Head, Link } from "@inertiajs/react";
import React from "react";
import { timezoneDate } from "@/Components/Helpers.jsx";
import { FcApproval, FcCalendar, FcExpired } from "react-icons/fc";

export default function Show(props) {
  return (
    <>
      <Head title="Students" />

      <div className="mx-auto mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Students
        </h1>
        <p className="mt-2 text-sm">Lorem ipsum text</p>
      </div>

      <div className="flex md:justify-center justify-start w-full mb-8 gap-3 overflow-auto">
        <Link
          href={route("school-administrators.students.show", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">
            Personal information
          </div>
        </Link>
        <Link
          href={route("school-administrators.student-bookings", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">Bookings</div>
        </Link>
        <Link
          href={route("school-administrators.student-courses", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">Courses</div>
        </Link>
        <Link
          href={route("school-administrators.student-driving-test", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-blue">Driving test</div>
        </Link>
      </div>

      {props.student.driving_test_booked ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-4">
              <FcApproval className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-gray-600">Driving test</span>
                <span className="font-bold text-xl">booked!</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-4">
              <FcCalendar className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-gray-600">Date and time</span>
                <span className="font-bold text-xl">
                  {timezoneDate(props.student.driving_test_booked).format(
                    "DD/MM/YYYY H:mm"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // <div className="card mb-8">
        //   <div className="flex gap-3">
        //     <FcApproval className="w-10 h-10" />
        //     <h2 className="mb-6">Driving test booked!</h2>
        //   </div>

        //   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        //     <div className="flex gap-4">
        //       <FcCalendar className="w-10 h-10" />
        //       <div>
        //         <h4>Date and time</h4>
        //         <span className="text-l">
        //           <strong>
        //             {timezoneDate(props.student.driving_test_booked).format(
        //               "DD/MM/YYYY H:mm"
        //             )}
        //           </strong>
        //         </span>
        //       </div>
        //     </div>
        //   </div>
        // </div>

        // <div className="card mb-8">
        //   <div className="flex justify-center gap-3">
        //     <FcExpired className="w-10 h-10" />
        //     <h2 className="mb-6">Driving test not booked yet!</h2>
        //   </div>
        // </div>
        <div className="card flex flex-col items-center">
          <div className="flex items-center gap-4">
            <FcExpired className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-gray-600">Driving test</span>
              <span className="font-bold text-xl">not booked yet!</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
