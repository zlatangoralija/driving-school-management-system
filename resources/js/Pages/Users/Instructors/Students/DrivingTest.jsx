import {Head, Link, router} from "@inertiajs/react";
import React from "react";
import {timezoneDate} from "@/Components/Helpers.jsx";
import {FcApproval, FcCalendar, FcDisapprove, FcExpired} from "react-icons/fc";
import Modal from "@/Components/Modal.jsx";
import {Form} from "@unform/web";
import DatePicker from "react-datepicker";
import {addHours, setHours, setMilliseconds, setMinutes, setSeconds} from "date-fns";
import dayjs from "dayjs";
import * as Yup from "yup";

export default function Show(props) {
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
                student: props.student.id
            };

            router.post(route("instructors.book-driving-test"), finalData, {
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
            <Head title="Students" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Students</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            <div className="flex justify-center w-full mb-8 gap-3">
                <Link href={route('instructors.students.show', {'student': props.student})}>
                    <div className="button-pill button-pill-gray">Personal information</div>
                </Link>
                <Link href={route('instructors.student-bookings', {'student': props.student})}>
                    <div className="button-pill button-pill-gray">Bookings</div>
                </Link>
                <Link href={route('instructors.student-courses', {'student': props.student})}>
                    <div className="button-pill button-pill-gray">Courses</div>
                </Link>
                <Link href={route('instructors.student-driving-test', {'student': props.student})}>
                    <div className="button-pill button-pill-blue">Driving test</div>
                </Link>
            </div>


            {props.student.driving_test_booked ?
                <div className="card mb-8">
                    <div className="flex gap-3">
                        <FcApproval className="w-10 h-10"/>
                        <h2 className="mb-6">Driving test booked!</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex gap-4">
                            <FcCalendar className="w-10 h-10"/>
                            <div>
                                <h4>Date and time</h4>
                                <span className="text-l"><strong>{timezoneDate(props.student.driving_test_booked).format('DD/MM/YYYY H:mm')}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="card mb-8">
                    <div className="flex justify-center gap-3">
                        <FcExpired className="w-10 h-10"/>
                        <h2 className="mb-6">Driving test not booked yet!</h2>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex gap-4 te">
                            <a
                                href="#"
                                onClick={() => setDrivingTestModal(true)}
                                className="button button-blue"
                            >
                                Book driving test now
                            </a>

                        </div>
                    </div>
                </div>
            }

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
                                <div className="datepicker-wrapper small flex flex-col">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        showTimeSelect
                                        todayButton="Today"
                                        filterTime={filterPassedTime}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        form="external-form"
                                    />
                                </div>
                            </Form>
                        </div>
                    </div>
                }
                footer={
                    <div className="footer-modal">
                        <button
                            type="button"
                            onClick={() => setDrivingTestModal(false)}
                            className="button button-blue-outline w-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => drivingTestForm.current.submitForm()}
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
