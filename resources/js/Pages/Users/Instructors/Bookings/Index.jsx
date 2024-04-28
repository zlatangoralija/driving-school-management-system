import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function Index(props) {
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()

    React.useEffect(()=>{
        if(flash && Object.keys(flash).length){
            if(flash.success){
                setSuccessNotice(flash.success)
            }

            if(flash.errors){
                setErrorNotice(flash.errors)
            }

            if(successNotice || errorNotice){
                wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    },[flash])

    const columns = [
        {
            name: 'Course',
            selector: row => <>{row.course.name}</>,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Start time',
            selector: row => <>{row.start_time}</>,
            sortable: true,
            sortField: 'start_time',
        },
        {
            name: 'End time',
            selector: row => <>{row.end_time}</>,
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
            name: 'Student',
            selector: row => <>{row.student.name}</>,
            sortable: true,
            sortField: 'student.name',
        },
        {
            name: 'Date created',
            selector: row => <>{dayjs(row.created_at).format('DD/MM/YYYY HH:mm')}</>,
            sortable: true,
            sortField: 'created_at',
        },
        {
            name: 'Action',
            selector: row => {
                return(
                    <>
                        <div className="flex justify-between gap-3">
                            <Link href={route('instructors.bookings.show', {booking: row.id})} className="link">View</Link>
                        </div>
                    </>
                )
            },
        },
    ];

    return (
        <>
            <Head title="Bookings" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Bookings</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            {successNotice && flash.success &&
                <FlashNotification
                    type="success"
                    title={flash.success}
                />
            }

            {errorNotice && flash &&
                <FlashNotification
                    type="error"
                    title="Please fix the following errors"
                    list={errorNotice}
                    button={<button type="button" className="_button small !whitespace-nowrap" onClick={()=>setErrorNotice(null)}>close</button>}
                />
            }

            <DataTableComponent
                columns={columns}
                path={route('instructors.get-instructor-bookings')}
                search={search}
                object={"bookings"}
                pagination={true}
                filters={filters}
                onlyReload="bookings"
            />
        </>
    );
}
