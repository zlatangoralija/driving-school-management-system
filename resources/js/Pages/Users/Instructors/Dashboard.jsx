import { Head } from "@inertiajs/react";
import React from "react";
import ProgressBarOutside from "@/Components/ProgressOutside.jsx";
import { FcAlarmClock, FcMoneyTransfer } from "react-icons/fc";
import { timezoneDate } from "@/Components/Helpers.jsx";

export default function Dashboard(props) {
  return (
    <>
      <Head title="Dashboard" />

      <div className="mb-10 mt-7">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Hello, {props.auth.user.name}
        </h3>
      </div>

      <div className="mb-8">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card card-blue-light">
            <dt className="truncate text-sm font-medium">Students</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.students_count}
            </dd>
          </div>

          <div className="card card-blue">
            <dt className="truncate text-sm font-medium">Total bookings</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.total_booking_count}
            </dd>
          </div>

          <div className="card card-gray">
            <dt className="truncate text-sm font-medium">Upcoming bookings</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.upcoming_booking_count}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card mb-8">
          <ProgressBarOutside
            label="Lessons finished"
            percentage={props.finished_courses_percentage}
            text={`(${props.finished_bookings_count} / ${props.bookings_count})`}
          />
        </div>
        <div className="card mb-8">
          <ProgressBarOutside
            label="Lessons paid"
            percentage={props.paid_courses_percentage}
            text={`(${props.paid_bookings_count} / ${props.bookings_count})`}
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
                      Time:{" "}
                      <strong>
                        {timezoneDate(props.upcoming_booking.start_time).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </strong>
                    </span>
                    <span className="text-gray-600">
                      Student:{" "}
                      <strong>{props.upcoming_booking.student.name}</strong>
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
                      Date:{" "}
                      <strong>
                        {timezoneDate(props.latest_invoice.created_at).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </strong>
                    </span>
                    <span className="text-gray-600">
                      Amount: <strong>{props.latest_invoice.amount} EUR</strong>
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
    </>
  );
}
