<?php

use App\Http\Controllers\PublicController;
use App\Http\Controllers\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        require __DIR__.'/auth.php';
        Route::get('/', [PublicController::class, 'index'])->name('home');
        Route::post('uploads', [UploadController::class, 'upload'])->name('upload-file');

        //Stripe
        Route::post('/stripe/webhook', [\Laravel\Cashier\Http\Controllers\WebhookController::class, 'handleWebhook']);
        Route::get('/billing-portal', function (Request $request) {
            return $request->user()->redirectToBillingPortal();
        })->name('stripe-billing-portal');

        Route::get('/integrations/stripe/express', [\App\Http\Controllers\StripeIntegrationController::class, 'express'])->middleware(['auth'])->name('stripe-integration-express');
        Route::get('/integrations/stripe/success/{account_id}', [\App\Http\Controllers\StripeIntegrationController::class, 'integrationSuccess'])->middleware(['auth'])->name('stripe-integration-success');
        Route::post('/integrations/stripe/unlink', [\App\Http\Controllers\StripeIntegrationController::class, 'unlinkStripe'])->middleware(['auth'])->name('stripe-integration-unlink');
    });
}


