import {Head, Link, router} from "@inertiajs/react";
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
import DataTableComponent from "@/Components/DataTable.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Show(props) {

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()

    const columns = [
        {
            name: 'Start time',
            selector: row => <>{row.start_time ? timezoneDate(row.start_time).format('DD/MM/YYYY H:mm') : '/'}</>,
            sortable: true,
            sortField: 'start_time',
        },
        {
            name: 'End time',
            selector: row => <>{row.end_time ? timezoneDate(row.end_time).format('DD/MM/YYYY H:mm') : '/'}</>,
            sortable: true,
            sortField: 'end_time',
        },
        {
            name: 'Status',
            selector: row => <>{row.status_label}</>,
            sortable: true,
            sortField: 'status_label',
        },
        {
            name: 'Paid',
            selector: row => <>{row.payment_status ? 'Yes' : 'No'}</>,
            sortable: true,
            sortField: 'payment_status',
        },
        {
            name: 'Instructor',
            selector: row => <>{row.instructor ? row.instructor.name : ''}</>,
            sortable: true,
            sortField: 'instructor.name',
        },
        {
            name: 'Date created',
            selector: row => <>{timezoneDate(row.created_at).format('DD/MM/YYYY HH:mm')}</>,
            sortable: true,
            sortField: 'created_at',
        },
        {
            name: 'Action',
            selector: row => {
                return(
                    <>
                        <div className="flex justify-between gap-3">
                            <Link href={route('students.bookings.show', {booking: row.id})} className="link">View</Link>
                            {!row.status &&
                                <Link href={route('students.bookings.edit', {booking: row.id})} className="link">Book</Link>
                            }
                        </div>
                    </>
                )
            },
        },
    ];

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
                <p>Price per lesson: ${props.course.price}</p>

                <p>your lessons:</p>

                <DataTableComponent
                    columns={columns}
                    path={route('students.get-course-bookings', {'uuid': props.uuid})}
                    search={search}
                    object={"bookings"}
                    pagination={true}
                    filters={filters}
                    onlyReload="bookings"
                />
            </div>
        </>
    );
}
