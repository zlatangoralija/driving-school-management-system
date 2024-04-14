<?php

namespace App\Filament\Resources\StudentUserResource\Pages;

use App\Filament\Resources\StudentUserResource;
use App\Notifications\StudentUpdated;
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

    protected function afterSave(): void
    {
        $changes = $this->record->getChanges();
        if(isset($changes['updated_at'])){
            unset($changes['updated_at']);
        }

        if($changes && (isset($this->record->getChanges()['password']) || isset($this->record->getChanges()['email']))){
            $this->record->notify(new StudentUpdated($this->data));
        }
    }
}
