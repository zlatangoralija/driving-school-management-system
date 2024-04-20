<?php

use App\Http\Controllers\InstructorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SchoolAdministratorController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        require __DIR__.'/auth.php';
        Route::get('/', [PublicController::class, 'index'])->name('home');
    });
}


