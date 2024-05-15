import {Head} from "@inertiajs/react";
import React from "react";
import moment from "moment-timezone";
import {timezoneDate} from "@/Components/Helpers.jsx";

export default function Show(props) {

    console.log(props);

    return (
        <>
            <Head title="Bookings" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Bookings</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="card grid grid-cols-0 md:grid-cols-0 gap-6 p-5 mb-3">
                <p>Student: {props.booking?.student?.name}</p>
                <p>Course: {props.booking?.course?.name}</p>
                <p>Start time: {timezoneDate(props.booking.start_time).format('DD/MM/YYYY H:mm')}</p>
                <p>End time: {timezoneDate(props.booking.end_time).format('DD/MM/YYYY H:mm')}</p>
            </div>
        </>
    );
}
