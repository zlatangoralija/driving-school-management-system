<?php

declare(strict_types=1);

use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    'auth',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::prefix('students')->middleware(['auth', 'dashboard-middleware'])->name('students.')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    });

    Route::prefix('instructors')->middleware(['auth', 'dashboard-middleware'])->name('instructors.')->group(function () {
        Route::get('/dashboard', [InstructorController::class, 'dashboard'])->name('dashboard');
    });

    Route::prefix('school-administrators')->middleware(['auth', 'dashboard-middleware'])->name('school-administrators.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SchoolAdministrators\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/administrators', App\Http\Controllers\SchoolAdministrators\AdminController::class);
        Route::resource('/instructors', App\Http\Controllers\SchoolAdministrators\InstructorController::class);
        Route::resource('/students', App\Http\Controllers\SchoolAdministrators\StudentController::class);
        Route::resource('/courses', App\Http\Controllers\SchoolAdministrators\CourseController::class);

        //Ajax routes
        Route::get('/get-administrators', [\App\Http\Controllers\SchoolAdministrators\AdminController::class, 'getAdministrators'])->name('get-school-administrators');
    });
});
