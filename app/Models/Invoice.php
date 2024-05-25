<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'description',
        'student_id',
        'instructor_id',
        'course_id',
    ];

    public function student(){
        return $this->belongsTo(User::class, 'student_id');
    }

    public function instructor(){
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function course(){
        return $this->belongsTo(Course::class);
    }
}
