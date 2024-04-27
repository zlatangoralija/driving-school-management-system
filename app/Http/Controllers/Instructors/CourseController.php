<?php

namespace App\Http\Controllers\Instructors;

use App\Enums\CoursePaymentOption;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use App\Notifications\StudentCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Inertia::share('layout.active_page', ['Courses']);

        $data['students'] = Auth::user()->students()->pluck('users.email', 'users.id');
        return Inertia::render('Users/Instructors/Courses/Index', $data);
    }

    public function getCourses(Request $request){
        $data['courses'] = Course::where('instructor_id', Auth::id())
            ->select('id', 'name', 'description', 'price', 'payment_option', 'number_of_lessons', 'created_at')
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

//    public function inviteToBook(Request $request){
//        dd($request->input());
//    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
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
