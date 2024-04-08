<?php

namespace App\Filament\Resources\AdminUserResource\Pages;

use App\Enums\UserType;
use App\Filament\Resources\AdminUserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateAdminUser extends CreateRecord
{
    protected static string $resource = AdminUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['type'] = UserType::Administrator;
        return $data;
    }
}
