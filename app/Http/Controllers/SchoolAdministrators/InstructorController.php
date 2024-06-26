<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\BookingStatus;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CourseUser;
use App\Models\User;
use App\Notifications\InstructorCreated;
use App\Notifications\InstructorUpdated;
use App\Notifications\SchoolAdminCreated;
use App\Notifications\SchoolAdminUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InstructorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);

        return Inertia::render('Users/SchoolAdmins/Instructors/Index');
    }

    public function getInstructors(Request $request){
        $data['instructors'] = User::where('type', UserType::Instructor)
            ->select('id', 'name', 'email', 'type', 'status')
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
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
            ],
            2 => [
                'page' => 'Create instructor',
                'url' => route('school-administrators.instructors.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);

        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Instructors/Form', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['type'] = UserType::Instructor;
            $instructor = User::create($input);

            DB::commit();

            if($instructor){
                $instructor->notify(new InstructorCreated($input));
            }

            return redirect()->route('school-administrators.instructors.index')
                ->with('success', 'Instructor profile created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Instructor creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating instructor profile.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $instructor)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
            ],
            2 => [
                'page' => $instructor->name,
                'url' => route('school-administrators.instructors.show', ['instructor' => $instructor]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);

        $data['instructor'] = $instructor;

        $data['number_of_courses'] = CourseUser::with(['course', 'course.instructor'])
            ->select('id', 'user_id', 'course_id', 'uuid')
            ->whereHas('course', function ($course) use ($instructor){
                return $course->where('instructor_id', $instructor->id);
            })
            ->count();

        $data['number_of_lessons_booked'] = Booking::where('instructor_id', $instructor->id)
            ->where('status', BookingStatus::Booked)
            ->count();

        return Inertia::render('Users/SchoolAdmins/Instructors/Show', $data);
    }

    public function instructorBookings(User $instructor){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
            ],
            2 => [
                'page' => $instructor->name,
                'url' => route('school-administrators.instructors.show', ['instructor' => $instructor]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);

        $data['instructor'] = $instructor;
        return Inertia::render('Users/SchoolAdmins/Instructors/Bookings', $data);
    }

    public function instructorCourses(User $instructor){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('school-administrators.instructors.index'),
            ],
            2 => [
                'page' => $instructor->name,
                'url' => route('school-administrators.instructors.show', ['instructor' => $instructor]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);
        $data['instructor'] = $instructor;

        $data['courses'] = CourseUser::with(['course', 'course.instructor', 'student'])
            ->select('id', 'user_id', 'course_id', 'uuid')
            ->whereHas('course', function ($course) use($instructor){
                return $course->where('instructor_id', $instructor->id);
            })
            ->get();

        return Inertia::render('Users/SchoolAdmins/Instructors/Courses', $data);
    }

    public function getInstructorBookings(User $instructor, Request $request){
        $data['bookings'] = Booking::where('instructor_id', $instructor->id)
            ->select('id', 'start_time', 'end_time', 'status', 'course_id', 'student_id', 'instructor_id', 'created_at', 'payment_status')
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $instructor)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
            ],
            2 => [
                'page' => $instructor->name,
                'url' => route('school-administrators.instructors.edit', ['instructor' => $instructor]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Instructors']);

        $data['instructor'] = $instructor;
        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Instructors/Form', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $instructor)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $instructor->update([
                'name' => $input['name'],
                'email' => $input['email'],
                'status' => $input['status'],
            ]);

            if($input['password']){
                $instructor->password = $input['password'];
                $instructor->save();
            }

            DB::commit();

            if($instructor->getChanges()){
                if(isset($instructor->getChanges()['email']) || isset($instructor->getChanges()['password'])){
                    $instructor->notify(new InstructorUpdated($input));
                }
            }

            return redirect()->route('school-administrators.instructors.index')
                ->with('success', 'Instructor profile updated successfully');
        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Instructor update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error updating instructor profile.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $instructor)
    {
        try {
            DB::beginTransaction();
            $instructor->delete();
            DB::commit();

            return redirect()->route('school-administrators.instructors.index')
                ->with('success', 'Instructor profile deleted successfully');
        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Instructor delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error deleting instructor profile.']);
        }
    }
}
