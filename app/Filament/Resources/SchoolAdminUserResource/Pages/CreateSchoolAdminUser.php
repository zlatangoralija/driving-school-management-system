<?php

namespace App\Filament\Resources\SchoolAdminUserResource\Pages;

use App\Enums\UserType;
use App\Filament\Resources\SchoolAdminUserResource;
use App\Notifications\SchoolAdminCreated;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateSchoolAdminUser extends CreateRecord
{
    protected static string $resource = SchoolAdminUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['type'] = UserType::SchoolAdmin;
        return $data;
    }

    protected function afterCreate(){
        $this->record->notify(new SchoolAdminCreated($this->data));
    }
}
