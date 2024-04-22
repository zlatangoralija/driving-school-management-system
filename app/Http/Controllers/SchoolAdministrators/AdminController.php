<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolAdminRequest;
use App\Models\User;
use App\Notifications\SchoolAdminCreated;
use App\Notifications\SchoolAdminUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Inertia::share('layout.active_page', ['Administrators']);
        return Inertia::render('Users/SchoolAdmins/Administrators/Index');
    }

    public function getAdministrators(Request $request){
        $data['administrators'] = User::where('type', UserType::SchoolAdmin)
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
        Inertia::share('layout.active_page', ['Administrators']);

        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Administrators/Form', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SchoolAdminRequest $request)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $input['type'] = UserType::SchoolAdmin;
            $admin = User::create($input);

            DB::commit();

            if($admin){
                $admin->notify(new SchoolAdminCreated($input));
            }

            return redirect()->route('school-administrators.administrators.index')
                ->with('success', 'School administrator profile created successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('School admin creation error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating school administrator profile.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $administrator)
    {
        Inertia::share('layout.active_page', ['Administrators']);
        $data['administrator'] = $administrator;
        return Inertia::render('Users/SchoolAdmins/Administrators/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $administrator)
    {
        Inertia::share('layout.active_page', ['Administrators']);

        $data['administrator'] = $administrator;
        $data['statuses'] = array_map(function ($status){
            return [
                'value' => $status->value,
                'label' => $status->name,
            ];
        }, UserStatus::cases());

        return Inertia::render('Users/SchoolAdmins/Administrators/Form', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $administrator)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();
            $administrator->update([
                'name' => $input['name'],
                'email' => $input['email'],
            ]);

            if($input['password']){
                $administrator->password = $input['password'];
                $administrator->save();
            }

            DB::commit();

            if($administrator->getChanges()){
                if(isset($administrator->getChanges()['email']) || isset($administrator->getChanges()['password'])){
                    $administrator->notify(new SchoolAdminUpdated($input));
                }
            }

            return redirect()->route('school-administrators.administrators.index');
        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('School admin update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $administrator)
    {
        try {
            DB::beginTransaction();
            $administrator->delete();
            DB::commit();

            return redirect()->route('school-administrators.administrators.index')
                ->with('success', 'School administrator profile deleted successfully');
        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('School admin delete error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());
        }
    }
}
