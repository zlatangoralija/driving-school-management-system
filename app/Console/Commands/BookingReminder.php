<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\InstructorBookingReminder1hr;
use App\Notifications\InstructorBookingReminder24hr;
use App\Notifications\StudentBookingReminder1hr;
use App\Notifications\StudentBookingReminder24hr;
use Carbon\Carbon;
use Illuminate\Console\Command;

class BookingReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:booking-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $bookings = Booking::whereNotNull('start_time')
            ->whereDate('start_time', '>=', Carbon::now())
            ->get();

        if(count($bookings)){
            foreach ($bookings as $booking){

                $bookingStartStudent = Carbon::parse($booking->start_time)
                    ->timezone($booking->student->timezone ?: 'UTC');

                $bookingStartInstructor = Carbon::parse($booking->start_time)
                    ->timezone($booking->instructor->timezone ?: 'UTC');

                $currentStudentTime = Carbon::now()->timezone($booking->student->timezone ?: 'UTC');
                $currentInstructorTime = Carbon::now()->timezone($booking->instructor->timezone ?: 'UTC');


                if ((int)round($currentStudentTime->diffInHours($bookingStartStudent, true)) == 24 && $currentStudentTime->lessThan($bookingStartStudent)) {
                    if(!$booking->reminder_24hr_student){
                        $booking->student->notify(new StudentBookingReminder24hr($booking));
                        $booking->reminder_24hr_student = true;
                        $booking->save();
                    }
                }

                if ((int)round($currentStudentTime->diffInHours($bookingStartStudent, true)) == 1 && $currentStudentTime->lessThan($bookingStartStudent)) {
                    if(!$booking->reminder_1hr_student){
                        $booking->student->notify(new StudentBookingReminder1hr($booking));
                        $booking->reminder_1hr_student = true;
                        $booking->save();
                    }
                }

                if ((int)round($currentInstructorTime->diffInHours($bookingStartInstructor, true)) == 24 && $currentInstructorTime->lessThan($bookingStartInstructor)) {
                    if(!$booking->reminder_24hr_instructor) {
                        $booking->instructor->notify(new InstructorBookingReminder24hr($booking));
                        $booking->reminder_24hr_instructor = true;
                        $booking->save();
                    }
                }

                if ((int)round($currentInstructorTime->diffInHours($bookingStartInstructor, true)) == 1 && $currentInstructorTime->lessThan($bookingStartInstructor)) {
                    if(!$booking->reminder_1hr_instructor){
                        $booking->instructor->notify(new InstructorBookingReminder1hr($booking));
                        $booking->reminder_1hr_instructor = true;
                        $booking->save();
                    }

                }
            }
        }
    }
}
