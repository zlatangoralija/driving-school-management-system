<?php

namespace App\Http\Controllers;

use App\Models\StripeUserIntegration;
use App\Repositories\Segment\SegmentRepository;
use App\Services\StripeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\OAuth;
use Stripe\Stripe;

class StripeIntegrationController extends Controller
{

    public function __construct()
    {
        $this->stripeService = new StripeService();
    }

    public function express(){
        $res = $this->stripeService->createExpressAccount(Auth::user());
        return redirect($res);
    }


    public function integrationSuccess($accountID)
    {
        try {
            $account = $this->stripeService->retreiveAccount($accountID);

            if($account && $account->details_submitted){
                StripeUserIntegration::create([
                    'user_id' => Auth::id(),
                    'account_id' => $accountID,
                    'status' => 1,
                ]);
            }

            return redirect('/')->with('success', 'Stripe Express is connected');
        } catch (\Exception $exception) {
            Log::info('There was an error with stripe integration: '.$exception->getMessage());

            return redirect('/')->with('error', 'There was an error connecting with Stripe Express. Please try again');
        }
    }

    public function unlinkStripe(): RedirectResponse
    {
        //todo: unlink account
        try {
            if (Auth::user()->stripeIntegration) {
                Auth::user()->stripeIntegration()->delete();

                return redirect()->url('/')->with('success', 'Stripe Express has been disconnected');
            }
        } catch (\Exception $exception) {
            Log::info('There was an error with unlinking Stripe account: '.$exception->getMessage());

            return redirect()->url('/')->with('error', 'There was an error with disconnecting your Stripe account:. Please try again');
        }
    }
}
