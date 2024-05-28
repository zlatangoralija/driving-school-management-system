<?php

namespace App\Http\Controllers\Students;

use App\Enums\BookingStatus;
use App\Enums\CoursePaymentOption;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\AvailabilityBreak;
use App\Models\Booking;
use App\Models\BookingInvitation;
use App\Models\Course;
use App\Models\User;
use App\Notifications\NewBookingInstructor;
use App\Notifications\NewBookingStudent;
use App\Services\StripeService;
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

    public function __construct()
    {
        $this->stripeService = new StripeService();
    }

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

        $data['excluded_slots'] = UserService::getInstructorUnavailableSlots($course->instructor_id);

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
            $endTime = $startTime->copy()->addMinutes($course->duration);

            //TODO: do this in service!
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


            //TODO: booking should be pending state still, until instructor approves it
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
    public function edit(Booking $booking)
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
                'page' => 'Confirm booking for:  ' . $booking->course->name,
                'url' => route('students.confirm-booking', ['booking' => $booking]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Bookings']);

        $data['booking'] = $booking;
        $data['course'] = $booking->course;
        $data['excluded_slots'] = UserService::getInstructorUnavailableSlots($booking->course->instructor_id);

        return Inertia::render('Users/Students/Bookings/Book', $data);
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

            return redirect()->route('students.bookings.index')
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

    public function storeBookAndPay(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['student_Id'] = Auth::id();
            $course = Course::findOrFail($request->input('course'));

            $startTime = Carbon::parse($request->input('start_time'));
            $endTime = $startTime->copy()->addMinutes($course->duration);

            //TODO: do this in service!
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

            if($course->payment_option == CoursePaymentOption::Pre_Paid){
                $items = [];
                for ($i=0;$i<$course->number_of_lessons;$i++){
                    $items[] = [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => 'Lesson #' . $i + 1 . ' for course: ' . $course->name,
                            ],
                            'unit_amount' => $this->stripeService->getStripePrice($course->price),
                        ],
                        'quantity' => 1,
                    ];
                }

                $data['items'] = $items;
                $data['metadata'] = [
                    'course_uuid' => $booking->uuid,
                    'booked_id' => $booking->id
                ];
            }else{
                $data['items'] = [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Lesson for course: ' . $course->name,
                        ],
                        'unit_amount' => $this->stripeService->getStripePrice($course->price),
                    ],
                    'quantity' => 1,
                ]];

                $data['metadata'] = [
                    'booking_id' => $booking->id
                ];
            }


            $data['customer_email'] = Auth::user()->email;
            $data['success_url'] = route('students.bookings.show', ['booking' => $booking]);
            $data['cancel_url'] = route('students.bookings.index');
            $data['payment_intent_data'] = [
                'application_fee_amount' => $this->stripeService->getStripeFeeAmount($course->price),
                'on_behalf_of' => $this->stripeService->getConnectedAccountID($course),
                'transfer_data' => [
                    'destination' => $this->stripeService->getConnectedAccountID($course),
                ],
            ];

            $checkoutUrl = $this->stripeService->checkout($data);

            DB::commit();

            return $checkoutUrl;

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Booking creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', isset($exception->validator) ? [$exception->getMessage()] :  ['There was an error creating a booking.']);
        }
    }

    public function updateBookAndPay(Request $request, Booking $booking)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $course = $booking->course;

            $startTime = Carbon::parse($request->input('start_time'));
            $endTime = $startTime->copy()->addMinutes($course->duration);

            //TODO: do this in service!
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

            $booking->update([
                'start_time' => $startTime,
                'end_time' => $endTime,
                'note' => $request->input('note'),
            ]);

            //Create a stripe checkout session

            if($course->payment_option == CoursePaymentOption::Pre_Paid){
                $items = [];
                for ($i=0;$i<$course->number_of_lessons;$i++){
                    $items[] = [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => 'Lesson #' . $i + 1 . ' for course: ' . $course->name,
                            ],
                            'unit_amount' => $this->stripeService->getStripePrice($course->price),
                        ],
                        'quantity' => 1,
                    ];
                }

                $data['items'] = $items;
                $data['metadata'] = [
                    'course_uuid' => $booking->uuid,
                    'booked_id' => $booking->id
                ];
            }else{
                $data['items'] = [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Lesson for course: ' . $course->name,
                        ],
                        'unit_amount' => $this->stripeService->getStripePrice($course->price),
                    ],
                    'quantity' => 1,
                ]];

                $data['metadata'] = [
                    'booking_id' => $booking->id
                ];
            }


            $data['customer_email'] = Auth::user()->email;
            $data['success_url'] = route('students.bookings.show', ['booking' => $booking]);
            $data['cancel_url'] = route('students.cancel-booking-payment', ['booking' => $booking]);
            $data['payment_intent_data'] = [
                'application_fee_amount' => $this->stripeService->getStripeFeeAmount($course->price),
                'on_behalf_of' => $this->stripeService->getConnectedAccountID($course),
                'transfer_data' => [
                    'destination' => $this->stripeService->getConnectedAccountID($course),
                ],
            ];

            $checkoutUrl = $this->stripeService->checkout($data);

            DB::commit();

            return $checkoutUrl;

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Booking creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', isset($exception->validator) ? [$exception->getMessage()] :  ['There was an error creating a booking.']);
        }
    }

    public function payForBooking(Booking $booking){
        $course = $booking->course;
        //Create a stripe checkout session

        if($course->payment_option == CoursePaymentOption::Pre_Paid){
            $items = [];
            for ($i=0;$i<$course->number_of_lessons;$i++){
                $items[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Lesson #' . $i + 1 . ' for course: ' . $course->name,
                        ],
                        'unit_amount' => $this->stripeService->getStripePrice($course->price),
                    ],
                    'quantity' => 1,
                ];
            }

            $data['items'] = $items;
            $data['metadata'] = [
                'course_uuid' => $booking->uuid,
                'booked_id' => $booking->id
            ];
        }else{
            $data['items'] = [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Lesson for course: ' . $course->name,
                    ],
                    'unit_amount' => $this->stripeService->getStripePrice($course->price),
                ],
                'quantity' => 1,
            ]];

            $data['metadata'] = [
                'booking_id' => $booking->id
            ];
        }


        $data['customer_email'] = Auth::user()->email;
        $data['success_url'] = route('students.bookings.show', ['booking' => $booking]);
        $data['cancel_url'] = route('students.bookings.index');
        $data['payment_intent_data'] = [
            'application_fee_amount' => $this->stripeService->getStripeFeeAmount($course->price),
            'on_behalf_of' => $this->stripeService->getConnectedAccountID($course),
            'transfer_data' => [
                'destination' => $this->stripeService->getConnectedAccountID($course),
            ],
        ];

        $checkoutUrl = $this->stripeService->checkout($data);
        return Inertia::location($checkoutUrl);
    }

    public function cancelBooking(Booking $booking){
        $booking->update([
            'start_time' => null,
            'end_time' => null,
        ]);

        return redirect()->route('students.bookings.index');
    }

    public function drivingTest(Request $request){
        Auth::user()->driving_test_booked = $request->input('start_time');
        Auth::user()->save();

        return redirect()->back()
            ->with('success', 'Driving test booked successfully!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
