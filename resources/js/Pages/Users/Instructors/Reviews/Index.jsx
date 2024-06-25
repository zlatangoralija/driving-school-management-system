import React from "react";
import {Head, Link, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";
import ActionDropdown from "@/Components/ActionDropdown.jsx";

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
                href: route('instructors.reviews.show', {review: row.id}),
            },
        ];
    };

    const columns = [
        {
            name: 'course',
            selector: row => <>{row.course.name}</>,
            sortable: true,
            sortField: 'course',
        },
        {
            name: 'Student',
            selector: row => <>{row.student.name}</>,
            sortable: false,
            sortField: 'student',
        },
        {
            name: 'Rating',
            selector: row => <><div className="button-pill button-pill-blue">{row.rating}/5</div></>,
            sortable: true,
            sortField: 'rating',
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
            <Head title="Reviews" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Reviews</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <DataTableComponent
                columns={columns}
                path={route('instructors.get-reviews')}
                search={search}
                object={"reviews"}
                pagination={true}
                filters={filters}
                onlyReload="reviews"
            />
        </>
    );
}
