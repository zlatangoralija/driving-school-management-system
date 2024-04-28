import React from "react";
import {Head, router, usePage} from "@inertiajs/react";
import DatePicker from "react-datepicker";
import { addHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Modal from "@/Components/Modal.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function Book(props) {
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [bookingModal, setBookingModal] = React.useState(false);

    const [startDate, setStartDate] = React.useState(() => {
        // Get the current date
        const currentDate = new Date();

        // Add one hour
        const plusOneHour = addHours(currentDate, 1);

        // Set minutes, seconds, and milliseconds to zero for a clean start
        const cleanStart = setMilliseconds(setSeconds(setMinutes(plusOneHour, 0), 0), 0);

        return cleanStart; // This will be the initial state for `startDate`
    });

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };


    const submit = async(data) => {
        try{

            //Get invitation ID, if student is coming to book from invitation
            let invitation_id = null;
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

            router.post(route('students.bookings.store'), finalData, {
                onError: (errors) => {
                    console.log(errors);
                }
            })

            return

        } catch (err) {
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
                            <li>Start:</li>
                        </ul>
                    </div>
                }
                footer={
                    <div className="w-full flex justify-between items-center">
                        <button type="button" onClick={()=>setBookingModal(false)} className="_button white w-full md:w-auto min-w-[150px]">Cancel</button>
                        <button type="button" onClick={()=>submit(startDate)} className="_button w-full md:w-auto min-w-[150px]">Confirm</button>
                    </div>
                }
            />
        </>
    );
}
