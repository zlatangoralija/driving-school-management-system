<?php

namespace App\Filament\Resources\InstructorUserResource\Pages;

use App\Enums\UserType;
use App\Filament\Resources\InstructorUserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateInstructorUser extends CreateRecord
{
    protected static string $resource = InstructorUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['type'] = UserType::Instructor;
        return $data;
    }
}
