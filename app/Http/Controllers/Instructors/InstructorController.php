<?php

namespace App\Http\Controllers\Instructors;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function dashboard(){
        Inertia::share('layout.active_page', ['Dashboard']);

        $data['students_count'] = User::where('type', UserType::Student)->count();
        $data['total_booking_count'] = Booking::where('instructor_id', Auth::id())->count();
        $data['upcoming_booking_count'] = Booking::where('instructor_id', Auth::id())
            ->where('start_time', '>=', Carbon::now())
            ->count();

        $data['bookings_count'] = Booking::where('instructor_id', Auth::id())->count();

        $data['paid_bookings_count'] = Booking::where('instructor_id', Auth::id())
            ->where('payment_status', BookingPaymentStatus::Paid)
            ->count();

        $data['finished_bookings_count'] = Booking::where('instructor_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->where('start_time', '<=', Carbon::now())
            ->count();

        if($data['bookings_count']){
            $data['paid_courses_percentage'] = round(($data['paid_bookings_count'] / $data['bookings_count']) * 100, 2);
            $data['finished_courses_percentage'] = round(($data['finished_bookings_count'] / $data['bookings_count']) * 100, 2);
        }

        $data['upcoming_booking'] = Booking::with('student')
            ->where('instructor_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->where('start_time', '>=', Carbon::now())
            ->orderBy('start_time', 'ASC')
            ->first();

        if(Auth::user()->activeStripeIntegration){
            $data['latest_invoice'] = Invoice::where('instructor_id', Auth::id())
                ->orderBy('created_at', 'DESC')
                ->first();
        }

        return Inertia::render('Users/Instructors/Dashboard', $data);
    }
}
