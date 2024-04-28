<?php

namespace App\Models;

use App\Enums\BookingInvitationStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'student_id',
        'instructor_id',
        'status',
    ];

    protected $casts = [
        'status' => BookingInvitationStatus::class
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
