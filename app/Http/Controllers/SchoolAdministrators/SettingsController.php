<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Repositories\StorageRepository;
use App\Services\StorageService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->storageService = new StorageService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Inertia::share('layout.active_page', ['School settings']);
        $data['school'] = Auth::user()->tenant;
        $subscription = Auth::user()->subscriptions()->first();
        if($subscription){
            $data['subscription_data'] = $subscription->asStripeSubscription();
            $data['next_billing_date'] = Carbon::createFromTimeStamp($subscription->asStripeSubscription()->current_period_end)->format('F jS, Y');
        }

        return Inertia::render('Users/SchoolAdmins/Settings/Form', $data);
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
        //
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
    public function update(Request $request, Tenant $setting)
    {
        try {
            DB::beginTransaction();

            $input = $request->input();

            if ($request->filled('logo') && isset(json_decode($request->input('logo'), true)['isNew']) && json_decode($request->input('logo'), true)['isNew']) {
                $input['logo'] = $this->storageService->parseUploadedFile($input['logo'], 'logos/');
            } else{
                $input['logo'] = $setting->logo;
            }

            $setting->update($input);

            DB::commit();

            return redirect()->route('school-administrators.settings.index')
                ->with('success', 'School settings updated successfully');
        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('School settings update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error updating school settings.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
