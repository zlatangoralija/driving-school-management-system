import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {Form} from "@unform/web";
import SelectDefault from "@/Components/SelectDefault.jsx";
import * as Yup from "yup";
import InputText from "@/Components/InputText.jsx";
import moment from "moment-timezone";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

export default function Index(props) {
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()

    const tz = moment.tz.guess();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(tz);

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
            name: 'Instructor',
            selector: row => <>{row.instructor.name}</>,
            sortable: true,
            sortField: 'instructor.name',
        },
        {
            name: 'Status',
            selector: row => <>{row.status_label}</>,
            sortable: true,
            sortField: 'status_label',
        },
        {
            name: 'Date created',
            selector: row => <>{dayjs(row.created_at).tz(tz).format('DD/MM/YYYY HH:mm')}</>,
            sortable: true,
            sortField: 'created_at',
        },
        {
            name: 'Action',
            selector: row => {
                return(
                    <>
                        <div className="flex justify-between gap-3">
                            {row.status === 1 &&
                                <Link href={row.course.invitation_url + '?invitation_id=' + row.id} className="link">Book now</Link>
                            }
                        </div>
                    </>
                )
            },
        },
    ];

    return (
        <>
            <Head title="Invitations" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Invitations</h1>
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
                path={route('students.get-invitations')}
                search={search}
                object={"invitations"}
                pagination={true}
                filters={filters}
                onlyReload="invitations"
            />
        </>
    );
}
