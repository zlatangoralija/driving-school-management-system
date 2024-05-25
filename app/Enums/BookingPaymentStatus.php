<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum BookingPaymentStatus: int implements HasLabel
{
    case NotPaid = 0;
    case Paid = 1;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::NotPaid => 'Not paid',
            self::Paid => 'Paid',
        };
    }
}
