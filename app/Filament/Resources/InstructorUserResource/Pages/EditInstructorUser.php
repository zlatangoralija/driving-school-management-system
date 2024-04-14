<?php

namespace App\Filament\Resources\InstructorUserResource\Pages;

use App\Filament\Resources\InstructorUserResource;
use App\Notifications\InstructorUpdated;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInstructorUser extends EditRecord
{
    protected static string $resource = InstructorUserResource::class;

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
            $this->record->notify(new InstructorUpdated($this->data));
        }
    }
}
