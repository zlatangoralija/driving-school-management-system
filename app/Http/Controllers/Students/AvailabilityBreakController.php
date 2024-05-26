<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityBreak;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AvailabilityBreakController extends Controller
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
                'page' => 'Booking settings',
                'url' => route('students.availability-breaks.index'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Availability breaks']);

        return Inertia::render('Users/Students/AvailabilityBreaks/Index');
    }

    public function getBreaks(Request $request){
        $data['breaks'] = AvailabilityBreak::with('student')
            ->select('id', 'user_id', 'start_time', 'end_time', 'reason', 'created_at')
            ->where('user_id', Auth::id())
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
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
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Booking settings',
                'url' => route('students.availability-breaks.index'),
            ],
            2 => [
                'page' => 'Add new availability break',
                'url' => route('students.availability-breaks.create'),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Availability breaks']);

        return Inertia::render('Users/Instructors/AvailabilityBreaks/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['user_id'] = Auth::id();
            $break = AvailabilityBreak::create($input);
            DB::commit();

            return redirect()->route('students.availability-breaks.index')
                ->with('success', 'Availability break created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Availability break creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating an availability break.']);
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
    public function edit(AvailabilityBreak $availabilityBreak)
    {
        $breadcrumbs = [
            0 => [
                'page' => 'Dashboard',
                'url' => route('students.dashboard'),
            ],
            1 => [
                'page' => 'Availability settings',
                'url' => route('students.availability-breaks.index'),
            ],
            2 => [
                'page' => 'Edit availability break',
                'url' => route('students.availability-breaks.edit', ['availability_break' => $availabilityBreak]),
                'active' => true,
            ],
        ];
        Inertia::share('layout.breadcrumbs', $breadcrumbs);
        Inertia::share('layout.active_page', ['Availability breaks']);

        $data['break'] = $availabilityBreak;

        return Inertia::render('Users/Instructors/AvailabilityBreaks/Form', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AvailabilityBreak $availabilityBreak)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $availabilityBreak->update($request->input());
            DB::commit();

            return redirect()->route('students.availability-breaks.index')
                ->with('success', 'Availability break updated successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Availability break update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error updating the availability break.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AvailabilityBreak $availabilityBreak)
    {
        try {
            DB::beginTransaction();
            $availabilityBreak->delete();
            DB::commit();

            return redirect()->route('students.availability-breaks.index')
                ->with('success', 'Availability break deleted successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Availability break delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error deleting availability break.']);
        }
    }
}
