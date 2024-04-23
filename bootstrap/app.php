<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->appendToGroup('dashboard-middleware', [
            \App\Http\Middleware\InertiaDashboardMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'https://driving-school-management-system.test/uploads',
//            'https://driveplanx.nl/uploads',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
