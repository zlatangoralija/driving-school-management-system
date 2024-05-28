<?php

declare(strict_types=1);

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
        Route::resource('/courses', \App\Http\Controllers\Students\CourseController::class);
        Route::resource('/invoices', \App\Http\Controllers\Students\InvoiceController::class);
        Route::resource('/availability-breaks', \App\Http\Controllers\Students\AvailabilityBreakController::class);

        //Booking calendar view
        Route::get('/bookings-calendar', [\App\Http\Controllers\Students\BookingController::class, 'calendar'])->name('bookings-calendar');

        //Bookings
        Route::get('/invite-to-book/{course}', [\App\Http\Controllers\Students\BookingController::class, 'book'])->name('booking-form');
        Route::get('/confirm-booking/{booking}', [\App\Http\Controllers\Students\BookingController::class, 'confirm'])->name('confirm-booking');
        Route::get('/pay-booking/{booking}', [App\Http\Controllers\Students\BookingController::class, 'payForBooking'])->name('bookings.pay');
        Route::post('/book-and-pay', [\App\Http\Controllers\Students\BookingController::class, 'storeBookAndPay'])->name('store-book-and-pay');
        Route::put('/book-and-pay/{booking}', [\App\Http\Controllers\Students\BookingController::class, 'updateBookAndPay'])->name('update-book-and-pay');
        Route::get('/cancel-booking/{booking}', [App\Http\Controllers\Students\BookingController::class, 'cancelBooking'])->name('cancel-booking-payment');
        Route::post('/book-driving-test', [App\Http\Controllers\Students\BookingController::class, 'drivingTest'])->name('book-driving-test');

        //Settings
        Route::get('/account-settings', [\App\Http\Controllers\Students\AccountSettingsController::class, 'accountSettings'])->name('account-settings');
        Route::put('/update-account-settings', [\App\Http\Controllers\Students\AccountSettingsController::class, 'updateAccountSettings'])->name('update-account-settings');
        Route::get('/payment-settings', [\App\Http\Controllers\Students\AccountSettingsController::class, 'paymentSettings'])->name('payment-settings');
        Route::put('/update-payment-settings', [\App\Http\Controllers\Students\AccountSettingsController::class, 'updatePaymentSettings'])->name('update-payment-settings');

        //Ajax routes
        Route::get('/get-bookings', [\App\Http\Controllers\Students\BookingController::class, 'getBookings'])->name('get-bookings');
        Route::get('/get-invitations', [\App\Http\Controllers\Students\InvitationController::class, 'getInvitations'])->name('get-invitations');
        Route::get('/get-courses', [\App\Http\Controllers\Students\CourseController::class, 'getCourses'])->name('get-student-courses');
        Route::get('/get-course-bookings/{uuid}', [\App\Http\Controllers\Students\CourseController::class, 'getCourseBookings'])->name('get-course-bookings');
        Route::get('/get-student-invoices', [\App\Http\Controllers\Students\InvoiceController::class, 'getInvoices'])->name('get-student-invoices');
        Route::get('/get-availability-breaks', [\App\Http\Controllers\Students\AvailabilityBreakController::class, 'getBreaks'])->name('get-availability-breaks');

    });

    Route::prefix('instructors')->middleware(['auth', 'dashboard-middleware'])->name('instructors.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Instructors\InstructorController::class, 'dashboard'])->name('dashboard');
        Route::resource('/students', \App\Http\Controllers\Instructors\StudentController::class);
        Route::resource('/courses', \App\Http\Controllers\Instructors\CourseController::class);
        Route::resource('/bookings', \App\Http\Controllers\Instructors\BookingController::class);
        Route::resource('/availability-breaks', \App\Http\Controllers\Instructors\AvailabilityBreakController::class);
        Route::resource('/invoices', \App\Http\Controllers\Instructors\InvoiceController::class);

        //Booking calendar view
        Route::get('/bookings-calendar/{course_id?}/{student_id?}', [\App\Http\Controllers\Instructors\BookingController::class, 'calendar'])->name('bookings-calendar');
        Route::get('/confirm-booking/{booking}', [\App\Http\Controllers\Instructors\BookingController::class, 'confirm'])->name('confirm-booking');

        //Invitations
        Route::post('/assign-course', [\App\Http\Controllers\Instructors\CourseController::class, 'assign'])->name('courses.assign-students');

        //Settings
        Route::get('/account-settings', [\App\Http\Controllers\Instructors\AccountSettingsController::class, 'accountSettings'])->name('account-settings');
        Route::put('/update-account-settings', [\App\Http\Controllers\Instructors\AccountSettingsController::class, 'updateAccountSettings'])->name('update-account-settings');
        Route::get('/payment-settings', [\App\Http\Controllers\Instructors\AccountSettingsController::class, 'paymentSettings'])->name('payment-settings');
        Route::put('/update-payment-settings', [\App\Http\Controllers\Instructors\AccountSettingsController::class, 'updatePaymentSettings'])->name('update-payment-settings');

        //Ajax routes
        Route::get('/get-students', [\App\Http\Controllers\Instructors\StudentController::class, 'getStudents'])->name('get-instructor-students');
        Route::get('/get-bookings', [\App\Http\Controllers\Instructors\BookingController::class, 'getBookings'])->name('get-instructor-bookings');
        Route::get('/get-courses', [\App\Http\Controllers\Instructors\CourseController::class, 'getCourses'])->name('get-instructor-courses');
        Route::get('/get-availability-breaks', [\App\Http\Controllers\Instructors\AvailabilityBreakController::class, 'getBreaks'])->name('get-availability-breaks');
        Route::get('/get-instructor-invoices', [\App\Http\Controllers\Instructors\InvoiceController::class, 'getInvoices'])->name('get-invoices');

    });

    Route::prefix('school-administrators')->middleware(['auth', 'dashboard-middleware'])->name('school-administrators.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SchoolAdministrators\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('/administrators', App\Http\Controllers\SchoolAdministrators\AdminController::class);
        Route::resource('/instructors', App\Http\Controllers\SchoolAdministrators\InstructorController::class);
        Route::resource('/students', App\Http\Controllers\SchoolAdministrators\StudentController::class);
        Route::resource('/courses', App\Http\Controllers\SchoolAdministrators\CourseController::class);
        Route::resource('/bookings', App\Http\Controllers\SchoolAdministrators\BookingController::class);

        //Booking calendar view
        Route::get('/bookings-calendar', [\App\Http\Controllers\SchoolAdministrators\BookingController::class, 'calendar'])->name('bookings-calendar');

        //Settings
        Route::get('/account-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'accountSettings'])->name('account-settings');
        Route::put('/update-account-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'updateAccountSettings'])->name('update-account-settings');
        Route::get('/payment-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'paymentSettings'])->name('payment-settings');
        Route::put('/update-payment-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'updatePaymentSettings'])->name('update-payment-settings');
        Route::get('/booking-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'bookingSettings'])->name('booking-settings');
        Route::put('/update-booking-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'updateBookingSettings'])->name('update-booking-settings');
        Route::get('/school-settings', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'schoolSettings'])->name('school-settings');
        Route::put('/update-school-settings/{setting}', [\App\Http\Controllers\SchoolAdministrators\AccountSettingsController::class, 'updateSchoolSettings'])->name('update-school-settings');

        //Ajax routes
        Route::get('/get-administrators', [\App\Http\Controllers\SchoolAdministrators\AdminController::class, 'getAdministrators'])->name('get-school-administrators');
        Route::get('/get-instructors', [\App\Http\Controllers\SchoolAdministrators\InstructorController::class, 'getInstructors'])->name('get-school-instructors');
        Route::get('/get-students', [\App\Http\Controllers\SchoolAdministrators\StudentController::class, 'getStudents'])->name('get-school-students');
        Route::get('/get-courses', [\App\Http\Controllers\SchoolAdministrators\CourseController::class, 'getCourses'])->name('get-school-courses');
        Route::get('/get-bookings', [\App\Http\Controllers\SchoolAdministrators\BookingController::class, 'getBookings'])->name('get-bookings');
    });
});
