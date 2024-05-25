<?php

namespace App\Models;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class CourseUser extends Model
{
    use HasFactory;

    protected $table = 'course_user';

    protected $appends = [
        'paid_courses',
        'booked_lessons',
    ];

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function student(){
        return $this->belongsTo(User::class);
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
}
