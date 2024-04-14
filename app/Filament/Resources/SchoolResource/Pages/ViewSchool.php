<?php

namespace App\Filament\Resources\SchoolResource\Pages;

use App\Filament\Resources\SchoolResource;
use App\Filament\Widgets\SchoolOverview;
use App\Filament\Widgets\SchoolsOverview;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewSchool extends ViewRecord
{
    protected static string $resource = SchoolResource::class;

    protected function getHeaderWidgets(): array
    {
        return [
            SchoolOverview::make(['record' => $this->record])
        ];
    }
}
