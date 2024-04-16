<?php

namespace App\Models;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'phone_number',
        'kvk_number',
        'logo',
    ];

    public function students(){
        return $this->hasMany(User::class)
            ->where('type', UserType::Student);
    }

    public function instructors(){
        return $this->hasMany(User::class)
            ->where('type', UserType::Instructor);
    }

    public function administrators(){
        return $this->hasMany(User::class)
            ->where('type', UserType::SchoolAdmin);
    }
}
