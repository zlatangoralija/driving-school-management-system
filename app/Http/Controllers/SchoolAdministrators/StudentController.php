<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\BookingStatus;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CourseUser;
use App\Models\User;
use App\Notifications\SchoolAdminCreated;
use App\Notifications\SchoolAdminUpdated;
use App\Notifications\StudentCreated;
use App\Notifications\StudentUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
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
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);
        return Inertia::render('Users/SchoolAdmins/Students/Index');
    }

    public function getStudents(Request $request){
        $data['students'] = User::where('type', UserType::Student)
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
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => 'Create student',
                'url' => route('school-administrators.students.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        $data['instructors'] = User::where('type', UserType::Instructor)->pluck('name', 'id');
        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Students/Form', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['type'] = UserType::Student;
            $input['tenant'] = Auth::user()->tenant->id;
            $student = User::create($input);

            DB::commit();

            if($student){

                $instructor = User::find($request->input('instructor_id'))->first();
                $instructor->students()->attach($student->id);

                $student->notify(new StudentCreated($input));
            }

            return redirect()->route('school-administrators.students.index')
                ->with('success', 'Student profile created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Student creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating student profile.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $student)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('school-administrators.students.show', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);
        $data['student'] = $student;

        $data['number_of_courses'] = CourseUser::with(['course', 'course.instructor'])
            ->select('id', 'user_id', 'course_id', 'uuid')
            ->where('user_id', $student->id)
            ->count();

        $data['number_of_lessons_booked'] = Booking::where('student_id', $student->id)
            ->where('status', BookingStatus::Booked)
            ->count();

        return Inertia::render('Users/SchoolAdmins/Students/Show', $data);
    }

    public function studentBookings(User $student){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Instructors',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('school-administrators.students.show', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        $data['student'] = $student;
        return Inertia::render('Users/SchoolAdmins/Students/Bookings', $data);
    }

    public function studentDrivingTest(User $student){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('school-administrators.students.show', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);
        $data['student'] = $student;

        return Inertia::render('Users/SchoolAdmins/Students/DrivingTest', $data);
    }

    public function studentCourses(User $student){
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('school-administrators.students.show', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);
        $data['student'] = $student;

        $data['courses'] = CourseUser::with(['course', 'course.instructor', 'student'])
            ->select('id', 'user_id', 'course_id', 'uuid')
            ->where('user_id', $student->id)
            ->get();

        return Inertia::render('Users/SchoolAdmins/Students/Courses', $data);
    }

    public function getStudentBookings(User $student, Request $request){
        $data['bookings'] = Booking::where('student_id', $student->id)
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
    public function edit(User $student)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('school-administrators.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('school-administrators.students.edit', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        $data['student'] = $student;
        $data['instructors'] = User::where('type', UserType::Instructor)->pluck('name', 'id');
        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Students/Form', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $student)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $student->update($request->except(['password']));

            if($input['password']){
                $student->password = $input['password'];
                $student->save();
            }

            DB::commit();

            if($student->getChanges()){
                if(isset($student->getChanges()['email']) || isset($student->getChanges()['password'])){
                    $student->notify(new StudentUpdated($input));
                }
            }

            $instructor = User::find($request->input('instructor_id'))->first();
            if($instructor){
                $instructor->students()->attach($student->id);
            }

            return redirect()->route('school-administrators.students.index')
                ->with('success', 'Student profile updated successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Student update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error updating student profile.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $student)
    {
        try {
            DB::beginTransaction();
            $student->delete();
            DB::commit();

            return redirect()->route('school-administrators.students.index')
                ->with('success', 'Student profile deleted successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('School admin delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error deleting student profile.']);
        }
    }
}
