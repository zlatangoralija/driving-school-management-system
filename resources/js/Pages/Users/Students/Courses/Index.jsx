import React from "react";
import {Head, Link, router, usePage} from "@inertiajs/react";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";
import {
    FcApproval,
    FcCalendar,
    FcMoneyTransfer,
    FcReadingEbook,
} from "react-icons/fc";
import ProgressBarInside from "@/Components/ProgressInside.jsx";

export default function Index(props) {
    const wrapperRef = React.useRef(null);
    const bookingInviteForm = React.useRef(null);

    const {flash} = usePage().props;

    const [search, setSearch] = React.useState("");
    const [filters, setFilters] = React.useState();
    const [successNotice, setSuccessNotice] = React.useState(null);
    const [errorNotice, setErrorNotice] = React.useState(null);
    const [deleteModal, setDeleteModal] = React.useState();
    const [assignCourseModal, setAssignCourseModal] = React.useState();

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

    const columns = [
        {
            name: "Name",
            selector: (row) => <>{row.course.name}</>,
            sortable: true,
            sortField: "name",
        },
        {
            name: "description",
            selector: (row) => (
                <>
                    {row.course.description.length > 20
                        ? `${row.course.description.substring(0, 20)}...`
                        : row.course.description}
                </>
            ),
            sortable: true,
            sortField: "description",
        },
        {
            name: "Booked lessons",
            selector: (row) => <>{row.booked_lessons}</>,
            sortable: false,
            sortField: "booked_lessons",
        },
        {
            name: "Paid",
            selector: (row) => <>{row.paid_courses}</>,
            sortable: false,
            sortField: "paid_courses",
        },
        {
            name: "Instructor",
            selector: (row) => (
                <>
                    {row.course.admin
                        ? row.course.admin.name
                        : row.course.instructor.name}
                </>
            ),
            sortable: true,
            sortField: "course.instructor_name",
        },
        {
            name: "Date started",
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
                                href={route("students.courses.show", {course: row.id})}
                                className="link"
                            >
                                View
                            </Link>
                        </div>
                    </>
                );
            },
        },
    ];

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

            {props.courses && props.courses.length ? (
                <>
                    {props.courses.map((item, i) => {
                        return (
                            <Link
                                href={route("students.courses.show", {course: item.id})}
                                key={item.id}
                            >
                                <div className="card mb-8">
                                    <div className="mb-6">
                                        <h2>{item.course.name}</h2>
                                        <small>{item.course.description}</small>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="flex gap-4">
                                            <FcApproval className="w-10 h-10"/>
                                            <div>
                                                <h4>Booked lessons</h4>
                                                <div className="flex justify-center flex-col items-center">
                                                    <ProgressBarInside percentage={item.booked_lessons_percentage}/>
                                                    <small>{item.booked_lessons}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <FcMoneyTransfer className="w-10 h-10"/>
                                            <div>
                                                <h4>Lessons paid</h4>
                                                <div className="flex justify-center flex-col items-center">
                                                    <ProgressBarInside percentage={item.paid_courses_percentage}/>
                                                    <small>{item.paid_courses}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <FcReadingEbook className="w-10 h-10"/>
                                            <div>
                                                <h4>Instructor</h4>
                                                <span>
                                                  {item.course.admin
                                                      ? item.course.admin.name
                                                      : item.course.instructor.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <FcCalendar className="w-10 h-10"/>
                                            <div>
                                                <h4>Date started</h4>
                                                <span>
                                                  {timezoneDate(item.created_at).format(
                                                      "DD/MM/YYYY HH:mm"
                                                  )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </>
            ) : (
                <div className="card text-center">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <div>There are no records to display</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
