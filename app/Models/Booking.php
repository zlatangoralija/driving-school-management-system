<?php

namespace App\Models;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_time',
        'end_time',
        'note',
        'status',
        'payment_status',
        'course_id',
        'student_id',
        'instructor_id',
        'admin_id',
        'uuid',
    ];

    protected $casts = [
        'status' => BookingStatus::class,
        'payment_status' => BookingPaymentStatus::class,
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    protected $appends = [
        'status_label'
    ];

    protected function statusLabel(): Attribute
    {
        return new Attribute(
            get: fn () => $this->status->name
        );
    }

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function student(){
        return $this->belongsTo(User::class, 'student_id');
    }

    public function instructor(){
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
