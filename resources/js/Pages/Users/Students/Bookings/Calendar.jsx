import {Head, Link} from "@inertiajs/react";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from "dayjs";
import Modal from "@/Components/Modal.jsx";
import moment from 'moment-timezone';
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

const roundMinutesToNearestTen = (time) => {
    const minutes = time.minute(); // Get the minutes
    const roundedMinutes = Math.round(minutes / 10) * 10; // Round to nearest 10
    return time.minute(0).second(0); // Set rounded minutes and reset seconds
};

export default function Calendar(props) {
    const [eventModal, setEventModal] = React.useState(null);

    const tz = moment.tz.guess();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(tz);

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
                    <Link href={route('students.bookings.index')}>Table view</Link>

                </div>
            </div>

            <FullCalendar
                plugins={[momentTimezonePlugin, timeGridPlugin ]}
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
                events={props.bookings}
                slotDuration='00:10:00'
                nowIndicator
                eventDisplay="block"
                expandRows={true}
                slotEventOverlap={false}
                scrollTime={formatted}
                timeZone={tz}
                eventClick={(info) => {
                    setEventModal(info.event)
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
                                <li>Start: {dayjs(eventModal.start).tz(tz).format('DD/MM/YYYY H:mm')}</li>
                                <li>End: {dayjs(eventModal.end).tz(tz).format('DD/MM/YYYY H:mm')}</li>
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
        </>
    );
}

