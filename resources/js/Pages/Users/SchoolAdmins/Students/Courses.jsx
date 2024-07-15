import { Head, Link } from "@inertiajs/react";
import React from "react";
import { timezoneDate } from "@/Components/Helpers.jsx";
import {
  FcApproval,
  FcBusinessman,
  FcCalendar,
  FcMoneyTransfer,
  FcReadingEbook,
} from "react-icons/fc";
import { MdOutlineAccountCircle } from "react-icons/md";

import { FaCheck, FaRegCalendarAlt, FaRegMoneyBillAlt } from "react-icons/fa";
import ProgressBarInside from "@/Components/ProgressInside.jsx";

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
          <div className="button-pill button-pill-blue">Courses</div>
        </Link>
        <Link
          href={route("school-administrators.student-driving-test", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">Driving test</div>
        </Link>
      </div>

      {props.courses && props.courses.length ? (
        <>
          {props.courses.map((item, i) => {
            return (
              <Link
                href={route("school-administrators.courses.show", {
                  course: item.id,
                })}
                key={item.id}
              >
                <div className="card mb-8">
                  <div className="mb-6">
                    <h2>{item.course.name}</h2>
                    <small>{item.course.description}</small>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* <div className="flex gap-4">
                      <FcApproval className="w-10 h-10" />
                      <div>
                        <h4>Booked lessons</h4>
                        <div className="flex justify-center flex-col items-center">
                          <ProgressBarInside
                            percentage={item.booked_lessons_percentage}
                          />
                          <small className="mb-1">{item.booked_lessons}</small>
                        </div>
                      </div>
                    </div> */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div className="flex gap-2 items-end">
                          <FaCheck className="w-5 h-5 mb-1" />
                          <h4>Booked lessons</h4>
                        </div>
                        <small className="mb-1">{item.booked_lessons}</small>
                      </div>
                      <ProgressBarInside
                        percentage={item.booked_lessons_percentage}
                      />
                    </div>
                    {/* <div className="flex gap-4">
                      <FcMoneyTransfer className="w-10 h-10" />
                      <div>
                        <h4>Lessons paid</h4>
                        <div className="flex justify-center flex-col items-center">
                          <ProgressBarInside
                            percentage={item.paid_courses_percentage}
                          />
                          <small>{item.paid_courses}</small>
                        </div>
                      </div>
                    </div> */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div className="flex gap-2 items-end">
                          <FaRegMoneyBillAlt className="w-5 h-5 mb-1" />
                          <h4>Lessons paid</h4>
                        </div>
                        <small className="mb-1">{item.paid_courses}</small>
                      </div>
                      <ProgressBarInside
                        percentage={item.paid_courses_percentage}
                      />
                    </div>
                    <div className="flex gap-2">
                      <MdOutlineAccountCircle className="w-5 h-5 mt-[3px]" />
                      <div>
                        <h4>Instructor</h4>
                        <div className="flex justify-center flex-col items-center">
                          <span>{item.course.instructor.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex gap-4">
                      <FcCalendar className="w-10 h-10" />
                      <div>
                        <h4>Date started</h4>
                        <span>
                          {timezoneDate(item.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </span>
                      </div>
                    </div> */}
                    <div className="flex gap-2">
                      <FaRegCalendarAlt className="w-5 h-5 mt-[2px]" />
                      <div className="flex flex-col">
                        <h4>Date started</h4>
                        <span className="text-gray-700">
                          {timezoneDate(item.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </>
      ) : (
        <div className="card text-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div>There are no records to display</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
