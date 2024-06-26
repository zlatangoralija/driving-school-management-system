import {Head, Link} from "@inertiajs/react";
import React from "react";
import {timezoneDate} from "@/Components/Helpers.jsx";
import ProgressBarInside from "@/Components/ProgressInside.jsx";

export default function Show(props) {
    return (
        <>
            <Head title="Reviews" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Reviews</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Review for course:</span>
                    <span className="data">{props.review.course.name}</span>
                </div>
                <div className="card card-gray">
                    <div className="flex gap-2">
                        <span className="title">Review left by:</span>
                        <span className="data">{props.review.student.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Rating:</span>
                        <span className="data">{props.review.rating}/5</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Feedback:</span>
                        <span className="data">{props.review.feedback}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
