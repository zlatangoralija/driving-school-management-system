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
import ProgressBarOutside from "@/Components/ProgressOutside.jsx";
import {FcAlarmClock, FcMoneyTransfer} from "react-icons/fc";
import ActionDropdown from "@/Components/ActionDropdown.jsx";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Show(props) {

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()

    // const columns = [
    //     {
    //         name: 'Start time',
    //         selector: row => <>{row.start_time ? timezoneDate(row.start_time).format('DD/MM/YYYY H:mm') : '/'}</>,
    //         sortable: true,
    //         sortField: 'start_time',
    //     },
    //     {
    //         name: 'End time',
    //         selector: row => <>{row.end_time ? timezoneDate(row.end_time).format('DD/MM/YYYY H:mm') : '/'}</>,
    //         sortable: true,
    //         sortField: 'end_time',
    //     },
    //     {
    //         name: 'Status',
    //         selector: row => <>{row.status_label}</>,
    //         sortable: true,
    //         sortField: 'status_label',
    //     },
    //     {
    //         name: 'Paid',
    //         selector: row => <>{row.payment_status ? 'Yes' : 'No'}</>,
    //         sortable: true,
    //         sortField: 'payment_status',
    //     },
    //     {
    //         name: 'Instructor',
    //         selector: row => <>{row.instructor ? row.instructor.name : ''}</>,
    //         sortable: true,
    //         sortField: 'instructor.name',
    //     },
    //     {
    //         name: 'Date created',
    //         selector: row => <>{timezoneDate(row.created_at).format('DD/MM/YYYY HH:mm')}</>,
    //         sortable: true,
    //         sortField: 'created_at',
    //     },
    //     {
    //         name: 'Action',
    //         selector: row => {
    //             return(
    //                 <>
    //                     <div className="flex justify-between gap-3">
    //                         <Link href={route('students.bookings.show', {booking: row.id})} className="link">View</Link>
    //                         {!row.status &&
    //                             <Link href={route('students.bookings.edit', {booking: row.id})} className="link">Book</Link>
    //                         }
    //                     </div>
    //                 </>
    //             )
    //         },
    //     },
    // ];


    const columns = [
        {
            name: "Start time",
            selector: (row) => <>{row.start_time ? timezoneDate(row.start_time).format('DD/MM/YYYY H:mm') : '/'}</>,
            sortField: "name",
        },
        {
            name: "End time",
            selector: (row) => <>{row.end_time ? timezoneDate(row.end_time).format('DD/MM/YYYY H:mm') : '/'}</>,
            sortField: "name",
        },
        {
            name: "Status",
            selector: (row) => <><div className={`button-pill button-${row.status ? 'pill-green' : "pill-blue"}`  }>{row.status_label}</div></>,
            sortField: "status_label",
        },
        {
            name: "Paid",
            selector: (row) => <><div className={`button-pill button-${row.payment_status ? 'pill-green' : "pill-blue"}`  }>{row.payment_status ? 'Paid' : 'Not paid'}</div></>,
            sortField: "status_label",
        },
        {
            name: "Instructor",
            selector: (row) => <>{row.instructor ? row.instructor.name : ""}</>,
            sortField: "instructor.name",
        },
        {
            name: "Action",
            cell: (row, index) => <ActionDropdown row={row} index={index}/>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
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


            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Name:</span>
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
                        <span className="title">Price per lesson:</span>
                        <span className="data">{props.course.price} EUR</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card mb-8">
                    <ProgressBarOutside label="Booked lessons" percentage={props.finished_courses_percentage}/>
                </div>
                <div className="card mb-8">
                    <ProgressBarOutside label="Lessons paid" percentage={props.paid_courses_percentage}/>
                </div>
            </div>

            {props.upcoming_booking || props.latest_invoice ?
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {props.upcoming_booking &&
                            <div className="card">
                                <div className="flex items-center gap-4">
                                    <FcAlarmClock className="w-10 h-10"/>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-2xl">Upcoming booking</span>
                                        <span className="text-gray-600">{timezoneDate(props.upcoming_booking.start_time).format('DD/MM/YYYY HH:mm')}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        {props.latest_invoice &&
                            <div className="card min-h-44">
                                <div className="flex items-center gap-4">
                                    <FcMoneyTransfer className="w-10 h-10"/>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-2xl">Latest invoice</span>
                                        <span className="text-gray-600">{timezoneDate(props.latest_invoice.created_at).format('DD/MM/YYYY HH:mm')} - {props.latest_invoice.amount} EUR</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </>
                :
                ''
            }

            <div className="mx-auto mt-5 mb-5 flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Your bookings</h1>
                </div>
            </div>

            <DataTableComponent
                columns={columns}
                path={route('students.get-course-bookings', {'uuid': props.uuid})}
                search={search}
                object={"bookings"}
                pagination={true}
                filters={filters}
                onlyReload="bookings"
            />
        </>
    );
}
