<?php

namespace App\Models;

use App\Enums\CoursePaymentOption;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'number_of_lessons',
        'price',
        'payment_option',
        'instructor_id',
        'admin_id'
    ];

    protected $casts = [
        'payment_option' => CoursePaymentOption::class
    ];

    protected $appends = [
        'payment_option_label',
        'invitation_url',
    ];

    protected function paymentOptionLabel(): Attribute
    {
        return new Attribute(
            get: fn () => str_replace('_', ' ', $this->payment_option->name)
        );
    }

    protected function invitationUrl(): Attribute
    {
        return new Attribute(
            get: fn () => route('students.booking-form', ['course' => $this])
        );
    }

    public function instructor(){
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function admin(){
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }
}
