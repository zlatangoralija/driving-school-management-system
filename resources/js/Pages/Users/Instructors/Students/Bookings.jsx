import { Head, Link } from "@inertiajs/react";
import React from "react";
import { timezoneDate } from "@/Components/Helpers.jsx";
import DataTableComponent from "@/Components/DataTable.jsx";
import ActionDropdown from "@/Components/ActionDropdown.jsx";
import { HiMiniEye } from "react-icons/hi2";

export default function Show(props) {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState();

  const createActionItems = (row) => {
    return [
      {
        label: "View",
        icon: <HiMiniEye />,
        href: route("instructors.bookings.show", { booking: row.id }),
      },
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
      <Head title="Students" />

      <div className="mx-auto mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Students
        </h1>
        <p className="mt-2 text-sm">Lorem ipsum text</p>
      </div>

      <div className="flex md:justify-center justify-start w-full mb-8 gap-3 overflow-auto">
        <Link
          href={route("instructors.students.show", { student: props.student })}
        >
          <div className="button-pill button-pill-gray">
            Personal information
          </div>
        </Link>
        <Link
          href={route("instructors.student-bookings", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-blue">Bookings</div>
        </Link>
        <Link
          href={route("instructors.student-courses", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">Courses</div>
        </Link>
        <Link
          href={route("instructors.student-driving-test", {
            student: props.student,
          })}
        >
          <div className="button-pill button-pill-gray">Driving test</div>
        </Link>
      </div>

      <DataTableComponent
        columns={columns}
        path={route("instructors.get-student-bookings", {
          student: props.student,
        })}
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
