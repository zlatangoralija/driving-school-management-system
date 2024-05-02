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

    Route::get('/', function (){
        $dashboardUrl = \App\Services\UserService::getDashboardUrl();
        return redirect($dashboardUrl);
    })->middleware(['dashboard-middleware', 'auth']);

    Route::prefix('students')->middleware(['auth', 'dashboard-middleware'])->name('students.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Students\StudentController::class, 'dashboard'])->name('dashboard');
        Route::resource('/bookings', \App\Http\Controllers\Students\BookingController::class);
        Route::resource('/invitations', \App\Http\Controllers\Students\InvitationController::class);

        //Booking calendar view
        Route::get('/bookings-calendar', [\App\Http\Controllers\Students\BookingController::class, 'calendar'])->name('bookings-calendar');

        //Bookings
        Route::get('/invite-to-book/{course}', [\App\Http\Controllers\Students\BookingController::class, 'book'])->name('booking-form');

        //Ajax routes
        Route::get('/get-bookings', [\App\Http\Controllers\Students\BookingController::class, 'getBookings'])->name('get-bookings');
        Route::get('/get-invitations', [\App\Http\Controllers\Students\InvitationController::class, 'getInvitations'])->name('get-invitations');

    });

    Route::prefix('instructors')->middleware(['auth', 'dashboard-middleware'])->name('instructors.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Instructors\InstructorController::class, 'dashboard'])->name('dashboard');
        Route::resource('/students', \App\Http\Controllers\Instructors\StudentController::class);
        Route::resource('/courses', \App\Http\Controllers\Instructors\CourseController::class);
        Route::resource('/bookings', \App\Http\Controllers\Instructors\BookingController::class);

        //Booking calendar view
        Route::get('/bookings-calendar', [\App\Http\Controllers\Instructors\BookingController::class, 'calendar'])->name('bookings-calendar');

        //Invitations
        Route::post('/invite-to-book', [\App\Http\Controllers\Instructors\CourseController::class, 'inviteToBook'])->name('courses.invite-to-book');

        //Ajax routes
        Route::get('/get-students', [\App\Http\Controllers\Instructors\StudentController::class, 'getStudents'])->name('get-instructor-students');
        Route::get('/get-bookings', [\App\Http\Controllers\Instructors\BookingController::class, 'getBookings'])->name('get-instructor-bookings');
        Route::get('/get-courses', [\App\Http\Controllers\Instructors\CourseController::class, 'getCourses'])->name('get-instructor-courses');
    });

    Route::prefix('school-administrators')->middleware(['auth', 'dashboard-middleware'])->name('school-administrators.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SchoolAdministrators\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/settings', \App\Http\Controllers\SchoolAdministrators\SettingsController::class);
        Route::resource('/administrators', App\Http\Controllers\SchoolAdministrators\AdminController::class);
        Route::resource('/instructors', App\Http\Controllers\SchoolAdministrators\InstructorController::class);
        Route::resource('/students', App\Http\Controllers\SchoolAdministrators\StudentController::class);
        Route::resource('/courses', App\Http\Controllers\SchoolAdministrators\CourseController::class);
        Route::resource('/bookings', App\Http\Controllers\SchoolAdministrators\BookingController::class);

        //Booking calendar view
        Route::get('/bookings-calendar', [\App\Http\Controllers\SchoolAdministrators\BookingController::class, 'calendar'])->name('bookings-calendar');

        //Ajax routes
        Route::get('/get-administrators', [\App\Http\Controllers\SchoolAdministrators\AdminController::class, 'getAdministrators'])->name('get-school-administrators');
        Route::get('/get-instructors', [\App\Http\Controllers\SchoolAdministrators\InstructorController::class, 'getInstructors'])->name('get-school-instructors');
        Route::get('/get-students', [\App\Http\Controllers\SchoolAdministrators\StudentController::class, 'getStudents'])->name('get-school-students');
        Route::get('/get-courses', [\App\Http\Controllers\SchoolAdministrators\CourseController::class, 'getCourses'])->name('get-school-courses');
        Route::get('/get-bookings', [\App\Http\Controllers\SchoolAdministrators\BookingController::class, 'getBookings'])->name('get-bookings');

    });
});
