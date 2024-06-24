<?php

namespace App\Http\Controllers\Students;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\CourseUser;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('students.courses.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['courses'] = CourseUser::with(['course', 'course.instructor'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'DESC')
            ->get();

        return Inertia::render('Users/Students/Courses/Index', $data);
    }

    public function getCourses(Request $request){
        $data['courses'] = CourseUser::with(['course', 'course.instructor'])
            ->select('id', 'user_id', 'course_id', 'uuid')
            ->where('user_id', Auth::id())
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('course.name', 'like', '%'.$request->input('search').'%');
            })
            ->paginate($request->input('per_page') ?: 10);

        return $data;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseUser $course)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('students.courses.index'),
            ],
            2 => [
                'page' => $course->course->name,
                'url' => route('students.courses.show', ['course' => $course]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['uuid'] = $course->uuid;
        $data['course'] = $course->course;
        $data['bookings'] = Booking::where('uuid', $course->uuid)->paginate(10);

        $bookingsCount = Booking::where('student_id', Auth::id())
            ->where('uuid', $course->uuid)
            ->count();

        $paidBookingsCount = Booking::where('uuid', $course->uuid)
            ->where('student_id', Auth::id())
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

        $data['upcoming_booking'] = Booking::where('uuid', $course->uuid)
            ->where('student_id', Auth::id())
            ->where('status', BookingStatus::Booked)
            ->where('start_time', '>=', Carbon::now())
            ->orderBy('start_time', 'ASC')
            ->first();

        $data['latest_invoice'] = Invoice::where('student_id', Auth::id())
            ->where('course_id', $course->course_id)
            ->orderBy('created_at', 'DESC')
            ->first();

        return Inertia::render('Users/Students/Courses/Show', $data);
    }

    public function getCourseBookings(Request $request, $uuid){
        $data['bookings'] = Booking::with(['course', 'instructor'])
            ->select('id', 'start_time', 'end_time', 'status', 'payment_status', 'course_id', 'student_id', 'instructor_id')
            ->where('uuid', $uuid)
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('course.name', 'like', '%'.$request->input('search').'%');
            })
            ->paginate($request->input('per_page') ?: 10);

        return $data;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
