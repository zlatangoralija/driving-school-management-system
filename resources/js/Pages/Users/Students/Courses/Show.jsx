import { Head, Link, router, usePage } from "@inertiajs/react";
import React from "react";
import DataTableComponent from "@/Components/DataTable.jsx";
import { timezoneDate } from "@/Components/Helpers.jsx";
import ProgressBarOutside from "@/Components/ProgressOutside.jsx";
import {
  FcAlarmClock,
  FcApproval,
  FcCalendar,
  FcMoneyTransfer,
} from "react-icons/fc";
import ActionDropdown from "@/Components/ActionDropdown.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Show(props) {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState();

  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);

  const wrapperRef = React.useRef(null);
  const { flash } = usePage().props;

  React.useEffect(() => {
    if (flash && Object.keys(flash).length) {
      if (flash.success) {
        setSuccessNotice(flash.success);
      }

      if (flash.errors) {
        setErrorNotice(flash.errors);
      }

      if (successNotice || errorNotice) {
        wrapperRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [flash]);

  const createActionItems = (row) => {
    return [
      {
        label: "View",
        href: route("students.bookings.show", { booking: row.id }),
      },
      ...(!row.status
        ? [
            {
              label: "Book",
              href: route("students.bookings.edit", { booking: row.id }),
            },
          ]
        : []),
    ];
  };

  const columns = [
    {
      name: "Start time",
      selector: (row) => (
        <>
          {row.start_time
            ? timezoneDate(row.start_time).format("DD/MM/YYYY H:mm")
            : "/"}
        </>
      ),
      sortField: "name",
    },
    {
      name: "End time",
      selector: (row) => (
        <>
          {row.end_time
            ? timezoneDate(row.end_time).format("DD/MM/YYYY H:mm")
            : "/"}
        </>
      ),
      sortField: "name",
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <div
            className={`button-pill button-${
              row.status ? "pill-green" : "pill-blue"
            }`}
          >
            {row.status_label}
          </div>
        </>
      ),
      sortField: "status_label",
    },
    {
      name: "Paid",
      selector: (row) => (
        <>
          <div
            className={`button-pill button-${
              row.payment_status ? "pill-green" : "pill-blue"
            }`}
          >
            {row.payment_status ? "Paid" : "Not paid"}
          </div>
        </>
      ),
      sortField: "status_label",
    },
    {
      name: "Instructor",
      selector: (row) => <>{row.instructor ? row.instructor.name : ""}</>,
      sortField: "instructor.name",
    },
    {
      name: "Action",
      cell: (row, index) => (
        <ActionDropdown items={createActionItems(row)} index={index} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <Head title={props.course.name} />

      <div className="mx-auto mt-6 mb-10 flex justify-between" ref={wrapperRef}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {props.course.name}
          </h1>
          <p className="mt-2 text-sm">Lorem ipsum text</p>
        </div>
      </div>

      {successNotice && flash.success && (
        <FlashNotification type="success" title={flash.success} />
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

      {props.finished_courses_percentage == 100 && !props.has_feedback && (
        <div className="card mb-8">
          <div className="flex justify-center">
            <FcApproval className="w-10 h-10" />
            <h2 className="mb-6">Congratulations!</h2>
          </div>

          <div className="flex justify-center items-center flex-col">
            <h4>
              You succesfully completed this course. Please, leave a review for
              the instructor.
            </h4>
            <Link
              className={"text-center button button-blue mt-5"}
              href={route("students.reviews.create", {
                _query: {
                  course: props.course.id,
                  instructor: props.course.instructor.id,
                  pivot_id: props.pivot_id,
                },
              })}
            >
              Leave a review
            </Link>
          </div>
        </div>
      )}

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
          <ProgressBarOutside
            label="Booked lessons"
            percentage={props.finished_courses_percentage}
          />
        </div>
        <div className="card mb-8">
          <ProgressBarOutside
            label="Lessons paid"
            percentage={props.paid_courses_percentage}
          />
        </div>
      </div>

      {props.upcoming_booking || props.latest_invoice ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {props.upcoming_booking && (
              <div className="card">
                <div className="flex items-center gap-4">
                  <FcAlarmClock className="w-10 h-10" />
                  <div className="flex flex-col">
                    <span className="font-bold text-2xl">Upcoming booking</span>
                    <span className="text-gray-600">
                      {timezoneDate(props.upcoming_booking.start_time).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {props.latest_invoice && (
              <div className="card">
                <div className="flex items-center gap-4">
                  <FcMoneyTransfer className="w-10 h-10" />
                  <div className="flex flex-col">
                    <span className="font-bold text-2xl">Latest invoice</span>
                    <span className="text-gray-600">
                      {timezoneDate(props.latest_invoice.created_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}{" "}
                      - {props.latest_invoice.amount} EUR
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        ""
      )}

      <div className="mx-auto mt-5 mb-5 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Your bookings
          </h1>
        </div>
      </div>

      <DataTableComponent
        columns={columns}
        path={route("students.get-course-bookings", { uuid: props.uuid })}
        search={search}
        object={"bookings"}
        pagination={true}
        filters={filters}
        onlyReload="bookings"
      />
    </>
  );
}
