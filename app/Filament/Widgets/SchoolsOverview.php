<?php

namespace App\Filament\Widgets;

use App\Enums\UserType;
use App\Models\Course;
use App\Models\School;
use App\Models\Tenant;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SchoolsOverview extends BaseWidget
{
    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        return [
            Stat::make('Schools', Tenant::count()),
            Stat::make('Courses', Course::count()),
            Stat::make('Instructors', User::where('type', UserType::Instructor)->count()),
            Stat::make('Students', User::where('type', UserType::Instructor)->count()),
        ];
    }
}
