import React from "react";
import {Head, router, usePage} from "@inertiajs/react";
import DatePicker from "react-datepicker";
import {addHours, setHours, setMilliseconds, setMinutes, setSeconds} from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import moment from "moment-timezone";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {timezoneDate, userTimezone} from "@/Components/Helpers.jsx";

const guess_tz = moment.tz.guess();
const user_timezone = userTimezone();
const tz = user_timezone ? user_timezone : guess_tz;
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(tz);

export default function Book(props) {
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [bookingModal, setBookingModal] = React.useState(false);

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

    const book = async(data) => {
        try{
            //Get invitation ID, if student is coming to book from invitation
            let invitation_id = null;
            let booking_id = props.booking.id
            const search = window.location.search;
            const params = new URLSearchParams(search);
            if(search && params){
                invitation_id = params.get('invitation_id');
            }

            let finalData = {
                start_time: data,
                course: props.course.id,
                invitation_id: invitation_id,
            }

            if(booking_id){
                router.patch(route('instructors.bookings.update', {'booking': booking_id}), finalData, {
                    onError: (errors) => {
                        console.log(errors);
                    }
                })
            }else{
                router.post(route('instructors.bookings.store'), finalData, {
                    onError: (errors) => {
                        console.log(errors);
                    }
                })
            }

            return

        } catch (err) {
            console.log(err);
            wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
        }

    }

    React.useEffect(()=>{
        if(flash && Object.keys(flash).length){
            if(flash.success){
                setSuccessNotice(flash.success)
            }

            if(flash.errors){
                setBookingModal(false)
                setErrorNotice(flash.errors)
            }

            if(successNotice || errorNotice){
                wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    },[flash])

    return (
        <>
            <Head title={"Book " + props.course.name}/>

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{"Book " + props.course.name}</h1>
                <p className="mt-2 text-sm">
                    {props.course.description}
                </p>
            </div>


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

            <div>
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

            <button type="button" onClick={() => setBookingModal(true)}>Book now</button>


            <Modal
                className="max-w-3xl"
                status={bookingModal}
                close={()=>setBookingModal(false)}
                title={"Confirm booking"}
                content={
                    <div className='flex flex-col justify-center items-center'>
                        <p className="text-lg">You're about to book {props.course.name}</p>
                        <p>Booking details:</p>
                        <ul>
                            <li>Start: {timezoneDate(startDate).format('DD/MM/YYYY H:mm')}</li>
                        </ul>
                    </div>
                }
                footer={
                    <div className="w-full flex justify-between items-center">
                        <button type="button" onClick={()=>setBookingModal(false)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                        <button type="button" onClick={()=> book(startDate)} className="_button w-full md:w-auto min-w-[150px]">Confirm</button>
                    </div>
                }
            />
        </>
    );
}
