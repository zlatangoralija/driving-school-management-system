<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Http\Controllers\Controller;
use App\Models\StripeUserIntegration;
use App\Models\Tenant;
use App\Services\StorageService;
use App\Services\StripeService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccountSettingsController extends Controller
{
    public function __construct()
    {
        $this->storageService = new StorageService();
        $this->stripeService = new StripeService();
    }

    public function accountSettings(){
        $data['account'] = Auth::user();
        return Inertia::render('Users/SchoolAdmins/Settings/Account', $data);
    }

    public function updateAccountSettings(Request $request){
        try {
            DB::beginTransaction();

            Auth::user()->update($request->except('password'));

            if($request->input('password')){
                Auth::user()->update([
                    'password' => $request->input('password')
                ]);
            }

            DB::commit();

            return redirect()->route('instructors.account-settings')
                ->with('success', 'Account details updated successfully');

        } catch (\Exception $exception){
            DB::rollBack();
            Log::info('Account update error');
            Log::info($exception->getMessage());
            Log::info($exception->getTraceAsString());

            return redirect()->back()
                ->with('error', ['There was an error creating a course.']);
        }
    }

    public function paymentSettings(){
        $data['active_integration'] = StripeUserIntegration::where('user_id', Auth::id())
            ->where('status', 1)
            ->first();

        $data['express_dashboard'] = $data['active_integration'] ? $this->stripeService->loginLink($data['active_integration']->account_id) : null;
        $data['connect_url'] = route('stripe-integration-express');

        return Inertia::render('Users/SchoolAdmins/Settings/Payment', $data);
    }

    public function updatePaymentSettings(Request $request){

    }

    public function bookingSettings(){
        return Inertia::render('Users/SchoolAdmins/Settings/Booking');
    }

    public function updateBookingSettings(Request $request){

    }

    public function schoolSettings()
    {

        $data['school'] = Auth::user()->tenant;
        $subscription = Auth::user()->subscriptions()->first();
        if($subscription){
            $data['subscription_data'] = $subscription->asStripeSubscription();
            $data['next_billing_date'] = Carbon::createFromTimeStamp($subscription->asStripeSubscription()->current_period_end)->format('F jS, Y');
        }

        return Inertia::render('Users/SchoolAdmins/Settings/School', $data);
    }

    public function updateSchoolSettings(Request $request, Tenant $setting)
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

            return redirect()->route('school-administrators.school-settings')
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
}
