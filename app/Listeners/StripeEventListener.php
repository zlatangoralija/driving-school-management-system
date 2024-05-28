<?php

namespace App\Listeners;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Invoice;
use App\Notifications\NewBookingInstructor;
use App\Notifications\NewBookingStudent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'checkout.session.completed') {

            //Per lesson payment
            if(isset($event->payload['data']['object']['metadata']['booking_id'])){
                $booking = Booking::find($event->payload['data']['object']['metadata']['booking_id']);
                if($booking){
                    $booking->status = BookingStatus::Booked;
                    $booking->payment_status = BookingPaymentStatus::Paid;
                    $booking->save();

                    Invoice::create([
                        'amount' => (float) $event->payload['data']['object']['amount_subtotal'] / 100,
                        'description' => 'Lesson payment for course: ' . $booking->course->name,
                        'student_id' => $booking->student_id,
                        'instructor_id' => $booking->instructor_id,
                        'course_id' => $booking->course->id,
                    ]);

                    //TODO: booking should be pending state still, until instructor approves it
                    if($booking->instructor){
                        $booking->instructor->notify(new NewBookingInstructor($booking));
                    }

                    if($booking->student){
                        $booking->student->notify(new NewBookingStudent($booking));
                    }
                }
            }

            //Pre paid
            if(isset($event->payload['data']['object']['metadata']['course_uuid'])){

                //First update the original booking that is beeing booked from the course
                //booked_id
                $booked = Booking::find($event->payload['data']['object']['metadata']['booked_id']);
                if($booked){
                    $booked->status = BookingStatus::Booked;
                    $booked->payment_status = BookingPaymentStatus::Paid;
                    $booked->save();

                    Invoice::create([
                        'amount' => (float) $event->payload['data']['object']['amount_subtotal'] / 100,
                        'description' => 'Payment for course: ' . $booked->course->name,
                        'student_id' => $booked->student_id,
                        'instructor_id' => $booked->instructor_id,
                        'course_id' => $booked->course->id,
                    ]);

                    //TODO: booking should be pending state still, until instructor approves it
                    if($booked->instructor){
                        $booked->instructor->notify(new NewBookingInstructor($booked));
                    }

                    if($booked->student){
                        $booked->student->notify(new NewBookingStudent($booked));
                    }
                }

                $bookings = Booking::where('uuid', $event->payload['data']['object']['metadata']['course_uuid'])
                    ->where('id', '!=', $booked->id)
                    ->get();

                if(count($bookings)){
                    foreach ($bookings as $booking){
                        $booking->payment_status = BookingPaymentStatus::Paid;
                        $booking->save();
                    }
                }
            }
        }
    }
}
