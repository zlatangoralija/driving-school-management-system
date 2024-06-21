import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Form } from "@unform/web";
import * as Yup from "yup";

// components
import ActionDropdown from "@/Components/ActionDropdown";
import DataTableComponent from "@/Components/DataTable.jsx";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import SelectDefault from "@/Components/SelectDefault.jsx";
import { timezoneDate } from "@/Components/Helpers.jsx";

export default function Index(props) {
  const wrapperRef = React.useRef(null);
  const bookingInviteForm = React.useRef(null);

  const { flash } = usePage().props;

  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState();
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [assignCourseModal, setAssignCourseModal] = React.useState(false);

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

  const columns = [
    {
      name: "Name",
      selector: (row) => <>{row.name}</>,
      // sortable: true,
      sortField: "name",
    },
    // {
    //   name: "description",
    //   selector: (row) => (
    //     <>
    //       {row.description.length > 20
    //         ? `${row.description.substring(0, 20)}...`
    //         : row.description}
    //     </>
    //   ),
    //   sortField: "description",
    // },
    {
      name: "No. of lessons",
      selector: (row) => <>{row.number_of_lessons}</>,
      // sortable: true,
      sortField: "number_of_lessons",
    },
    {
      name: "Duration",
      selector: (row) => <>{row.duration ? row.duration + " minutes" : ""}</>,
      // sortable: true,
      sortField: "duration",
    },
    // {
    //   name: "Payment option",
    //   selector: (row) => <>{row.payment_option_label}</>,
    //   // sortable: true,
    //   sortField: "payment_option",
    // },
    {
      name: "Price",
      selector: (row) => <>${row.price}</>,
      // sortable: true,
      sortField: "price",
    },
    {
      name: "Created by",
      selector: (row) => (
        <>{row.admin ? row.admin.name : row.instructor.name}</>
      ),
      // sortable: true,
      sortField: "price",
    },
    // {
    //   name: "Date created",
    //   selector: (row) => (
    //     <>{timezoneDate(row.created_at).format("DD/MM/YYYY HH:mm")}</>
    //   ),
    //   // sortable: true,
    //   sortField: "created_at",
    // },
    // {
    //   name: "Assign client",
    //   selector: (row) => (
    //     <>
    //       <a
    //         href="#"
    //         onClick={() =>
    //           setAssignCourseModal({
    //             invitation_url: row.invitation_url,
    //             course_id: row.id,
    //           })
    //         }
    //         className="link"
    //       >
    //         Assign to students
    //       </a>
    //     </>
    //   ),
    //   // sortable: null,
    //   sortField: null,
    // },

    {
      name: "Action",
      cell: (row, index) => (
        <ActionDropdown
          row={row}
          index={index}
          auth={props.auth.user.id}
          setDeleteModal={setDeleteModal}
        />
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
          <div className="grid grid-cols-5 gap-4 table-details-wrapper">
            <div className="flex flex-col">
              <span className="title">Description</span>
              <span className="data">
                {data.description.length > 20
                  ? `${data.description.substring(0, 20)}...`
                  : data.description}
              </span>
            </div>
            {/* <div className="flex flex-col">
              <span className="title">Created by</span>
              <span className="data">
                {data.admin ? data.admin.name : data.instructor.name}
              </span>
            </div> */}
            <div className="flex flex-col">
              <span className="title">Payment option</span>
              <span className="data">{data.payment_option_label}</span>
            </div>
            <div className="flex flex-col">
              <span className="title">Assign clien</span>
              <a
                href="#"
                onClick={() =>
                  setAssignCourseModal({
                    invitation_url: data.invitation_url,
                    course_id: data.id,
                  })
                }
                className="link data"
              >
                Assign to students
              </a>
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
          className="button button-blue"
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
              <p className="text-lg text-center">
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
              className="w-full button button-blue-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => bookingInviteForm.current.submitForm()}
              className="button button-blue w-full"
            >
              Assing
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
            <p className="text-lg text-center">
              Are you sure you want to delete this course?
            </p>
          </div>
        }
        footer={
          <div className="footer-modal">
            <button
              type="button"
              onClick={() => setDeleteModal(null)}
              className="w-full button button-blue-outline"
            >
              Back to course
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
