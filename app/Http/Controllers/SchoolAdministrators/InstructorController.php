<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\InstructorCreated;
use App\Notifications\InstructorUpdated;
use App\Notifications\SchoolAdminCreated;
use App\Notifications\SchoolAdminUpdated;
use Illuminate\Http\Request;
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
        Inertia::share('layout.active_page', ['Instructors']);
        $data['instructor'] = $instructor;
        return Inertia::render('Users/SchoolAdmins/Instructors/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $instructor)
    {
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
