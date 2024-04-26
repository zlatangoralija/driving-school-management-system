import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function Index(props) {
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [ search, setSearch ] = React.useState('')
    const [ filters, setFilters ] = React.useState()
    const [deleteModal, setDeleteModal] = React.useState()
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

    const columns = [
        {
            name: 'Name',
            selector: row => <>{row.name}</>,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'email',
            selector: row => <>{row.email}</>,
            sortable: true,
            sortField: 'email',
        },
        {
            name: 'Account status',
            selector: row => <>{row.status_label}</>,
            sortable: true,
            sortField: 'status',
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
                            <Link href={route('instructors.students.show', {student: row.id})} className="link">View</Link>
                            <Link href={route('instructors.students.edit', {student: row.id})} className="link">Edit</Link>
                            <a href="#" onClick={() => setDeleteModal(row.id)} className="link text-[red]">Delete</a>
                        </div>
                    </>
                )
            },
        },
    ];

    function deleteStudent(id){
        router.delete(route('instructors.students.destroy', {student: id}), {
            onSuccess: (page) => {},
            onError: (errors) => {},
            preserveState: false,
            preserveScroll: false,
        })

        setDeleteModal(false);
    }

    return (
        <>
            <Head title="Students" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Students</h1>
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

            <div className="flex justify-end mb-3">
                <Link href={route('instructors.students.create')} className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Create new</Link>
            </div>

            <DataTableComponent
                columns={columns}
                path={route('instructors.get-instructor-students')}
                search={search}
                object={"students"}
                pagination={true}
                filters={filters}
                onlyReload="students"
            />

            <Modal
                className="max-w-3xl"
                status={deleteModal}
                close={()=>setDeleteModal(null)}
                title={"Delete this student?"}
                content={
                    <div className='flex flex-col justify-center items-center'>
                        <p className="text-lg">
                            Are you sure you want to delete this student?
                        </p>
                    </div>
                }
                footer={
                    <div className="w-full flex justify-between items-center">
                        <button type="button" onClick={()=>setDeleteModal(null)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                        <button type="button" onClick={()=>deleteStudent(deleteModal)} className="_button w-full md:w-auto min-w-[150px]">Delete student</button>
                    </div>
                }
            />
        </>
    );
}
