<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CoursePaymentOption: int implements HasLabel
{
    case Pre_Paid = 1;
    case Per_Lesson = 2;

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Pre_Paid => 'Pre-paid',
            self::Per_Lesson => 'Per lesson',
        };
    }
}
