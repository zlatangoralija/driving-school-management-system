import { Head, Link } from "@inertiajs/react";
import React from "react";

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
          <div className="button-pill button-pill-blue">
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
          <div className="button-pill button-pill-gray">Driving test</div>
        </Link>
      </div>

      <div className="w-full mb-6">
        <div className="card-gray-label flex gap-2">
          <span className="title">Instructor:</span>
          <span className="data">{props.student.name}</span>
        </div>
        <div className="card card-gray">
          <div className="flex gap-2">
            <span className="title">Email:</span>
            <span className="data">{props.student.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="title">Status:</span>
            <span className="data">{props.student.status_label}</span>
          </div>
          <div className="flex gap-2">
            <span className="title">Number of courses:</span>
            <span className="data">{props.number_of_courses}</span>
          </div>
          <div className="flex gap-2">
            <span className="title">Number of lessons booked:</span>
            <span className="data">{props.number_of_lessons_booked}</span>
          </div>
        </div>
      </div>
    </>
  );
}
