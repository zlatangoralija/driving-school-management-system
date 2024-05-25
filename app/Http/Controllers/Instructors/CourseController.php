<?php

namespace App\Http\Controllers\Instructors;

use App\Enums\BookingStatus;
use App\Enums\CoursePaymentOption;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingInvitation;
use App\Models\Course;
use App\Models\User;
use App\Notifications\StudentCreated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('instructors.courses.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['students'] = Auth::user()->students()->pluck('users.email', 'users.id');
        return Inertia::render('Users/Instructors/Courses/Index', $data);
    }

    public function getCourses(Request $request){
        $data['courses'] = Course::with('instructor', 'admin')
            ->select('id', 'name', 'description', 'price', 'payment_option', 'number_of_lessons', 'duration', 'created_at', 'instructor_id', 'admin_id')
            ->where('instructor_id', Auth::id())
            ->orWhereHas('admin', function ($admin){
                return $admin->where('tenant_id', Auth::user()->tenant_id);
            })
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('name', 'like', '%'.$request->input('search').'%')
                    ->orWhere('email', 'like', '%'.$request->input('search').'%');
            })
            ->paginate($request->input('per_page') ?: 10);

        return $data;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('instructors.courses.index'),
            ],
            2 => [
                'page' => 'Create course',
                'url' => route('instructors.courses.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['payment_options'] = array_map(function ($option){
            return [
                'value' => $option->value,
                'label' => str_replace('_', ' ', $option->name),
            ];
        }, CoursePaymentOption::cases());

        return Inertia::render('Users/Instructors/Courses/Form', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['instructor_id'] = Auth::id();
            $course = Course::create($input);

            DB::commit();

            return redirect()->route('instructors.courses.index')
                ->with('success', 'Course created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Course creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating a course.']);
        }
    }

    public function assign(Request $request){

        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['instructor_id'] = Auth::id();
            $course = Course::find($request->input('course_id'));
            $uniqueID = Str::uuid();

            foreach ($request->input('student_ids') as $id){
                //first assign student to the course
                $student = User::find($id);
                $student->courses()->attach($course, [
                    'uuid' => $uniqueID,
                    'created_at' => Carbon::now(),
                ]);

                //then create pending bookings for student (number of lessons = number of pending bookings)
                for ($i=0;$i<$course->number_of_lessons;$i++){
                    Booking::create([
                        'course_id' => $course->id,
                        'student_id' => $id,
                        'instructor_id' => Auth::id(),
                        'admin_id' => $course->admin_id,
                        'status' => BookingStatus::Pending,
                        'uuid' => $uniqueID,
                    ]);
                }
            }

            DB::commit();

            //todo: send notification to each student

            return redirect()->route('instructors.courses.index')
                ->with('success', 'Course assigned successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Invitation creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error sending an invitation.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('instructors.courses.index'),
            ],
            2 => [
                'page' => $course->name,
                'url' => route('instructors.courses.show', ['course' => $course]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['course'] = $course;
        $data['students'] = Auth::user()->students()->pluck('users.email', 'users.id');

        return Inertia::render('Users/Instructors/Courses/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Courses',
                'url' => route('instructors.courses.index'),
            ],
            2 => [
                'page' => $course->name,
                'url' => route('instructors.courses.edit', ['course' => $course]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Courses']);

        $data['course'] = $course;
        $data['payment_options'] = array_map(function ($option){
            return [
                'value' => $option->value,
                'label' => str_replace('_', ' ', $option->name),
            ];
        }, CoursePaymentOption::cases());

        return Inertia::render('Users/Instructors/Courses/Form', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $course->update($input);

            DB::commit();

            return redirect()->route('instructors.courses.index')
                ->with('success', 'Course updated successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Course update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error updating course.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        try {
            DB::beginTransaction();
            $course->delete();
            DB::commit();

            return redirect()->route('instructors.courses.index')
                ->with('success', 'Course deleted successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Course delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error deleting course.']);
        }
    }
}
