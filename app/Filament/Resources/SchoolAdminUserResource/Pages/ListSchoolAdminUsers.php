<?php

namespace App\Filament\Resources\SchoolAdminUserResource\Pages;

use App\Filament\Resources\SchoolAdminUserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSchoolAdminUsers extends ListRecords
{
    protected static string $resource = SchoolAdminUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
