<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use App\Models\User;
use App\Notifications\NewReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('students.dashboard'),
            ],
            2 => [
                'page' => 'Leave a review',
                'url' => route('students.reviews.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Reviews']);

        $data['course'] = Course::find($request->input('course'));
        $data['instructor'] = User::find($request->input('instructor'));
        $data['pivot_id'] = $request->input('pivot_id');

        return Inertia::render('Users/Students/Reviews/Form', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['student_id'] = Auth::id();
            $input['course_id'] = $request->input('course');
            $input['instructor_id'] = $request->input('instructor');
            $review = Review::create($input);

            DB::commit();

            $review->instructor->notify(new NewReview($review));

            return redirect()->route('students.courses.show', ['course' => $request->input('pivot_id')])
                ->with('success', 'Course review created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Review creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating a course.']);
        }
    }

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
