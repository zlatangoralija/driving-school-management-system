import {Head} from "@inertiajs/react";
import React from "react";
import {timezoneDate} from "@/Components/Helpers.jsx";

export default function Show(props) {
    return (
        <>
            <Head title="Bookings"/>

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {props.booking.course.name}
                </h1>
                <p className="mt-2 text-sm">Lorem ipsum text</p>
            </div>

            <div className="w-full">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Course:</span>
                    <span className="data">{props.booking.course.name}</span>
                </div>
                <div className="card card-gray flex flex-col gap-y-3">
                    <div className="flex gap-2">
                        <span className="title">Instructor:</span>
                        <span className="data">{props.booking.instructor.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Start time:</span>
                        <span className="data">{props.booking.start_time ? timezoneDate(props.booking.start_time).format("DD/MM/YYYY H:mm") : '/'}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">End time:</span>
                        <span className="data">{props.booking.end_time ? timezoneDate(props.booking.end_time).format("DD/MM/YYYY H:mm") : '/'}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="title">Status</span>
                        <span className="data">{<div className={`button-pill button-${props.booking.status ? "pill-green" : "pill-blue"}`}>{props.booking.status_label}</div>}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="title">Payment status:</span>
                        <span className="data">{<div className={`button-pill button-${props.booking.payment_status ? "pill-green" : "pill-red"}`}>{props.booking.payment_status ? "Paid" : "Not paid"}</div>}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
