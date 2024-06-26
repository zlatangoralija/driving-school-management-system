<?php

namespace App\Http\Controllers\Students;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard(){
        Inertia::share('layout.active_page', ['Dashboard']);

        $data['courses_count'] = Auth::user()->courses()->count();
        $data['total_booking_count'] = Booking::where('student_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->count();
        $data['upcoming_booking_count'] = Booking::where('student_id', Auth::id())
            ->where('start_time', '>=', Carbon::now())
            ->count();

        $bookingsCount = Booking::where('student_id', Auth::id())->count();

        $paidBookingsCount = Booking::where('student_id', Auth::id())
            ->where('payment_status', BookingPaymentStatus::Paid)
            ->count();

        $finishedBookingsCount = Booking::where('student_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->where('start_time', '<=', Carbon::now())
            ->count();

        if($bookingsCount){
            $data['paid_courses_percentage'] = round(($paidBookingsCount / $bookingsCount) * 100, 2);
            $data['finished_courses_percentage'] = round(($finishedBookingsCount / $bookingsCount) * 100, 2);
        }

        $data['upcoming_booking'] = Booking::where('student_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->where('start_time', '>=', Carbon::now())
            ->orderBy('start_time', 'ASC')
            ->first();

        $data['latest_invoice'] = Invoice::where('student_id', Auth::id())
            ->orderBy('created_at', 'DESC')
            ->first();

        return Inertia::render('Users/Students/Dashboard', $data);
    }
}
