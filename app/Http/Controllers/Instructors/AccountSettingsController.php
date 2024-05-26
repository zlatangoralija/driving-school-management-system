<?php

namespace App\Http\Controllers\Instructors;

use App\Http\Controllers\Controller;
use App\Models\StripeUserIntegration;
use App\Models\Timezone;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccountSettingsController extends Controller
{
    public function __construct()
    {
        $this->stripeService = new StripeService();
    }

    public function accountSettings(){
        $data['account'] = Auth::user();
        $data['timezones'] = Timezone::select(
            DB::raw("CONCAT(name,' - ',value) AS label, value",), 'id')
            ->pluck('label', 'id');

        $currentTimezone = Timezone::where('name', Auth::user()->timezone)->first();
        if($currentTimezone){
            $data['current_timezone'] = $currentTimezone->id;
        }

        return Inertia::render('Users/Instructors/Settings/Account', $data);
    }

    public function updateAccountSettings(Request $request){
        try {
            DB::beginTransaction();

            $input = $request->except('password');
            if($request->input('timezone')){
                $input['timezone'] = Timezone::find($request->input('timezone'))->name;
            }
            Auth::user()->update($input);

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
        return Inertia::render('Users/Instructors/Settings/Payment', $data);
    }

    public function updatePaymentSettings(Request $request){

    }
}
