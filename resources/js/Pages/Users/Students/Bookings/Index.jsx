import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

// components
import DataTableComponent from "@/Components/DataTable.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import { timezoneDate } from "@/Components/Helpers.jsx";
import ActionDropdown from "@/Components/ActionDropdown";
import { HiCalendarDays, HiMiniCurrencyEuro, HiMiniEye } from "react-icons/hi2";

export default function Index(props) {
  const wrapperRef = React.useRef(null);
  const { flash } = usePage().props;
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);

  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState();

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
        icon: <HiMiniEye />,
        href: route("students.bookings.show", { booking: row.id }),
      },
      ...(!row.status
        ? [
            {
              label: "Book",
              icon: <HiCalendarDays />,
              href: route("students.bookings.edit", { booking: row.id }),
            },
          ]
        : []),
      ...(row.status && !row.payment_status
        ? [
            {
              label: "Pay",
              icon: <HiMiniCurrencyEuro />,
              href: route("students.bookings.pay", { booking: row.id }),
            },
          ]
        : []),
    ];
  };

  const columns = [
    {
      name: "Course",
      selector: (row) => <>{row.course.name}</>,
      sortField: "name",
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <div
            className={`button-pill button-pill-${
              row.status ? "blue-status" : "gray-status"
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
            className={`button-pill button-pill-${
              row.payment_status ? "green-status" : "red-status"
            }`}
          >
            {row.payment_status ? "Paid" : "Not paid"}
          </div>
        </>
      ),
      sortField: "payment_status",
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

  const ExpandableRowComponent = ({ data }) => {
    return (
      <div className="table-details">
        {data && (
          <div className="grid grid-cols-4 gap-4 table-details-wrapper">
            <div className="flex flex-col">
              <span className="title">Start time</span>
              <span className="data">
                {data.start_time
                  ? timezoneDate(data.start_time).format("DD/MM/YYYY H:mm")
                  : "/"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="title">End time</span>
              <span className="data">
                {data.end_time
                  ? timezoneDate(data.end_time).format("DD/MM/YYYY H:mm")
                  : "/"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="title">Date created</span>
              <span className="data">
                {timezoneDate(data.created_at).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head title="Bookings" />

      <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Bookings
            </h1>
            <p className="mt-2 text-sm">Lorem ipsum text</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-8 gap-3">
        <Link href={route("students.bookings-calendar")}>
          <div className="button-pill button-pill-gray">Calendar view</div>
        </Link>
        <Link href={route("students.bookings.index")}>
          <div className="button-pill button-pill-blue">Table view</div>
        </Link>
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

      <DataTableComponent
        columns={columns}
        path={route("students.get-bookings")}
        search={search}
        object={"bookings"}
        pagination={true}
        filters={filters}
        onlyReload="bookings"
        expandableRows
        expandableRowsComponent={ExpandableRowComponent}
      />
    </>
  );
}
