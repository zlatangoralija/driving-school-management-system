import {Head} from "@inertiajs/react";
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

            <div className="card grid grid-cols-0 md:grid-cols-0 gap-6 p-5 mb-3">
                <p>Name: {props.instructor.name}</p>
                <p>Email: {props.instructor.email}</p>
                <p>Status: {props.instructor.status}</p>
            </div>
        </>
    );
}
