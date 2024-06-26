<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserStatus;
use App\Enums\UserType;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, SoftDeletes, BelongsToTenant, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'status',
        'type',
        'timezone',
        'tenant_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'status_label'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'driving_test_booked' => 'datetime',
            'password' => 'hashed',
            'type' => UserType::class,
            'status' => UserStatus::class,
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return true;
    }

    protected function statusLabel(): Attribute
    {
        return new Attribute(
            get: fn () => $this->status->name
        );
    }

    public function school(){
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class,'instructor_students','instructor_id','student_id');
    }

    public function instructors()
    {
        return $this->belongsToMany(User::class,'instructor_students','student_id', 'instructor_id');
    }

    public function availabilityBreaks(){
        return $this->hasMany(AvailabilityBreak::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }

    public function stripeIntegration()
    {
        return $this->hasOne(StripeUserIntegration::class);
    }

    public function activeStripeIntegration()
    {
        return $this->stripeIntegration()
            ->where('status', 1);
    }
}
