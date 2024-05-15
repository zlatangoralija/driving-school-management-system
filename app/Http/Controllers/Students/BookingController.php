<?php

namespace App\Http\Controllers\Students;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\AvailabilityBreak;
use App\Models\Booking;
use App\Models\BookingInvitation;
use App\Models\Course;
use App\Models\User;
use App\Notifications\NewBookingInstructor;
use App\Notifications\NewBookingStudent;
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
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('students.bookings.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);
        return Inertia::render('Users/Students/Bookings/Index');
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
        $bookings = Booking::where('student_id', Auth::id())
            ->select('id', 'start_time', 'end_time', 'status', 'course_id', 'student_id', 'instructor_id')
            ->with('course', 'student', 'instructor')
            ->get();

        foreach ($bookings as $booking){
            $data['bookings'][] = [
                'title' => $booking->course->name . ' - ' . $booking->instructor->name,
                'start' => $booking->start_time,
                'end' => $booking->end_time,
            ];
        }

        return Inertia::render('Users/Students/Bookings/Calendar', $data);
    }

    public function getBookings(Request $request){
        $data['bookings'] = Booking::where('student_id', Auth::id())
            ->select('id', 'start_time', 'end_time', 'status', 'course_id', 'student_id', 'instructor_id', 'created_at')
            ->with('course', 'student', 'instructor')
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('course.name', 'like', '%'.$request->input('search').'%')
                    ->orWhere('instructor.name', 'like', '%'.$request->input('search').'%');
            })
            ->paginate($request->input('per_page') ?: 10);

        return $data;
    }

    public function book(Course $course){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('students.bookings.index'),
            ],
            2 => [
                'page' => 'Book ' . $course->name,
                'url' => route('students.booking-form', ['course' => $course]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['course'] = $course;

        $events = Booking::where('instructor_id', $course->instructor_id)
            ->where('start_time', '>=', Carbon::now())
            ->get();

        $breaks = AvailabilityBreak::where('user_id', $course->instructor_id)
            ->get();

        $excludeTimes = [];

        foreach ($events as $event) {
            // Convert start_time and end_time strings to Carbon instances
            $startTime = Carbon::parse($event['start_time']);
            $endTime = Carbon::parse($event['end_time']);

            $eventDate = $startTime->format('Y-m-d');

            // Loop through each minute between start and end times
            while ($startTime->lte($endTime)) {
                // Add the time to the excludeTimes array, along with the event date
                $excludeTimes[] = [
                    'date' =>  $eventDate,
                    'hours' => $startTime->hour,
                    'minutes' => $startTime->minute
                ];

                // Move to the next 30-minute interval
                $startTime->addMinutes(30);
            }
        }

        foreach ($breaks as $break){
            // Convert start_time and end_time strings to Carbon instances
            $startTime = Carbon::parse($break['start_time']);
            $endTime = Carbon::parse($break['end_time']);

            $breakDate = $startTime->format('Y-m-d');

            // Loop through each minute between start and end times
            while ($startTime->lte($endTime)) {
                // Add the time to the excludeTimes array, along with the event date
                $excludeTimes[] = [
                    'date' =>  $breakDate,
                    'hours' => $startTime->hour,
                    'minutes' => $startTime->minute,
                    'message' => $break->reason
                ];

                // Move to the next 30-minute interval
                $startTime->addMinutes(30);
            }
        }

        $data['excluded_slots'] = $excludeTimes;

        return Inertia::render('Users/Students/Bookings/Book', $data);
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
            $course = Course::findOrFail($request->input('course'));

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

            //Then check if there is break on this timeslot
            $break = AvailabilityBreak::where('user_id', $course->instructor_id)
                ->where('start_time', $startTime)
                ->orWhere('end_time', $startTime)
                ->first();

            if($break){
                throw ValidationException::withMessages([
                    'start_time' => ['Instructor is not available at the selected slot. Please select another slot.'],
                ]);
            }

            $booking = Booking::create([
                'start_time' => $startTime,
                'end_time' => $endTime,
                'note' => $request->input('note'),
                'course_id' => $course->id,
                'student_id' => Auth::id(),
                'instructor_id' => $course->instructor_id,
                'admin_id' => $course->admin_id,
            ]);

            //If student came from invitation, update status of invitation
            if($request->input('invitation_id')){
                $invitation = BookingInvitation::find($request->input('invitation_id'));
                if($invitation){
                    $invitation->status = 2;
                    $invitation->save();
                }
            }

            DB::commit();

            if($booking->instructor){
                $booking->instructor->notify(new NewBookingInstructor($booking));
            }

            if($booking->student){
                $booking->student->notify(new NewBookingStudent($booking));
            }

            return redirect()->route('students.bookings.index')
                ->with('success', 'Booked successfully!');

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
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Bookings',
                'url' => route('students.bookings.index'),
            ],
            2 => [
                'page' => 'View booking',
                'url' => route('students.bookings.show', ['booking' => $booking]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['booking'] = $booking->load('course', 'instructor');
        return Inertia::render('Users/Students/Bookings/Show', $data);
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
