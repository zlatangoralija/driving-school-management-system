<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use App\Models\Timezone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccountSettingsController extends Controller
{
    public function accountSettings(){
        $data['account'] = Auth::user();
        $data['timezones'] = Timezone::select(
            DB::raw("CONCAT(name,' - ',value) AS label, value",), 'id')
            ->pluck('label', 'id');

        $currentTimezone = Timezone::where('name', Auth::user()->timezone)->first();
        if($currentTimezone){
            $data['current_timezone'] = $currentTimezone->id;
        }

        return Inertia::render('Users/Students/Settings/Account', $data);
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
        return Inertia::render('Users/Students/Settings/Payment');
    }

    public function updatePaymentSettings(Request $request){

    }

    public function bookingSettings(){
        return Inertia::render('Users/Students/Settings/Booking');
    }

    public function updateBookingSettings(Request $request){

    }
}
