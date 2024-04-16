<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum UserType: int implements HasLabel
{
    case Administrator = 1;
    case Student = 2;
    case Instructor = 3;
    case SchoolAdmin = 4;

    public function getLabel(): ?string
    {
        return $this->name;
    }
}
