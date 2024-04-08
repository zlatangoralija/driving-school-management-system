<?php

namespace App\Filament\Resources\StudentUserResource\Pages;

use App\Filament\Resources\StudentUserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStudentUsers extends ListRecords
{
    protected static string $resource = StudentUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
