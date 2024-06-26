import {Head, Link} from "@inertiajs/react";
import React from "react";

export default function Show(props) {
    return (
        <>
            <Head title="Instructors" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Instructors</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="flex justify-center w-full mb-8 gap-3">
                <Link href={route('school-administrators.instructors.show', {'instructor': props.instructor})}>
                    <div className="button-pill button-pill-blue">Personal information</div>
                </Link>
                <Link href={route('school-administrators.instructor-bookings', {'instructor': props.instructor})}>
                    <div className="button-pill button-pill-gray">Bookings</div>
                </Link>
                <Link href={route('school-administrators.instructor-courses', {'instructor': props.instructor})}>
                    <div className="button-pill button-pill-gray">Courses</div>
                </Link>
            </div>

            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Instructor:</span>
                    <span className="data">{props.instructor.name}</span>
                </div>
                <div className="card card-gray">
                    <div className="flex gap-2">
                        <span className="title">Email:</span>
                        <span className="data">{props.instructor.email}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Status:</span>
                        <span className="data">{props.instructor.status_label}</span>
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
