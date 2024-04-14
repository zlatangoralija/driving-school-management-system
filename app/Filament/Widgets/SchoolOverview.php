<?php

namespace App\Filament\Widgets;

use App\Enums\UserType;
use App\Models\Course;
use App\Models\School;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SchoolOverview extends BaseWidget
{
    protected static bool $isDiscovered = false;

    public $record;
    public function mount($record)
    {
        $this->record = $record;
    }

    protected function getStats(): array
    {
        return [
            Stat::make('Invoices', '10'),
            Stat::make('Courses', '10'),
            Stat::make('Instructors', User::where('type', UserType::Instructor)->where('school_id', $this->record->id)->count()),
            Stat::make('Students', User::where('type', UserType::Instructor)->where('school_id', $this->record->id)->count()),
        ];
    }
}
