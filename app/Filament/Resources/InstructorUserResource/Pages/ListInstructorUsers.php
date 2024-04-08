<?php

namespace App\Filament\Resources\InstructorUserResource\Pages;

use App\Filament\Resources\InstructorUserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInstructorUsers extends ListRecords
{
    protected static string $resource = InstructorUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
