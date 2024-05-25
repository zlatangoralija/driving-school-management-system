<?php

namespace App\Models;

use App\Enums\UserType;
use App\Repositories\StorageRepository;
use App\Services\StorageService;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, SoftDeletes;

    public $storageService;
    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->storageService = new StorageService();
    }
    protected $fillable = [
        'id',
        'name',
        'domain_prefix',
        'address',
        'phone_number',
        'data',
        'kvk_number',
        'logo',
        'payout_option'
    ];

    protected $appends = [
        'logo_url',
    ];

    public function getLogoUrlAttribute()
    {
        try {
            if ($this->logo){
                return $this->storageService->url($this->logo);
            }else{
                return '';
            }
        } catch (\Exception $e) {
            return '';
        }
    }

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
