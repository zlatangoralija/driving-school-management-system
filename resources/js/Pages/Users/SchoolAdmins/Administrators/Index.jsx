import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import DataTableComponent from "@/Components/DataTable.jsx";
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import { timezoneDate } from "@/Components/Helpers.jsx";
import ActionDropdown from "@/Components/ActionDropdown.jsx";
import { HiMiniEye, HiMiniPencilSquare, HiMiniTrash } from "react-icons/hi2";

export default function Index(props) {
  const wrapperRef = React.useRef(null);
  const { flash } = usePage().props;

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
        wrapperRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [flash]);

  const createActionItems = (row) => {
    return [
      {
        label: "View",
        icon: <HiMiniEye />,
        href: route("school-administrators.administrators.show", {
          administrator: row.id,
        }),
      },
      {
        label: "Edit",
        icon: <HiMiniPencilSquare />,
        href: route("school-administrators.administrators.edit", {
          administrator: row.id,
        }),
      },
      ...(props.auth.user.id != row.id
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
      name: "email",
      selector: (row) => <>{row.email}</>,
      sortable: true,
      sortField: "email",
    },
    {
      name: "Account status",
      selector: (row) => (
        <>
          <div
            className={`button-pill button-pill-${
              row.status == 1 ? "green-status" : "red-status"
            }`}
          >
            {row.status_label}
          </div>
        </>
      ),
      sortable: true,
      sortField: "status",
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
      cell: (row, index) => (
        <ActionDropdown items={createActionItems(row)} index={index} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  function deleteAdmin(id) {
    router.delete(
      route("school-administrators.administrators.destroy", {
        administrator: id,
      }),
      {
        onSuccess: (page) => {},
        onError: (errors) => {},
        preserveState: false,
        preserveScroll: false,
      }
    );

    setDeleteModal(false);
  }

  return (
    <>
      <Head title="Administrators" />

      <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Administrators
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
          href={route("school-administrators.administrators.create")}
          className="button button-blue"
        >
          Create new
        </Link>
      </div>

      <DataTableComponent
        columns={columns}
        path={route("school-administrators.get-school-administrators")}
        search={search}
        object={"administrators"}
        pagination={true}
        filters={filters}
        onlyReload="administrators"
      />

      <Modal
        className="max-w-3xl"
        status={deleteModal}
        close={() => setDeleteModal(null)}
        title={"Delete this administrator?"}
        content={
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg">
              Are you sure you want to delete this administrator?
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
              onClick={() => deleteAdmin(deleteModal)}
              className="button button-blue w-full"
            >
              Confirm
            </button>
          </div>
        }
      />
    </>
  );
}
