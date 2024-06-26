<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Course;
use App\Models\CourseUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){
        Inertia::share('layout.active_page', ['Dashboard']);

        $data['admins_count'] = User::where('type', UserType::SchoolAdmin)->count();
        $data['students_count'] = User::where('type', UserType::Student)->count();
        $data['instructors_count'] = User::where('type', UserType::Instructor)->count();

        $data['active_admins_count'] = User::where('type', UserType::SchoolAdmin)
            ->where('status', UserStatus::Active)
            ->count();
        $data['active_students_count'] = User::where('type', UserType::Student)
            ->where('status', UserStatus::Active)
            ->count();
        $data['active_instructors_count'] = User::where('type', UserType::Instructor)
            ->where('status', UserStatus::Active)
            ->count();

        $data['courses_count'] = Course::whereHas('instructor')
            ->count();

        $data['total_bookings_count'] = Booking::whereHas('instructor')
            ->where('status', BookingStatus::Booked)
            ->count();
        $data['finished_bookings_count'] = Booking::whereHas('instructor')
            ->where('start_time', '<=', Carbon::now())
            ->where('status', BookingStatus::Booked)
            ->count();
        $data['paid_bookings_count'] = Booking::whereHas('instructor')
            ->where('status', BookingStatus::Booked)
            ->where('payment_status', BookingPaymentStatus::Paid)
            ->count();

        $enrolledCoursesCount = 0;
        $enrolledCoursesCompletedCount = 0;
        $paidCoursesCount = 0;
        $enrolledCourses = CourseUser::whereHas('student')
            ->get();
        foreach($enrolledCourses->unique('uuid') as $course){
            $enrolledCoursesCount ++;

            if($course->finished_lessons_percentage == 100){
                $enrolledCoursesCompletedCount++;
            }

            if($course->paid_courses_percentage == 100){
                $paidCoursesCount++;
            }
        }

        $data['enrolled_courses'] = $enrolledCoursesCount;

        $data['finished_bookings_percentage'] = 0;
        $data['finished_courses_percentage'] = 0;
        $data['paid_bookings_percentage'] = 0;
        $data['paid_courses_percentage'] = 0;

        if($enrolledCoursesCount){
            $data['finished_courses_percentage'] = ($enrolledCoursesCompletedCount / $enrolledCoursesCount) * 100;
        }

        if($data['total_bookings_count']){
            $data['finished_bookings_percentage'] = ($data['finished_bookings_count'] / $data['total_bookings_count']) * 100;
        }

        if($enrolledCoursesCount){
            $data['paid_courses_percentage'] = ($paidCoursesCount / $enrolledCoursesCount) * 100;
        }

        if($data['total_bookings_count']){
            $data['paid_bookings_percentage'] = ($data['paid_bookings_count'] / $data['total_bookings_count']) * 100;
        }

        return Inertia::render('Users/SchoolAdmins/Dashboard', $data);
    }
}
