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
