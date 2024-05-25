<?php

namespace App\Services;

use App\Enums\UserType;
use App\Models\StripeUserIntegration;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;

class StripeService
{
    public function __construct()
    {
        $this->client = new \Stripe\StripeClient(config('cashier.secret'));
    }

    public function createExpressAccount($user){
        $res = $this->client->accounts->create([
            'email' => $user->email,
            'controller' => [
                'fees' => ['payer' => 'application'],
                'losses' => ['payments' => 'application'],
                'stripe_dashboard' => ['type' => 'express'],
            ],
        ]);

        $onboarding = $this->client->accountLinks->create([
            'account' => $res->id,
            'refresh_url' => 'https://example.com/reauth',
            'return_url' => route('stripe-integration-success', ['account_id' => $res->id]),
            'type' => 'account_onboarding',
        ]);

        return $onboarding->url;
    }

    public function retreiveAccount($accountID){
        return $this->client->accounts->retrieve($accountID);
    }

    public function loginLink($accountID){
        return $this->client->accounts->createLoginLink($accountID, [])->url;
    }

    public function checkout($data){
        $stripe = new \Stripe\StripeClient(config('cashier.secret'));
        $session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $data['items'],
            'metadata' => $data['metadata'],
            'customer_email' => $data['customer_email'],
            'mode' => 'payment',
            'payment_intent_data' => $data['payment_intent_data'],
            'success_url' => $data['success_url'],
            'cancel_url' => $data['cancel_url'],
        ]);

        return $session->url;
    }

    public function getStripePrice($price)
    {
        return bcmul($price, 100);
    }

    public function getStripeFeeAmount($total)
    {
        return self::getStripePrice(bcadd(bcmul($total, 0.015, 2), 0.25, 2));
    }

    public function getConnectedAccountID($course = null){
        $tenant = Auth::user()->tenant->id;

        //First see if school administrator has setup the connected account
        $schoolAdministrator = User::where('type', UserType::SchoolAdmin)
            ->where('tenant_id', $tenant)
            ->whereHas('stripeIntegration', function ($interation){
                return $interation->where('status', 1);
            })
            ->first();

        if($schoolAdministrator){
            return $schoolAdministrator->activeStripeIntegration->account_id;
        }

        //Secondly, if school admin didnt setup the stripe integration, check if course instructor has one setup
        if($course && $course->instructor){
            return $course->instructor->activeStripeIntegration->account_id;
        }
    }
}
