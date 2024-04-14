<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class InvoicesChart extends ChartWidget
{
    protected static ?string $heading = 'Paid invoices';
    protected static string $color = 'info';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Invoices paid',
                    'data' => [13, 27],
                ],
            ],
            'labels' => ['Paid', 'Total'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
