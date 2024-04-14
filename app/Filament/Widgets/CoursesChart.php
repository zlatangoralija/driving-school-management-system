<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class CoursesChart extends ChartWidget
{
    protected static ?string $heading = 'Courses completed';
    protected static string $color = 'info';
    protected static ?int $sort = 1;

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Courses completed',
                    'data' => [5, 25],
                ],
            ],
            'labels' => ['Completed', 'Total'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
