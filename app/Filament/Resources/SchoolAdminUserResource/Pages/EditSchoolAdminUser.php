<?php

namespace App\Filament\Resources\SchoolAdminUserResource\Pages;

use App\Filament\Resources\SchoolAdminUserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSchoolAdminUser extends EditRecord
{
    protected static string $resource = SchoolAdminUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
