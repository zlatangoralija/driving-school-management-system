<?php

namespace App\Http\Controllers\Instructors;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityBreak;
use App\Models\Booking;
use App\Models\BookingInvitation;
use App\Models\Course;
use App\Models\User;
use App\Notifications\NewBookingInstructor;
use App\Notifications\NewBookingStudent;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
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

    public function calendar($courseID = null, $studentID = null){
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

        $data['course_id'] = $courseID;
        $data['student_id'] = $studentID;
        $data['course_name'] = $courseID ? Course::find($courseID)->name : null;

        $data['students'] = Auth::user()->students()->pluck('users.email', 'users.id');
        $data['courses'] = Course::with('instructor', 'admin')
            ->select('id', 'name', 'description', 'price', 'payment_option', 'number_of_lessons', 'created_at', 'instructor_id', 'admin_id')
            ->where('instructor_id', Auth::id())
            ->orWhereHas('admin', function ($admin){
                return $admin->where('tenant_id', Auth::user()->tenant_id);
            })->pluck('name', 'id');


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
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['student_Id'] = Auth::id();
            $course = Course::findOrFail($request->input('course_id'));

            $startTime = Carbon::parse($request->input('start_time'));
            $endTime = $startTime->copy()->addMinutes(30);

            //First check that there are no other events booked at this timeslot
            $existing = Booking::where('instructor_id', $course->instructor_id)
                ->where('start_time', $startTime)
                ->orWhere('end_time', $startTime)
                ->first();

            if($existing){
                throw ValidationException::withMessages([
                    'start_time' => ['Booking slot already taken. Please select another slot.'],
                ]);
            }

            //Then check if there is break on this timeslot for instructors
            $instructorBreak = AvailabilityBreak::where('user_id', $course->instructor_id)
                ->where('start_time', $startTime)
                ->orWhere('end_time', $startTime)
                ->first();

            if($instructorBreak){
                throw ValidationException::withMessages([
                    'start_time' => ['Instructor is not available at the selected slot. Please select another slot.'],
                ]);
            }

            //TODO: add student break check as well

            $booking = Booking::create([
                'start_time' => $startTime,
                'end_time' => $endTime,
                'note' => $request->input('note'),
                'course_id' => $course->id,
                'student_id' => $request->input('student_id'),
                'instructor_id' => Auth::id(),
                'admin_id' => $course->admin_id,
            ]);

            DB::commit();

            if($booking->instructor){
                $booking->instructor->notify(new NewBookingInstructor($booking));
            }

            if($booking->student){
                $booking->student->notify(new NewBookingStudent($booking));
            }

            return redirect()->back()
                ->with('success', 'Booking created successfully! Waiting for student confirmation');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Booking creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', isset($exception->validator) ? [$exception->getMessage()] :  ['There was an error creating a booking.']);
        }


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
    public function edit(Booking $booking)
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
                'page' => 'Confirm booking for:  ' . $booking->course->name,
                'url' => route('instructors.confirm-booking', ['booking' => $booking]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['booking'] = $booking;
        $data['course'] = $booking->course;
        $data['excluded_slots'] = UserService::getStudentUnavailableSlots($booking->course->student_id);

        return Inertia::render('Users/Instructors/Bookings/Book', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $course = $booking->course;

            $startTime = Carbon::parse($request->input('start_time'));
            $endTime = $startTime->copy()->addMinutes($course->duration);

            //TODO: do this in service!
            //First check that there are no other events booked at this timeslot
            $existing = Booking::where('student_id', $course->student_id)
                ->where('start_time', $startTime)
                ->orWhere('end_time', $startTime)
                ->first();

            if($existing){
                throw ValidationException::withMessages([
                    'start_time' => ['Booking slot already taken. Please select another slot.'],
                ]);
            }

            //Then check if there is break on this timeslot
            $break = AvailabilityBreak::where('user_id', $course->student_id)
                ->where('start_time', $startTime)
                ->orWhere('end_time', $startTime)
                ->first();

            if($break){
                throw ValidationException::withMessages([
                    'start_time' => ['Student is not available at the selected slot. Please select another slot.'],
                ]);
            }

            $booking->update([
                'start_time' => $startTime,
                'end_time' => $endTime,
                'note' => $request->input('note'),
            ]);

            DB::commit();

            //TODO: booking should be pending state still, until instructor approves it
            if($booking->instructor){
                $booking->instructor->notify(new NewBookingInstructor($booking));
            }

            if($booking->student){
                $booking->student->notify(new NewBookingStudent($booking));
            }

            return redirect()->route('instructors.bookings.index')
                ->with('success', 'Booked successfully!');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Booking update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', isset($exception->validator) ? [$exception->getMessage()] :  ['There was an error creating a booking.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
