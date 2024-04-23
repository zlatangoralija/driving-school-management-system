<?php

use App\Http\Controllers\PublicController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        require __DIR__.'/auth.php';
        Route::get('/', [PublicController::class, 'index'])->name('home');
        Route::post('uploads', [UploadController::class, 'upload'])->name('upload-file');
    });
}


