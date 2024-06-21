import { Head } from "@inertiajs/react";

export default function Dashboard(props) {
  return (
    <>
      <Head title="Dashboard" />

      <div className="mx-auto mt-6 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Hello, {props.auth.user.name}
        </h1>
        <p className="mt-2 text-sm">Lorem ipsum text</p>
      </div>

      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card">
            <dt className="truncate text-sm font-medium">Courses</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              1
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium">Students</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              2
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              3
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
