import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";
import ActionDropdown from "@/Components/ActionDropdown.jsx";

export default function Index(props) {
    const wrapperRef = React.useRef(null);
    const {flash} = usePage().props;

    const [search, setSearch] = React.useState("");
    const [filters, setFilters] = React.useState();
    const [deleteModal, setDeleteModal] = React.useState();
    const [successNotice, setSuccessNotice] = React.useState(null);
    const [errorNotice, setErrorNotice] = React.useState(null);

    React.useEffect(() => {
        if (flash && Object.keys(flash).length) {
            if (flash.success) {
                setSuccessNotice(flash.success);
            }

            if (flash.errors) {
                setErrorNotice(flash.errors);
            }

            if (successNotice || errorNotice) {
                wrapperRef.current.scrollIntoView({behavior: "smooth"});
            }
        }
    }, [flash]);

    const ExpandableRowComponent = ({data}) => {
        return (
            <div className="table-details">
                {data && (
                    <div className="grid grid-cols-5 gap-4 table-details-wrapper">
                        <div className="flex flex-col">
                            <span className="title">Instructor</span>
                            <span className="data">
                            {data.instructor.name}
                          </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="title">Description</span>
                            <span className="data">
                            {data.description
                                ? data.description.length > 20 ? `${data.description.substring(0, 20)}...` : data.description
                                : "/"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="title">Date created</span>
                            <span className="data">
                            {data.created_at
                                ? timezoneDate(data.created_at).format("DD/MM/YYYY HH:mm")
                                : "/"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="title">Created by</span>
                            <span className="data">
                            {data.admin ? data.admin.name : data.instructor.name}
                          </span>
                        </div>

                    </div>
                )}
            </div>
        );
    };

    const createActionItems = (row) => {
        return [
            {
                label: "View",
                href: route("school-administrators.courses.show", {course: row.id}),
            },
            {
                label: "Edit",
                href: route("school-administrators.courses.edit", {course: row.id}),
            },
            ...(row.admin_id === props.auth.user.id
                ? [
                    {
                        label: "Delete",
                        action: () => {
                            setDeleteModal(row.id);
                        },
                    },
                ]
                : []),
        ];
    };

    const columns = [
        {
            name: "Name",
            selector: (row) => <>{row.name}</>,
            sortable: true,
            sortField: "name",
        },
        {
            name: "Number of lessons",
            selector: (row) => <>{row.number_of_lessons}</>,
            sortable: true,
            sortField: "number_of_lessons",
        },
        {
            name: "Lesson duration",
            selector: (row) => <>{row.duration ? row.duration + " minutes" : ""}</>,
            sortable: true,
            sortField: "duration",
        },
        {
            name: "Payment option",
            selector: (row) => <>{row.payment_option_label}</>,
            sortable: true,
            sortField: "payment_option",
        },
        {
            name: "Price",
            selector: (row) => <>{row.price} EUR</>,
            sortable: true,
            sortField: "price",
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

    function deleteCourse(id) {
        router.delete(
            route("school-administrators.courses.destroy", {course: id}),
            {
                onSuccess: (page) => {
                },
                onError: (errors) => {
                },
                preserveState: false,
                preserveScroll: false,
            }
        );

        setDeleteModal(false);
    }

    return (
        <>
            <Head title="Courses"/>

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Courses
                </h1>
                <p className="mt-2 text-sm">Lorem ipsum text</p>
            </div>

            {successNotice && flash.success && (
                <FlashNotification type="success" title={flash.success}/>
            )}

            {errorNotice && flash && (
                <FlashNotification
                    type="error"
                    title="Please fix the following errors"
                    list={errorNotice}
                    button={
                        <button
                            type="button"
                            className="_button small !whitespace-nowrap"
                            onClick={() => setErrorNotice(null)}
                        >
                            close
                        </button>
                    }
                />
            )}

            <div className="flex justify-end mb-3">
                <Link
                    href={route("school-administrators.courses.create")}
                    className="button button-blue"
                >
                    Create new
                </Link>
            </div>

            <DataTableComponent
                columns={columns}
                path={route("school-administrators.get-school-courses")}
                search={search}
                object={"courses"}
                pagination={true}
                filters={filters}
                onlyReload="courses"
                expandableRows
                expandableRowsComponent={ExpandableRowComponent}
            />

            <Modal
                className="max-w-3xl"
                status={deleteModal}
                close={() => setDeleteModal(null)}
                title={"Delete this course?"}
                content={
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-lg">
                            Are you sure you want to delete this course?
                        </p>
                    </div>
                }
                footer={
                    <div className="w-full flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setDeleteModal(null)}
                            className="_button white w-full md:w-auto min-w-[150px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => deleteCourse(deleteModal)}
                            className="_button w-full md:w-auto min-w-[150px]"
                        >
                            Delete course
                        </button>
                    </div>
                }
            />
        </>
    );
}
