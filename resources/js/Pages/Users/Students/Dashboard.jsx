import { Head, router } from "@inertiajs/react";
import React from "react";
import { Form } from "@unform/web";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import {
  addHours,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import dayjs from "dayjs";
import {
  FcAlarmClock,
  FcCalendar,
  FcApproval,
  FcMoneyTransfer,
} from "react-icons/fc";

// helpers
import { timezoneDate } from "@/Components/Helpers.jsx";

// components
import ProgressBarOutside from "@/Components/ProgressOutside";
import ProgressBarInside from "@/Components/ProgressInside";
import Modal from "@/Components/Modal.jsx";

export default function Dashboard(props) {
  const [drivingTestModal, setDrivingTestModal] = React.useState(false);
  const drivingTestForm = React.useRef(null);
  const [startDate, setStartDate] = React.useState(() => {
    const currentDate = new Date();
    const plusOneHour = addHours(currentDate, 1);
    return setMilliseconds(setSeconds(setMinutes(plusOneHour, 0), 0), 0);
  });

  let isTimeInArray = false;
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    if (props.excluded_slots && props.excluded_slots.length) {
      const excluded = props.excluded_slots.map((time) =>
        setHours(setMinutes(new Date(time.date), time.minutes), time.hours)
      );

      const convertedDates = excluded.map((dateStr) => {
        const originalFormat = "YYYY-MM-DD HH:mm:ss";
        const parsedDate = dayjs(
          dateStr,
          "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
        ).format(originalFormat);
        const muscatDate = dayjs.utc(parsedDate, originalFormat).tz(tz);
        return muscatDate.toDate();
      });

      isTimeInArray = convertedDates.some(
        (date) => date.getTime() === time.getTime()
      );
    }
    return !isTimeInArray && currentDate.getTime() < selectedDate.getTime();
  };

  const bookDrivingTest = async (data) => {
    try {
      let finalData = {
        start_time: startDate,
      };

      router.post(route("students.book-driving-test"), finalData, {
        onSuccess: (res) => {
          setDrivingTestModal(false);
        },
        onError: (errors) => {
          drivingTestForm.current.setErrors(errors);
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
            <dt className="truncate text-sm font-medium">Courses</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.courses_count}
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

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card mb-8">
          <ProgressBarOutside
            title="Lessons finished"
            info="Active"
            label="307 of 859 Pupils"
            percentage={props.finished_courses_percentage}
          />
        </div>
        <div className="card mb-8">
          <ProgressBarOutside
            title="Lessons paid"
            info="Last 12 Months"
            label="237 of 363 Successful"
            percentage={props.paid_courses_percentage}
          />
        </div>
      </div> */}

      {/*<div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">*/}
      {/*    <div className="button-pill button-pill-orange">*/}
      {/*        Test Test Test Test*/}
      {/*    </div>*/}
      {/*    <div className="button-pill button-pill-blue">Test</div>*/}
      {/*    <div className="button-pill button-pill-green">Test</div>*/}
      {/*    <div className="button-pill button-pill-red">Test</div>*/}
      {/*    <div className="button-pill button-pill-gray">Test</div>*/}
      {/*    <div className="button-pill button-pill-gradiant">Test</div>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">*/}
      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">*/}
      {/*        <div className="card card-orange">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-green">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-red">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*        <div className="card card-blue">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">*/}
      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">*/}
      {/*        <div className="card card-gradiant">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gradiant">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">*/}
      {/*    <div className="card">*/}
      {/*        <div className="flex items-center gap-4">*/}
      {/*            <FcAlarmClock className="w-10 h-10"/>*/}
      {/*            <div className="flex flex-col">*/}
      {/*                <span className="font-bold text-2xl">517</span>*/}
      {/*                <span className="text-gray-600">Schedule</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div className="card min-h-44">*/}
      {/*        <div className="flex items-center gap-4">*/}
      {/*            <FcCalendar className="w-10 h-10"/>*/}
      {/*            <div className="flex flex-col">*/}
      {/*                <span className="font-bold text-2xl">517</span>*/}
      {/*                <span className="text-gray-600">Schedule</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<div className="card mb-8">*/}
      {/*    <h2 className="mb-6">Title</h2>*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-8">*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={20}/>*/}
      {/*    </div>*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={70}/>*/}
      {/*    </div>*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={90}/>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<div className="flex gap-5 mb-8">*/}
      {/*    <ProgressBarInside percentage={20}/>*/}
      {/*    <ProgressBarInside percentage={70}/>*/}
      {/*    <ProgressBarInside percentage={90}/>*/}
      {/*</div>*/}

      {/*<div className="bg-white shadow sm:rounded-lg mb-3">*/}
      {/*    <div className="px-4 py-5 sm:p-6">*/}
      {/*        <h3 className="text-base font-semibold leading-6 text-gray-900">*/}
      {/*            Driving test*/}
      {/*        </h3>*/}
      {/*        <div className="mt-5">*/}
      {/*            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">*/}
      {/*                <h4 className="sr-only">Driving test</h4>*/}
      {/*                {props.auth.user.driving_test_booked ? (*/}
      {/*                    <>*/}
      {/*                        <p>Your driving test date is:.</p>*/}
      {/*                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">*/}
      {/*                            {timezoneDate(props.auth.user.driving_test_booked).format(*/}
      {/*                                "DD/MM/YYYY H:mm"*/}
      {/*                            )}*/}
      {/*                        </div>*/}
      {/*                    </>*/}
      {/*                ) : (*/}
      {/*                    <>*/}
      {/*                        <p>You haven't booked your driving test yet.</p>*/}
      {/*                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">*/}
      {/*                            <a*/}
      {/*                                href={"#"}*/}
      {/*                                onClick={() => setDrivingTestModal(true)}*/}
      {/*                                type="button"*/}
      {/*                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"*/}
      {/*                            >*/}
      {/*                                Book now*/}
      {/*                            </a>*/}
      {/*                        </div>*/}
      {/*                    </>*/}
      {/*                )}*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      <Modal
        className="max-w-3xl"
        status={drivingTestModal}
        close={() => setDrivingTestModal(false)}
        title={"Confirm booking"}
        content={
          <div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg">Select date of your driving test</p>

              <Form
                ref={drivingTestForm}
                onSubmit={bookDrivingTest}
                className="w-full text-center"
              >
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  todayButton="Today"
                  filterTime={filterPassedTime}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  form="external-form"
                />
              </Form>
            </div>
          </div>
        }
        footer={
          <div className="w-full flex justify-between items-center">
            <button
              type="button"
              onClick={() => setDrivingTestModal(false)}
              className="_button white w-full md:w-auto min-w-[150px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => drivingTestForm.current.submitForm()}
              className="_button w-full md:w-auto min-w-[150px]"
            >
              Confirm
            </button>
          </div>
        }
      />
    </>
  );
}
