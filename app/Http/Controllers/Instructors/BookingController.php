<?php

namespace App\Http\Controllers\Instructors;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('instructors.bookings.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        return Inertia::render('Users/Instructors/Bookings/Index');
    }

    public function calendar(){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('instructors.bookings-calendar'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['bookings'] = [];
        $bookings = Booking::where('instructor_id', Auth::id())
            ->select('id', 'start_time', 'end_time', 'status', 'course_id', 'student_id', 'instructor_id')
            ->with('course', 'student', 'instructor')
            ->get();

        foreach ($bookings as $booking){
            $data['bookings'][] = [
                'title' => $booking->course->name . ' - ' . $booking->student->name,
                'start' => $booking->start_time,
                'end' => $booking->end_time,
            ];
        }

        return Inertia::render('Users/Instructors/Bookings/Calendar', $data);
    }

    public function getBookings(Request $request){
        $data['bookings'] = Booking::where('instructor_id', Auth::id())
            ->select('id', 'start_time', 'end_time', 'status', 'course_id', 'student_id', 'instructor_id', 'created_at')
            ->with('course', 'student', 'instructor')
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('start_time', 'asc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('course.name', 'like', '%'.$request->input('search').'%')
                    ->orWhere('instructor.name', 'like', '%'.$request->input('search').'%');
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
    public function show(Booking $booking)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('instructors.bookings.index'),
            ],
            2 => [
                'page' => 'View booking',
                'url' => route('instructors.bookings.show', ['booking' => $booking]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['booking'] = $booking->load('course', 'student');
        return Inertia::render('Users/Instructors/Bookings/Show', $data);
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
