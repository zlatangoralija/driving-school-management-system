<?php

namespace App\Filament\Resources\StudentUserResource\Pages;

use App\Enums\UserType;
use App\Filament\Resources\StudentUserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateStudentUser extends CreateRecord
{
    protected static string $resource = StudentUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['type'] = UserType::Student;
        return $data;
    }
}
