import {Head, router} from '@inertiajs/react';
import React from "react";
import {timezoneDate} from "@/Components/Helpers.jsx";
import Modal from "@/Components/Modal.jsx";
import {Form} from "@unform/web";
import SelectDefault from "@/Components/SelectDefault.jsx";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import {addHours, setHours, setMilliseconds, setMinutes, setSeconds} from "date-fns";
import dayjs from "dayjs";

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

        if(props.excluded_slots && props.excluded_slots.length){
            const excluded = props.excluded_slots.map(time => setHours(setMinutes(new Date(time.date), time.minutes), time.hours))

            const convertedDates = excluded.map(dateStr => {
                const originalFormat = 'YYYY-MM-DD HH:mm:ss';
                const parsedDate = dayjs(dateStr, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format(originalFormat);
                const muscatDate = dayjs.utc(parsedDate, originalFormat).tz(tz);
                return muscatDate.toDate();
            });

            isTimeInArray = convertedDates.some(date => date.getTime() === time.getTime());
        }
        return !isTimeInArray && currentDate.getTime() < selectedDate.getTime();
    };

    const bookDrivingTest = async(data) => {
        try {

            let finalData = {
                start_time: startDate,
            }

            router.post(route('students.book-driving-test'), finalData, {
                onSuccess: (res) => {
                    setDrivingTestModal(false);
                },
                onError: (errors) => {
                    drivingTestForm.current.setErrors(errors);
                }
            })


        } catch (err){
            console.log(err);
            const validationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                bookingInviteForm.current.setErrors(validationErrors);
            }
        }
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 text-gray-900">You're logged in as student!</div>

            <div className="bg-white shadow sm:rounded-lg mb-3">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Driving test</h3>
                    <div className="mt-5">
                        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                            <h4 className="sr-only">Driving test</h4>
                            {props.auth.user.driving_test_booked
                                ?
                                    <>
                                        <p>Your driving test date  is:.</p>
                                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                            {timezoneDate(props.auth.user.driving_test_booked).format('DD/MM/YYYY H:mm')}
                                        </div>
                                    </>
                                :
                                    <>
                                        <p>You haven't booked your driving test yet.</p>
                                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                            <a href={'#'}
                                               onClick={() => setDrivingTestModal(true)}
                                               type="button"
                                               className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Book now
                                            </a>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="max-w-3xl"
                status={drivingTestModal}
                close={()=>setDrivingTestModal(false)}
                title={"Confirm booking"}
                content={
                    <div>
                        <div className='flex flex-col justify-center items-center'>

                            <p className="text-lg">
                                Select date of your driving test
                            </p>

                            <Form ref={drivingTestForm} onSubmit={bookDrivingTest} className="w-full text-center">
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
                        <button type="button" onClick={()=>setDrivingTestModal(false)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                        <button type="button" onClick={()=>drivingTestForm.current.submitForm()} className="_button w-full md:w-auto min-w-[150px]">Confirm</button>
                    </div>
                }
            />
        </>
    );
}
