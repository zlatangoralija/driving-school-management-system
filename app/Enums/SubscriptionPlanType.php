<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum SubscriptionPlanType: int implements HasLabel
{
    case Monthly = 1;
    case Yearly = 2;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Monthly => 'Monthly',
            self::Yearly => 'Yearly',
        };
    }
}
