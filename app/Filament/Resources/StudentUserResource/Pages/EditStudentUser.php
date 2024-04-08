<?php

namespace App\Filament\Resources\StudentUserResource\Pages;

use App\Filament\Resources\StudentUserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStudentUser extends EditRecord
{
    protected static string $resource = StudentUserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
