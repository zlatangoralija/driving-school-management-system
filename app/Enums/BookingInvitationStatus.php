<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum BookingInvitationStatus: int implements HasLabel
{
    case Pending = 1;
    case Booked = 2;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Booked => 'Booked',
        };
    }
}
