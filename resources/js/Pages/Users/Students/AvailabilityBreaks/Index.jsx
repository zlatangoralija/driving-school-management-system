import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import FlashNotification from "@/Components/FlashNotification.jsx";
import moment from "moment-timezone";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {timezoneDate} from "@/Components/Helpers.jsx";
import Modal from "@/Components/Modal.jsx";

export default function Index(props) {
    const wrapperRef = React.useRef(null);
    const {flash} = usePage().props;
    const [successNotice, setSuccessNotice] = React.useState(null);
    const [errorNotice, setErrorNotice] = React.useState(null);

    const [search, setSearch] = React.useState("");
    const [filters, setFilters] = React.useState();

    const [deleteModal, setDeleteModal] = React.useState();

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

    function deleteBreak(id) {
        router.delete(
            route("students.availability-breaks.destroy", {availability_break: id}),
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

    const columns = [
        {
            name: "Start time",
            selector: (row) => (
                <>{timezoneDate(row.start_time).format("DD/MM/YYYY H:mm")}</>
            ),
            sortable: true,
            sortField: "start_time",
        },
        {
            name: "End time",
            selector: (row) => (
                <>{timezoneDate(row.end_time).format("DD/MM/YYYY H:mm")}</>
            ),
            sortable: true,
            sortField: "end_time",
        },
        {
            name: "Reason",
            selector: (row) => <>{row.reason}</>,
            sortable: true,
            sortField: "reason",
        },
        {
            name: "Date created",
            selector: (row) => (
                <>{timezoneDate(row.created_at).format("DD/MM/YYYY HH:mm")}</>
            ),
            sortable: true,
            sortField: "created_at",
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <>
                        <div className="flex justify-between gap-3">
                            <Link
                                href={route("students.availability-breaks.edit", {
                                    availability_break: row.id,
                                })}
                                className="link"
                            >
                                Edit
                            </Link>
                            <a
                                href="#"
                                onClick={() => setDeleteModal(row.id)}
                                className="link text-[red]"
                            >
                                Delete
                            </a>
                        </div>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Availability settings"/>

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Availability settings
                        </h1>
                        <p className="mt-2 text-sm">Block your calendar timeslots here</p>
                    </div>
                </div>
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
                    href={route("students.availability-breaks.create")}
                    className="button button-blue"
                >
                    Add new break
                </Link>
            </div>

            <DataTableComponent
                columns={columns}
                path={route("students.get-availability-breaks")}
                search={search}
                object={"breaks"}
                pagination={true}
                filters={filters}
                onlyReload="breaks"
            />

            <Modal
                className="max-w-3xl"
                status={deleteModal}
                close={() => setDeleteModal(null)}
                title={"Delete break?"}
                content={
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-lg">
                            Are you sure you want to delete this availability break?
                        </p>
                    </div>
                }
                footer={
                    <div className="footer-modal">
                        <button
                            type="button"
                            onClick={() => setDeleteModal(null)}
                            className="button button-blue-outline w-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => deleteBreak(deleteModal)}
                            className="button button-blue w-full"
                        >
                            Delete break
                        </button>
                    </div>
                }
            />
        </>
    );
}
