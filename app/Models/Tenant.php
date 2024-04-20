<?php

namespace App\Models;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'domain_prefix',
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
