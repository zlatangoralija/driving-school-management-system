import {Head} from "@inertiajs/react";
import React from "react";
import moment from "moment-timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

export default function Show(props) {
    const tz = moment.tz.guess();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(tz);

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
                <p>Instructor: {props.booking.instructor.name}</p>
                <p>Course: {props.booking.course.name}</p>
                <p>Start time: {dayjs(props.booking.start_time).tz(tz).format('DD/MM/YYYY H:mm')}</p>
                <p>End time: {dayjs(props.booking.end_time).tz(tz).format('DD/MM/YYYY H:mm')}</p>
            </div>
        </>
    );
}
