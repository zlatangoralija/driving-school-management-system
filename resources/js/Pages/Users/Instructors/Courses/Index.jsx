import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Form } from "@unform/web";
import * as Yup from "yup";

// components
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import { timezoneDate } from "@/Components/Helpers.jsx";
import SelectDefault from "@/Components/SelectDefault.jsx";
import DataTableComponent from "@/Components/DataTable.jsx";
import ActionDropdown from "@/Components/ActionDropdown";
import {
  HiMiniEye,
  HiMiniPaperAirplane,
  HiMiniPencilSquare,
  HiMiniTrash,
} from "react-icons/hi2";

export default function Index(props) {
  const wrapperRef = React.useRef(null);
  const bookingInviteForm = React.useRef(null);

  const { flash } = usePage().props;

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
        wrapperRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [flash]);

  // const columns = [
  //     {
  //         name: "Course",
  //         selector: (row) => <>{row.course.name}</>,
  //         sortField: "name",
  //     },
  //     {
  //         name: "Status",
  //         selector: (row) => (
  //             <>
  //                 <div
  //                     className={`button-pill button-${
  //                         row.status ? "pill-green" : "pill-blue"
  //                     }`}
  //                 >
  //                     {row.status_label}
  //                 </div>
  //             </>
  //         ),
  //         sortField: "status_label",
  //     },
  //     {
  //         name: "Paid",
  //         selector: (row) => (
  //             <>
  //                 <div
  //                     className={`button-pill button-${
  //                         row.payment_status ? "pill-green" : "pill-red"
  //                     }`}
  //                 >
  //                     {row.payment_status ? "Paid" : "Not paid"}
  //                 </div>
  //             </>
  //         ),
  //         sortField: "payment_status",
  //     },
  //     {
  //         name: "Student",
  //         selector: (row) => <>{row.student ? row.student.name : ""}</>,
  //         sortField: "student.name",
  //     },
  //     {
  //         name: "Action",
  //         cell: (row, index) => (
  //             <ActionDropdown items={createActionItems(row)} index={index}/>
  //         ),
  //         ignoreRowClick: true,
  //         allowOverflow: true,
  //         button: true,
  //     },
  // ];

  const ExpandableRowComponent = ({ data }) => {
    return (
      <div className="table-details">
        {data && (
          <div className="grid grid-cols-4 gap-4 table-details-wrapper">
            <div className="flex flex-col">
              <span className="title">Description</span>
              <span className="data">
                {data.description
                  ? data.description.length > 20
                    ? `${data.description.substring(0, 20)}...`
                    : data.description
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
        icon: <HiMiniEye />,
        href: route("instructors.courses.show", { course: row.id }),
      },
      {
        label: "Assign to client",
        icon: <HiMiniPaperAirplane />,
        action: () => {
          setAssignCourseModal({
            invitation_url: row.invitation_url,
            course_id: row.id,
          });
        },
      },
      ...(row.instructor_id === props.auth.user.id
        ? [
            {
              label: "Edit",
              icon: <HiMiniPencilSquare />,
              href: route("instructors.courses.edit", { course: row.id }),
            },
          ]
        : []),
      ...(row.instructor_id === props.auth.user.id
        ? [
            {
              label: "Delete",
              icon: <HiMiniTrash />,
              color: "text-red",
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
        <ActionDropdown items={createActionItems(row)} index={index} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const assignCourse = async (data) => {
    try {
      //Validate form
      const schema = Yup.object().shape({
        student_ids: Yup.array()
          .of(Yup.string())
          .min(1, "Please select at least one sutdent.")
          .required("Please select at least one sutdent."),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      let finalData = {
        ...data,
        course_id: assignCourseModal?.course_id,
      };

      router.post(route("instructors.courses.assign-students"), finalData, {
        onSuccess: (dres) => {
          setAssignCourseModal(false);
        },
        onError: (errors) => {
          bookingInviteForm.current.setErrors(errors);
        },
      });
    } catch (err) {
      console.log(err);
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        bookingInviteForm.current.setErrors(validationErrors);
      }
    }
  };

  function deleteStudent(id) {
    router.delete(route("instructors.courses.destroy", { course: id }), {
      onSuccess: (page) => {},
      onError: (errors) => {},
      preserveState: false,
      preserveScroll: false,
    });

    setDeleteModal(false);
  }

  return (
    <>
      <Head title="Courses" />

      <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Courses
        </h1>
        <p className="mt-2 text-sm">Lorem ipsum text</p>
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

      <div className="flex justify-end mb-3">
        <Link
          href={route("instructors.courses.create")}
          className="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:ring-primary-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
        >
          Create new
        </Link>
      </div>

      <DataTableComponent
        columns={columns}
        path={route("instructors.get-instructor-courses")}
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
        status={assignCourseModal}
        close={() => setAssignCourseModal(false)}
        title={"Assign course"}
        content={
          <div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg">
                Select students you want to assign this course to
              </p>

              <Form
                ref={bookingInviteForm}
                onSubmit={assignCourse}
                className="w-full"
              >
                <SelectDefault
                  name="student_ids"
                  label="Students*"
                  isMulti
                  options={Object.entries(props.students).map(
                    ([value, label]) => ({ value, label })
                  )}
                />
              </Form>
            </div>
          </div>
        }
        footer={
          <div className="footer-modal">
            <button
              type="button"
              onClick={() => setAssignCourseModal(false)}
              className="button button-blue-outline w-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => bookingInviteForm.current.submitForm()}
              className="button button-blue w-full"
            >
              Assign
            </button>
          </div>
        }
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
              onClick={() => deleteStudent(deleteModal)}
              className="button button-blue w-full"
            >
              Delete course
            </button>
          </div>
        }
      />
    </>
  );
}
