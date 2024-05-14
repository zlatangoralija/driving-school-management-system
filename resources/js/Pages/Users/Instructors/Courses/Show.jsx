import {Head} from "@inertiajs/react";
import React from "react";

export default function Show(props) {
    return (
        <>
            <Head title={props.course.name} />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{props.course.name}</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="card grid grid-cols-0 md:grid-cols-0 gap-6 p-5 mb-3">
                <p>Name: {props.course.name}</p>
                <p>Description: {props.course.description}</p>
                <p>Number of lessons: {props.course.number_of_lessons}</p>
                <p>Payment option: {props.course.payment_option_label}</p>
                <p>Price: ${props.course.price}</p>
            </div>
        </>
    );
}
