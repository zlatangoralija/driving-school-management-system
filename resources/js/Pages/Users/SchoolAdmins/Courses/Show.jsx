import {Head, router} from "@inertiajs/react";
import React from "react";
import {Menu, Transition} from "@headlessui/react";
import {
    ArchiveBoxIcon, ArrowRightCircleIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon, HeartIcon,
    PencilSquareIcon, TrashIcon, UserPlusIcon
} from "@heroicons/react/16/solid/index.js";
import { Fragment } from 'react'
import {Form} from "@unform/web";
import SelectDefault from "@/Components/SelectDefault.jsx";
import Modal from "@/Components/Modal.jsx";
import * as Yup from "yup";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Show(props) {
    return (
        <>
            <Head title={props.course.name} />

            <div className="mx-auto mt-6 mb-10 flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{props.course.name}</h1>
                    <p className="mt-2 text-sm">
                        Lorem ipsum text
                    </p>
                </div>
            </div>

            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Course:</span>
                    <span className="data">{props.course.name}</span>
                </div>
                <div className="card card-gray">
                    <div className="flex gap-2">
                        <span className="title">Description:</span>
                        <span className="data">{props.course.description}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Number of lessons:</span>
                        <span className="data">{props.course.number_of_lessons}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Payment option:</span>
                        <span className="data">{props.course.payment_option_label}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Price:</span>
                        <span className="data">{props.course.price} EUR</span>
                    </div>
                </div>
            </div>

        </>
    );
}
