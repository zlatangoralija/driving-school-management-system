<?php

namespace App\Services;

use App\Models\StripeUserIntegration;
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
}
