<?php

namespace App\Models;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailabilityBreak extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'start_time',
        'end_time',
        'reason'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function student(){
        return $this->belongsTo(User::class)->where('type', UserType::Student);
    }

    public function instructor(){
        return $this->belongsTo(User::class)->where('type', UserType::Instructor);
    }
}
