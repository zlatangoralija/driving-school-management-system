<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CoursePaymentOption: int implements HasLabel
{
    case PrePaid = 1;
    case PerLesson = 2;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::PrePaid => 'Pre-paid',
            self::PerLesson => 'Per lesson',
        };
    }
}
