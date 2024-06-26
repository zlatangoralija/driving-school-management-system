import {Head} from "@inertiajs/react";
import React from "react";

export default function Show(props) {
    return (
        <>
            <Head title="Administrators" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Administrators</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Administrator:</span>
                    <span className="data">{props.administrator.name}</span>
                </div>
                <div className="card card-gray">
                    <div className="flex gap-2">
                        <span className="title">Email:</span>
                        <span className="data">{props.administrator.email}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Status:</span>
                        <span className="data">{props.administrator.status_label}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
