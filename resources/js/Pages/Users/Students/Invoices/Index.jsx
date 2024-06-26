import React from "react";
import {Head, Link, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";
import ActionDropdown from "@/Components/ActionDropdown.jsx";
import {HiMiniEye} from "react-icons/hi2";
import {HiArrowDown} from "react-icons/hi";

export default function Index(props) {
    const wrapperRef = React.useRef(null)

    const { flash } = usePage().props

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)

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

    const createActionItems = (row, setDeleteModal, auth) => {
        return [
            {
                label: "View",
                icon: <HiMiniEye/>,
                href: route('students.invoices.show', {invoice: row.id}),
            },
            {
                label: "Download",
                icon: <HiArrowDown />,
                href: route('students.download-invoice', {'invoice': row.id}),
                blank: true,
            },
        ];
    };

    const columns = [
        {
            name: 'description',
            selector: row => <>{row.description.length > 20 ? `${row.description.substring(0, 20)}...` : row.description}</>,
            sortable: true,
            sortField: 'description',
        },
        {
            name: 'Amount',
            selector: row => <>{row.amount} EUR</>,
            sortable: false,
            sortField: 'amount',
        },
        {
            name: 'Course',
            selector: row => <>{row.course.name}</>,
            sortable: false,
            sortField: 'paid_courses',
        },
        {
            name: 'Instructor',
            selector: row => <>{row.instructor.name }</>,
            sortable: true,
            sortField: 'course.instructor_name',
        },
        {
            name: 'Date created',
            selector: row => <>{timezoneDate(row.created_at).format('DD/MM/YYYY HH:mm')}</>,
            sortable: true,
            sortField: 'created_at',
        },
        {
            name: "Action",
            cell: (row, index) => (
                <ActionDropdown items={createActionItems(row)} index={index}/>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            <Head title="Courses" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Invoices</h1>
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
                path={route('students.get-student-invoices')}
                search={search}
                object={"invoices"}
                pagination={true}
                filters={filters}
                onlyReload="invoices"
            />
        </>
    );
}
