<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum BookingStatus:  int implements HasLabel
{
    case Pending = 0;
    case Booked = 1;
    case Completed = 2;
    case Cancelled = 3;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Booked => 'Booked',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }
}
