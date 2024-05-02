<?php

namespace App\Http\Controllers\Instructors;

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
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
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('instructors.students.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        return Inertia::render('Users/Instructors/Students/Index');
    }

    public function getStudents(Request $request){
        $data['students'] = Auth::user()->students()
            ->select('users.id', 'users.name', 'users.email', 'users.type', 'users.status')
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
                'page' => 'Students',
                'url' => route('instructors.students.index'),
            ],
            2 => [
                'page' => 'Create students',
                'url' => route('instructors.students.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/Instructors/Students/Form', $data);
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
            $input['type'] = UserType::Student;
            $input['tenant_id'] = Auth::user()->tenant->id;
            $student = User::create($input);

            Auth::user()->students()->attach($student->id);

            DB::commit();

            $student->notify(new StudentCreated($input));

            return redirect()->route('instructors.students.index')
                ->with('success', 'Student created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Student creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating a student.']);
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
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('instructors.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('instructors.students.show', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);
        $data['student'] = $student;
        return Inertia::render('Users/Instructors/Students/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $student)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('instructors.dashboard'),
            ],
            1 => [
                'page' => 'Students',
                'url' => route('instructors.students.index'),
            ],
            2 => [
                'page' => $student->name,
                'url' => route('instructors.students.edit', ['student' => $student]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Students']);

        $data['student'] = $student;
        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/Instructors/Students/Form', $data);
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

            return redirect()->route('instructors.students.index')
                ->with('success', 'Student profile deleted successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Student delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error deleting student profile.']);
        }
    }
}
