<?php

namespace App\Models;

use App\Enums\SubscriptionPlanType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'stripe_id',
        'price',
        'description',
        'items',
        'type',
    ];

    protected $casts = [
        'type' => SubscriptionPlanType::class,
        'items' => 'array'
    ];
}
