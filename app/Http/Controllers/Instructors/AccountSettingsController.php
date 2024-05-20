<?php

namespace App\Http\Controllers\Instructors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccountSettingsController extends Controller
{
    public function accountSettings(){
        $data['account'] = Auth::user();
        return Inertia::render('Users/Instructors/Settings/Account', $data);
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
        return Inertia::render('Users/Instructors/Settings/Payment');
    }

    public function updatePaymentSettings(Request $request){

    }

    public function bookingSettings(){
        return Inertia::render('Users/Instructors/Settings/Booking');
    }

    public function updateBookingSettings(Request $request){

    }
}
