<?php

namespace App\Models;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class CourseUser extends Model
{
    use HasFactory;

    protected $table = 'course_user';

    protected $appends = [
        'paid_courses_percentage',
        'paid_courses',
        'booked_lessons',
        'booked_lessons_percentage',
        'finished_lessons_percentage',
    ];

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function student(){
        return $this->belongsTo(User::class, 'user_id');
    }

    protected function paidCourses(): Attribute
    {
        return new Attribute(
            get: function (){
                $bookingsCount = Booking::where('uuid', $this->uuid)->count();
                $paidCount = Booking::where('uuid', $this->uuid)->where('payment_status', BookingPaymentStatus::Paid)->count();

                return $paidCount . '/' . $bookingsCount;
            },
        );
    }

    protected function paidCoursesPercentage(): Attribute
    {
        return new Attribute(
            get: function (){
                $bookingsCount = Booking::where('uuid', $this->uuid)->count();
                $paidCount = Booking::where('uuid', $this->uuid)->where('payment_status', BookingPaymentStatus::Paid)->count();

                if($bookingsCount) {
                    return ($paidCount / $bookingsCount) * 100;
                }

                return 0;
            },
        );
    }

    protected function bookedLessons(): Attribute
    {
        return new Attribute(
            get: function (){
                $bookingsCount = Booking::where('uuid', $this->uuid)->count();
                $bookedCount = Booking::where('uuid', $this->uuid)->where('status', BookingStatus::Booked)->count();

                return $bookedCount . '/' . $bookingsCount;
            },
        );
    }

    protected function bookedLessonsPercentage(): Attribute
    {
        return new Attribute(
            get: function (){
                $bookingsCount = Booking::where('uuid', $this->uuid)->count();
                $bookedCount = Booking::where('uuid', $this->uuid)->where('status', BookingStatus::Booked)->count();

                if($bookingsCount){
                    return ($bookedCount / $bookingsCount) * 100;
                }

                return 0;
            },
        );
    }

    protected function finishedLessonsPercentage(): Attribute
    {
        return new Attribute(
            get: function (){
                $bookingsCount = Booking::where('uuid', $this->uuid)
                    ->where('start_time', '<=', Carbon::now())
                    ->count();
                $bookedCount = Booking::where('uuid', $this->uuid)
                    ->where('status', BookingStatus::Booked)->count();

                if($bookingsCount){
                    return ($bookedCount / $bookingsCount) * 100;
                }

                return 0;
            },
        );
    }
}
