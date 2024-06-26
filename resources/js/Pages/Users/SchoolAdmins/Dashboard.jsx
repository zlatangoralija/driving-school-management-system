import { Head } from '@inertiajs/react';
import React from "react";
import ProgressBarOutside from "@/Components/ProgressOutside.jsx";

export default function Dashboard(props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mb-10 mt-7">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Hello, {props.auth.user.name}
                </h3>
            </div>

            <div className="mb-8">
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Administrators</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.admins_count}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Instructors</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.instructors_count}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Students</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.students_count}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mb-8">
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Active administrators</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.active_admins_count}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Active instructors</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.active_instructors_count}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Active students</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.active_students_count}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mb-8">
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Courses</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.courses_count}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Enrolled courses</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.enrolled_courses}
                        </dd>
                    </div>

                    <div className="card card-blue">
                        <dt className="truncate text-sm font-medium">Total bookings</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {props.total_bookings_count}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card mb-8">
                    <ProgressBarOutside label="Finished courses" percentage={props.finished_courses_percentage}/>
                </div>
                <div className="card mb-8">
                    <ProgressBarOutside label="Finished lessons" percentage={props.finished_bookings_percentage}/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card mb-8">
                    <ProgressBarOutside label="Paid courses" percentage={props.paid_courses_percentage}/>
                </div>
                <div className="card mb-8">
                    <ProgressBarOutside label="Paid lessons" percentage={props.paid_bookings_percentage}/>
                </div>
            </div>

        </>
    );
}
