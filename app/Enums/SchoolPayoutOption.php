<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum SchoolPayoutOption: int implements HasLabel
{
    case School = 1;
    case Instructors = 2;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::School => 'Payout to school',
            self::Instructors => 'Payout to instructors',
        };
    }
}
