<?php

use App\Http\Controllers\InstructorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SchoolAdministratorController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

Route::get('/', [PublicController::class, 'index']);

Route::prefix('students')->middleware(['auth', 'dashboard-middleware'])->name('students.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');;
});

Route::prefix('instructors')->middleware(['auth', 'dashboard-middleware'])->name('instructors.')->group(function () {
    Route::get('/dashboard', [InstructorController::class, 'dashboard'])->name('dashboard');;
});

Route::prefix('school-administrators')->middleware(['auth', 'dashboard-middleware'])->name('school-administrators.')->group(function () {
    Route::get('/dashboard', [SchoolAdministratorController::class, 'dashboard'])->name('dashboard');;
});


