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
import {timezoneDate, userTimezone} from "@/Components/Helpers.jsx";

const roundMinutesToNearestTen = (time) => {
    const minutes = time.minute(); // Get the minutes
    const roundedMinutes = Math.round(minutes / 10) * 10; // Round to nearest 10
    return time.minute(0).second(0); // Set rounded minutes and reset seconds
};

export default function Calendar(props) {
    const [eventModal, setEventModal] = React.useState(null);

    const guess_tz = moment.tz.guess();
    const user_timezone = userTimezone();
    const tz = user_timezone ? user_timezone : guess_tz;

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(user_timezone ? user_timezone : guess_tz);

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
                </div>
            </div>

            <div className="flex justify-center w-full mb-8 gap-3">
                <Link href={route("school-administrators.bookings-calendar")}>
                    <div className="button-pill button-pill-blue">Calendar view</div>
                </Link>
                <Link href={route("school-administrators.bookings.index")}>
                    <div className="button-pill button-pill-gray">Table view</div>
                </Link>
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
                timeZone={timezone}
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
                                <li>Start: {timezoneDate(eventModal.start).format('DD/MM/YYYY H:mm')}</li>
                                <li>End: {timezoneDate(eventModal.end).format('DD/MM/YYYY H:mm')}</li>
                            </ul>
                        </div>
                    }
                    footer={
                        <div className="footer-modal">
                            <button
                                type="button"
                                onClick={()=>setEventModal(null)}
                                className="button button-blue-outline w-full"
                            >
                                Cancel
                            </button>
                        </div>
                    }
                />
            }
        </>
    );
}

