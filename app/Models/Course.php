<?php

namespace App\Models;

use App\Enums\CoursePaymentOption;
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
    ];

    protected $casts = [
        'payment_option' => CoursePaymentOption::class
    ];
}
