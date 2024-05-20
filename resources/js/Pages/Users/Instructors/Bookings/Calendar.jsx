import {Head, Link, router, usePage} from "@inertiajs/react";
import React, {useRef} from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import moment from 'moment-timezone';
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import {timezoneDate} from "@/Components/Helpers.jsx";
import SelectDefault from "@/Components/SelectDefault.jsx";
import {Form} from "@unform/web";
import * as Yup from "yup";
import FlashNotification from "@/Components/FlashNotification.jsx";

const roundMinutesToNearestTen = (time) => {
    const minutes = time.minute(); // Get the minutes
    const roundedMinutes = Math.round(minutes / 10) * 10; // Round to nearest 10
    return time.minute(0).second(0); // Set rounded minutes and reset seconds
};

const tz = moment.tz.guess();

export default function Calendar(props) {
    const calendarRef = useRef(null);
    const formRef = React.useRef(null);
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)
    const [eventModal, setEventModal] = React.useState(null);
    const [bookingModal, setBookingModal] = React.useState(null);
    const [courseID, setCourseID] = React.useState(props.course_id ? props.course_id : null);
    const [studentID, setStudentID] = React.useState(props.student_id ? props.student_id : null);
    const [courseName, setCourseName] = React.useState(props.course_name ? props.course_name : null);

    React.useEffect(()=>{
        if(flash && Object.keys(flash).length){
            if(flash.success){
                setSuccessNotice(flash.success)
            }

            if(flash.errors){
                setErrorNotice(flash.errors)
            }

            if(successNotice || errorNotice){
                wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    },[flash])

    const bookings = props.bookings.map(booking => ({
        ...booking,
        start: timezoneDate(booking.start).format('YYYY-MM-DD HH:mm:ss'),
        end: timezoneDate(booking.end).format('YYYY-MM-DD HH:mm:ss')
    }));

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, // Set the desired timezone
        hour: '2-digit',
        minute: '2-digit',
    });

    const now = new Date(); // Get the current date and time
    const formattedDate = formatter.format(now); // Format it using the formatter

    const [hours, minutes] = formattedDate.split(':').map(Number); // Split and convert to numbers
    const parsedDayjs = dayjs().hour(hours).minute(minutes);

    const oneHourAgo = parsedDayjs.subtract(1, 'hour');
    const roundedTime = roundMinutesToNearestTen(oneHourAgo);
    const formatted = roundedTime.format('HH:mm');

    const submitBookingForm = async() => {
        try{
            const formData = formRef.current.getData();

            // Remove all previous errors
            formRef.current.setErrors({});

            const schema = Yup.object().shape({
                course_id: Yup.array().required('Please select course.').min(1, 'Please select course.'),
                student_id: Yup.array().required('Please select student.').min(1, 'Please select student.'),
            });

            await schema.validate(formData, {
                abortEarly: false,
            });

            let finalData = {
                ...formData,
                start_time: bookingModal.start,
                course_id: formData.course_id.length>0 ? formData.course_id[0].value : null,
                student_id: formData.student_id.length>0 ? formData.student_id[0].value : null,
            }

            console.log(finalData)
            router.post(route('instructors.bookings.store'), finalData, {
                onSuccess: (res) => {
                    setBookingModal(false)
                },
                onError: (errors) => {
                    console.log(errors);
                    formRef.current.setErrors(errors);
                }
            })

            return

        } catch (err) {
            console.log(err)
            const validationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                formRef.current.setErrors(validationErrors);
            }

        }

    }

    return (
        <>
            <Head title="Bookings" />

            <div className="mx-auto mt-6 mb-10">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Bookings</h1>
                        <p className="mt-2 text-sm">
                            Lorem ipsum text
                        </p>
                    </div>
                    <Link href={route('instructors.bookings.index')}>Table view</Link>

                </div>
            </div>

            <div ref={wrapperRef}>
                {successNotice && flash.success &&
                    <FlashNotification
                        type="success"
                        title={flash.success}
                    />
                }

                {errorNotice && flash &&
                    <FlashNotification
                        type="error"
                        title="Please fix the following errors"
                        list={errorNotice}
                        button={<button type="button" className="_button small !whitespace-nowrap" onClick={()=>setErrorNotice(null)}>close</button>}
                    />
                }
            </div>

            <FullCalendar
                ref={calendarRef}
                plugins={[momentTimezonePlugin, timeGridPlugin, interactionPlugin ]}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }}
                allDaySlot={false}
                initialView="timeGridWeek"
                events={bookings}
                slotDuration='00:10:00'
                nowIndicator
                eventDisplay="block"
                expandRows={true}
                slotEventOverlap={false}
                scrollTime={formatted}
                timeZone={tz}
                selectable
                selectAllow={(info) => {
                    return (info.start >= new Date());
                }}
                select={(info) => {
                    let start_time = moment(info.start);
                    let end_time = moment(info.end);
                    let diff = end_time.diff(start_time, "minutes");

                    if (diff > 10) {
                        if (calendarRef.current) {
                            calendarRef.current.getApi().unselect();
                        }
                        return false;
                    }

                    setBookingModal({
                        'start': start_time,
                        'course_id': courseID,
                        'student_id': studentID,
                        'title': courseName,
                    })
                }}
                eventClick={(info) => {
                    setBookingModal(info.event)
                }}
            />

            {eventModal &&
                <Modal
                    className="max-w-3xl"
                    status={eventModal}
                    close={()=>setEventModal({})}
                    title={"Event details"}
                    content={
                        <div className='flex flex-col justify-center items-center'>
                            <p className="text-lg">Here are the event details:</p>
                            <ul>
                                <li>Event: {eventModal.title}</li>
                                <li>Start: {timezoneDate(eventModal.start).format('DD/MM/YYYY H:mm')}</li>
                                <li>End: {timezoneDate(eventModal.end).format('DD/MM/YYYY H:mm')}</li>
                            </ul>
                        </div>
                    }
                    footer={
                        <div className="w-full flex justify-between items-center">
                            <button type="button" onClick={()=>setEventModal(null)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                        </div>
                    }
                />
            }


            {bookingModal &&
                <Modal
                    className="max-w-3xl"
                    status={bookingModal}
                    close={()=>setBookingModal({})}
                    title={"Event details"}
                    content={
                        <div className='flex flex-col justify-center items-center'>
                            <p className="text-lg">Booking following event:</p>
                            <ul>
                                <li>Event: {bookingModal.title}</li>
                                <li>Start: {timezoneDate(bookingModal.start).format('DD/MM/YYYY H:mm')}</li>
                                <li>End: {timezoneDate(bookingModal.end).format('DD/MM/YYYY H:mm')}</li>
                            </ul>

                            <Form ref={formRef} onSubmit={submitBookingForm} className="w-full">
                                <SelectDefault
                                    name="student_id"
                                    label="Student*"
                                    defaultValue={props.students && studentID ? Object.entries(props.students).map(([value, label]) => ({ value, label })).find(x => x.value===studentID) : null}
                                    options={Object.entries(props.students).map(([value, label]) => ({ value, label }))}
                                    onChange={(e) => setStudentID(e.value)}
                                />

                                <SelectDefault
                                    name="course_id"
                                    label="Course*"
                                    defaultValue={props.courses && courseID ? Object.entries(props.courses).map(([value, label]) => ({ value, label })).find(x => x.value===courseID) : null}
                                    options={Object.entries(props.courses).map(([value, label]) => ({ value, label }))}
                                    onChange={(e) => setCourseID(e.value)}
                                />
                            </Form>
                        </div>
                    }
                    footer={
                        <div className="w-full flex justify-between items-center">
                            <button type="button" onClick={()=>setBookingModal(null)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                            <button type="button" onClick={()=>formRef.current.submitForm()} className="_button white w-full md:w-auto min-w-[150px]">Book</button>
                        </div>
                    }
                />
            }
        </>
    );
}

